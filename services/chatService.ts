import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { increment, getDoc } from "firebase/firestore";

// Helper function to create a consistent chatId
function getChatId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join("_");
}

// Check if chat exists between two users
export async function getChatBetweenUsers(userId1: string, userId2: string) {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId1));
    const snapshot = await getDocs(q);

    // Now filter to find the chat that has BOTH users
    const chat = snapshot.docs.find((doc) => {
      const participants = doc.data().participants;
      return participants.includes(userId1) && participants.includes(userId2);
    });

    if (chat) {
      return chat.id;
    }

    return null;
  } catch (error) {
    console.error("Error checking for existing chat:", error);
    throw error;
  }
}

export async function createChat(userId1: string, userId2: string) {
  try {
    const chatId = getChatId(userId1, userId2);
    const chatRef = doc(collection(db, "chats"));

    await setDoc(chatRef, {
      chatId,
      participants: [userId1, userId2],
      lastMessage: "",
      lastMessageTime: serverTimestamp(),
      unreadCounts: {
        [userId1]: 0,
        [userId2]: 0,
      },
    });

    return chatRef.id;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

//Get all chats that [userId] is in - to display in messages tab
export async function getChats(userId: string) {
  try {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId)
    );

    const querySnapshot = await getDocs(q);
    const chats: any[] = [];

    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    return chats;
  } catch (error) {
    console.error("Error getting chats:", error);
    throw error;
  }
}

//Get all messages betweeen two users
export async function getConversation(chatId: string) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const querySnapshot = await getDocs(q);
    const messages: any[] = [];

    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string
) {
  try {
    const chatDocSnap = await getDoc(doc(db, "chats", chatId));
    const participants = chatDocSnap.data()?.participants || [];
    const recipientId = participants.find((id: string) => id !== senderId);

    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId: senderId,
      text: text,
      timestamp: serverTimestamp(),
    });

    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      [`unreadCounts.${recipientId}`]: increment(1),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function deleteChat(chatId: string): Promise<void> {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesSnapshot = await getDocs(messagesRef);

    const deletePromises = messagesSnapshot.docs.map((messageDoc) =>
      deleteDoc(messageDoc.ref)
    );
    await Promise.all(deletePromises);
    await deleteDoc(doc(db, "chats", chatId));

    console.log("Chat and all messages deleted!");
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}

export function subscribeToConversation(
  chatId: string,
  callback: (messages: any[]) => void
): Unsubscribe {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: any[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
}

export async function markChatAsRead(
  chatId: string,
  userId: string
): Promise<void> {
  try {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      [`unreadCounts.${userId}`]: 0,
    });
  } catch (error) {
    console.error("Error marking chat as read:", error);
    throw error;
  }
}

export async function getTotalUnreadCount(userId: string): Promise<number> {
  try {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId)
    );

    const querySnapshot = await getDocs(q);
    let totalUnread = 0;

    querySnapshot.forEach((doc) => {
      const unreadCounts = doc.data().unreadCounts || {};
      totalUnread += unreadCounts[userId] || 0;
    });

    return totalUnread;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

export async function migrateExistingChats() {
  try {
    const chatsRef = collection(db, "chats");
    const snapshot = await getDocs(chatsRef);

    const updatePromises = snapshot.docs.map(async (chatDoc) => {
      const data = chatDoc.data();

      // Only update if unreadCounts doesn't exist
      if (!data.unreadCounts) {
        const participants = data.participants || [];
        const unreadCounts: any = {};

        participants.forEach((userId: string) => {
          unreadCounts[userId] = 0;
        });

        await updateDoc(chatDoc.ref, { unreadCounts });
        console.log(`✅ Migrated chat ${chatDoc.id}`);
      }
    });

    await Promise.all(updatePromises);
    console.log("🎉 All chats migrated!");
  } catch (error) {
    console.error("Error migrating chats:", error);
  }
}
