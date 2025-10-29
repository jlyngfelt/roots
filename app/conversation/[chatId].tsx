import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  Spacing,
  Styles,
} from "@/constants/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebaseConfig";
import { getConversation, sendMessage } from "@/services/chatService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ConversationScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<any>(null);

  useEffect(() => {
    loadMessages();
    loadOtherUser();
  }, [chatId]);

  const loadOtherUser = async () => {
    try {
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      if (chatDoc.exists()) {
        const participants = chatDoc.data().participants;
        const otherUserId = participants.find((id: string) => id !== user?.uid);

        if (otherUserId) {
          const profile = await getUserProfile(otherUserId);
          setOtherUser(profile);
        }
      }
    } catch (error) {
      console.error("Error loading other user:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const msgs = await getConversation(chatId);
      setMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.uid) return;

    try {
      await sendMessage(chatId, user.uid, newMessage.trim());
      setNewMessage("");
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Image
          source={
            otherUser?.profileImageUrl
              ? { uri: otherUser.profileImageUrl }
              : require("@/assets/profilePicture.png")
          }
          style={styles.headerProfileImage}
        />

        <Text style={styles.headerUsername}>
          {otherUser?.username || "Loading..."}
        </Text>
      </View>

      <View style={styles.divider} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMyMessage = item.senderId === user?.uid;

          return (
            <View
              style={[
                styles.messageBubbleContainer,
                isMyMessage
                  ? styles.myMessageContainer
                  : styles.theirMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isMyMessage
                    ? styles.myMessageBubble
                    : styles.theirMessageBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMyMessage
                      ? styles.myMessageText
                      : styles.theirMessageText,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Skriv ett meddelande..."
          style={styles.input}
          multiline
        />
        <Pressable onPress={handleSend} style={styles.sendButton}>
          <IconSymbol name="paperplane.fill" size={28} color={Colors.details} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
  },
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.s,
  },
  headerUsername: {
    ...Styles.heading2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey,
    marginBottom: Spacing.m,
  },
  messageBubbleContainer: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  theirMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "70%",
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.xl,
  },
  myMessageBubble: {
    backgroundColor: Colors.details,
  },
  theirMessageBubble: {
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.details,
  },
  messageText: {
    ...Styles.bodyM,
  },
  myMessageText: {
    color: Colors.light,
  },
  theirMessageText: {
    color: Colors.details,
  },
  inputContainer: {
    flexDirection: "row",
    padding: Spacing.m,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.details,
    borderRadius: 30,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    marginRight: Spacing.xs,
    maxHeight: 100,
    ...Styles.bodyM,
  },
  sendButton: {
    padding: Spacing.s,
  },
});
