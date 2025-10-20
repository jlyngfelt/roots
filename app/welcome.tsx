//Här är sidan där man kan välja mellan logga in och registrera
import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { Colors } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { Image, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.secondary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ width: 300 }}
        resizeMode="contain"
      />
      <DefaultButton onPress={() => router.replace("/login")} variant="primary">
        Logga in
      </DefaultButton>
      <DefaultButton
        onPress={() => router.replace("/register")}
        variant="secondary"
      >
        Registrera
      </DefaultButton>
      <DefaultButton
        onPress={() => router.replace("/register")}
        variant="tertiary"
      >
        Registrera
      </DefaultButton>
    </View>
  );
}
