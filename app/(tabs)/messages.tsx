import { Colors } from "@/constants/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { getChats } from "@/services/chatService";
import { getUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadConversations();
    }
  }, [user?.uid]);

  const loadConversations = async () => {
    try {
      const chats = await getChats(user?.uid!);

      const conversationsWithUserInfo = await Promise.all(
        chats.map(async (chat) => {
          const otherUserId = chat.participants.find(
            (id: string) => id !== user?.uid
          );
          if (!otherUserId) return null;

          const otherUserProfile = await getUserProfile(otherUserId);

          return {
            id: chat.id,
            lastMessage: chat.lastMessage,
            lastMessageTime: chat.lastMessageTime,
            otherUserId,
            otherUserName: otherUserProfile?.username || "Okänd",
            otherUserImage: otherUserProfile?.profileImageUrl || null,
          };
        })
      );
      setConversations(
        conversationsWithUserInfo.filter((conv) => conv !== null)
      );
    } catch (error) {
      console.error("Error loading conversations", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/conversation/${item.id}`)}>
            {/* TODO: We'll build this together */}
            <Text>{item.otherUserName}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
});
