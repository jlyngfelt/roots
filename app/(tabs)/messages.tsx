//Här ska chattfunktionen ligga
import { Colors } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { ScrollView } from "tamagui";

export default function MessagesScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.bgColor}>
      <Text style={{ fontSize: 50, padding: 40 }}>MESSAGES</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: Colors.secondary,
  },
});
