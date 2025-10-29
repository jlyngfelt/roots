import { useAuth } from "@/contexts/AuthContext";
import { getConversation, sendMessage } from "@/services/chatService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

export default function ConversationScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const msgs = await getConversation(chatId);
      setMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.senderId === user?.uid ? "You" : "Them"}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={{ flexDirection: "row", padding: 30 }}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={{ flex: 1, borderWidth: 1, padding: 10 }}
        />
        <Pressable onPress={handleSend}>
          <Text style={{ padding: 10 }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
