//Här registrerar man sig med email, lösen, postnummer och bild. flrslagsvis kan vi här använda push (router.push('/edit-profile')) då möjliggör vi att man kan gå tillbaka till register när man är i edit profile, vill vi detta? 

import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { signUp, onAuthChange } from '../auth'

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View
      style={{
        height: 100,
        backgroundColor: "blue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, color: "green" }}>ROOTS</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{height: 40, fontSize: 30, color: 'black'}}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="lösenord"
        secureTextEntry={true}
        autoCapitalize="none"
        style={{height: 40, fontSize: 30, color: 'black'}}
      />

      <Button
        onPress={() => router.replace("/edit-profile")}
        title="SKAPA KONTO"
        color="#841584"
        accessibilityLabel="create account"
      />
    </View>
  );
}