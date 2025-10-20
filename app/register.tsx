//Här registrerar man sig med email, lösen, postnummer och bild. flrslagsvis kan vi här använda push (router.push('/create-profile')) då möjliggör vi att man kan gå tillbaka till register när man är i edit profile, vill vi detta?

import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { Colors } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Input, Text } from "tamagui";
import { signUp } from "../auth";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  let password = "";

  const handleSignUp = async () => {
    setError("");

    if (password1 !== password2) {
      setError("Lösenorden matchar inte");
      return;
    }
    if (password1.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken");
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password1);
      router.replace("/create-profile");
      Alert.alert(
        "Verifiera din e-post",
        "Vi har skickat ett verifieringsmail till din e-mail. Vänligen klicka på länken i mailet för att aktivera ditt konto och gå vidare.",
        [
          {
            text: "Öppna e-post",
            onPress: () => Linking.openURL("message:"),
          },
        ]
      );
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("e-mail används redan");
      } else if (err.code === "auth/invalid-email") {
        setError("Ogiltigt format på e-mail");
      } else {
        setError("Något gick fel");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.feed}>
      <View style={styles.form}>
        <Image
          source={require("../assets/roots_logo.png")}
          style={{ width: 300 }}
          resizeMode="contain"
        />
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="email"
          keyboardType="email-address"
          autoCapitalize="none"
          size="$4"
          marginVertical="10"
          width="50%"
        />
        <Input
          value={password1}
          onChangeText={setPassword1}
          placeholder="lösenord"
          secureTextEntry={true}
          autoCapitalize="none"
          size="$4"
          marginVertical="10"
          width="50%"
        />
        <Input
          value={password2}
          onChangeText={setPassword2}
          placeholder="lösenord"
          secureTextEntry={true}
          autoCapitalize="none"
          size="$4"
          marginVertical="10"
          width="50%"
        />
        <Text fontSize="$3">{error}</Text>

        <DefaultButton onPress={() => handleSignUp()} disabled={loading}>
          {loading ? "Registrerar.." : "Registrera"}
        </DefaultButton>
        <DefaultButton
          onPress={() => router.replace("/welcome")}
          variant="tertiary"
        >
          Tillbaka
        </DefaultButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  feed: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
  },
});
