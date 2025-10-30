import { SearchInput } from "@/components/ui/inputs/SearchInput";
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
import { Image } from "tamagui";

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const getSearchedConversations = (conversations: any[], query: string) => {
      if (!query.trim()) return conversations;
  
      const lowerQuery = query.toLowerCase();
  
      return conversations.filter((conversation) => {
        const nameMatch = conversation.otherUserName.toLowerCase().includes(lowerQuery);
        
  
        return nameMatch ;
      });
    };

      return nameMatch;
    });
  };

  const searchedConversations: any[] = getSearchedConversations(
    conversations,
    searchQuery
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" style={{ paddingVertical: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Sök bland konversationer..."
      />
      <FlatList
        data={searchedConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/conversation/${item.id}`)}
            style={styles.conversationItem}
          >
            <Image
              source={
                item.otherUserImage
                  ? { uri: item.otherUserImage }
                  : require("@/assets/profilePicture.png")
              }
              style={styles.profileImage}
            />
            <View style={styles.conversationText}>
              <Text style={styles.username}>{item.otherUserName}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage || "No messages yet"}
              </Text>
            </View>
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
  conversationItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationText: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.details,
  },
});
