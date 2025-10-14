import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Text } from "tamagui";
import { logOut } from "../auth";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        height: 300,
        backgroundColor: "blue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, color: "green" }}>ROOTS</Text>

      <DefaultButton onPress={() => router.replace("/edit-profile")}>
        Redigera profil
      </DefaultButton>

      <DefaultButton onPress={() => ""}>Uppdatera e-postadress</DefaultButton>

      <DefaultButton onPress={() => ""}>Byt lösenord</DefaultButton>

      <DefaultButton onPress={() => logOut()}>Logga ut</DefaultButton>
    </View>
  );
}
