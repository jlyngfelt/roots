import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

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

// Create a chat between to users if no chat exists
export async function createChat(userId1: string, userId2: string) {
  try {
    const chatId = getChatId(userId1, userId2);

    const chatRef = doc(collection(db, "chats"));
    await setDoc(chatRef, {
      chatId,
      participants: [userId1, userId2],
      lastMessage: "",
      lastMessageTime: serverTimestamp(),
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

//Send a message to another user
export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string
) {
  try {
    // Step 1: Add message to subcollection
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId: senderId,
      text: text,
      timestamp: serverTimestamp(),
    });

    // Step 2: Update the chat document
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
