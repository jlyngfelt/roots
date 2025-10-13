//Här ska man logga in med email och lösen (skickas sen vidare till tabs)
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, Input, Text } from "tamagui";
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
      await signIn(email, password);
      router.replace("/(tabs)/explore");
    } catch (err: any) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-email"
      ) {
        setError("Fel email eller lösenord");
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
    <View
      style={{
        height: 400,
        backgroundColor: "blue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, color: "green", marginVertical: 10 }}>
        ROOTS
      </Text>

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
        value={password}
        onChangeText={setPassword}
        placeholder="lösenord"
        secureTextEntry={true}
        autoCapitalize="none"
        size="$4"
        marginVertical="10"
        width="50%"
      />

      <Text fontSize="$3">{error}</Text>

      <Button
        onPress={handleSignIn}
        color="#841584"
        size="$4"
        marginVertical="10"
        disabled={loading}
      >
        {loading ? "Loading.." : "Logga in"}
      </Button>
    </View>
  );
}
