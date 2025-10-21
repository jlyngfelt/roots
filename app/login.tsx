import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/forms/DefaultInput";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";
import { Text } from "tamagui";
import { signIn } from "../auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)/explore");
    } catch (err: any) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-email"
      ) {
        setError("Fel e-postadress eller lösenord");
      } else if (err.code === "auth/too-many-requests") {
        setError("För många försök, försök igen senare");
      } else if (err.code === "auth/user-disabled") {
        setError("Kontot är inaktiverat");
      } else if (err.message === "EMAIL_NOT_VERIFIED") {
        setError("Du måste verifiera din email först. Kolla din inkorg!");
      } else {
        setError("Kunde inte logga in");
        console.error(err.code);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ height: 160, margin: 60 }}
        resizeMode="contain"
      />

      <DefaultInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-postadress"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <DefaultInput
        value={password}
        onChangeText={setPassword}
        placeholder="Lösenord"
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Text style={Styles.actionL}>{error}</Text>

      <DefaultButton onPress={handleSignIn} disabled={loading}>
        {loading ? "Loggar in.." : "Logga in"}
      </DefaultButton>

      <DefaultButton
        onPress={() => router.replace("/welcome")}
        variant="tertiary"
      >
        Tillbaka
      </DefaultButton>
    </FormLayout>
  );
}
