import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  Spacing,
  Styles,
} from "@/constants/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebaseConfig";
import { sendMessage, subscribeToConversation } from "@/services/chatService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
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
  const [userId, setUserId] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadOtherUser();

    const unsubscribe = subscribeToConversation(chatId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

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

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.uid) return;

    try {
      await sendMessage(chatId, user.uid, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const shouldShowDateHeader = (currentMessage: any, previousMessage: any) => {
    if (!previousMessage?.timestamp) return true;
    if (!currentMessage?.timestamp) return false;

    const currentDate = currentMessage.timestamp.toDate().toDateString();
    const previousDate = previousMessage.timestamp.toDate().toDateString();

    return currentDate !== previousDate;
  };

  const formatDateHeader = (timestamp: any) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const day = date.getDate();
    const month = date
      .toLocaleString("sv-SE", { month: "short" })
      .toUpperCase();
    const time = date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${day} ${month} ${time}`;
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "";

    return timestamp.toDate().toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            const otherUserId = otherUser?.id;
            if (otherUserId) {
              router.push(`/view-profile/${otherUserId}`);
            }
          }}
          style={styles.headerContent}
        >
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
        </Pressable>
      </View>

      <View style={styles.divider} />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        renderItem={({ item, index }) => {
          const isMyMessage = item.senderId === user?.uid;
          const showDateHeader = shouldShowDateHeader(
            item,
            messages[index - 1]
          );

          return (
            <View>
              {showDateHeader && (
                <View style={styles.dateHeaderContainer}>
                  <Text style={styles.dateHeaderText}>
                    {formatDateHeader(item.timestamp)}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={() =>
                  setSelectedMessageId(
                    selectedMessageId === item.id ? null : item.id
                  )
                }
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

                {selectedMessageId === item.id && item.timestamp && (
                  <Text style={[Styles.bodyXS, styles.time]}>
                    {formatMessageTime(item.timestamp)}
                  </Text>
                )}
              </Pressable>
            </View>
          );
        }}
      />

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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
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
  dateHeaderContainer: {
    alignItems: "center",
    marginVertical: Spacing.m,
  },
  dateHeaderText: {
    ...Styles.bodyS,
    color: Colors.details,
    fontWeight: "600",
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
  time: {
    paddingHorizontal: Spacing.s,
    color: Colors.details,
  },
});
