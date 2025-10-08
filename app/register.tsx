//Här registrerar man sig med email, lösen, postnummer och bild. flrslagsvis kan vi här använda push (router.push('/edit-profile')) då möjliggör vi att man kan gå tillbaka till register när man är i edit profile, vill vi detta?

import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, Input, Text } from "tamagui";
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
      await signUp(email, password1);
      router.replace("/edit-profile");
    } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      setError('Email används redan');
    } else if (err.code === 'auth/invalid-email') {
      setError('Ogiltigt format på email');
    } else {
      setError('Något gick fel');
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

      <Button
        onPress={() => handleSignUp()}
        color="#841584"
        size="$4"
        marginVertical="10"
        disabled={loading}
      >
        {loading ? 'Loading..' : 'Registrera'}
      </Button>
    </View>
  );
}
