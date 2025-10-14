//Här är sidan där man kan välja mellan logga in och registrera
import { Colors, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        height: 200,
        backgroundColor: Colors.background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={[Styles.heading1, { color: Colors.primary }]}>ROOTS</Text>
      <Button
        onPress={() => router.replace("/login")}
        title="LOGGA IN"
        color={Colors.accent}
        accessibilityLabel="Logga in"
      />
      <Button
        onPress={() => router.replace("/register")}
        title="REGISTRERA"
        color={Colors.accent}
        accessibilityLabel="Registrera"
      />
    </View>
  );
}
