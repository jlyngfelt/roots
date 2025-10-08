// här ändrar man ex sin bio, sin profilbild och kanske mer. När man trycker på spara = (router.replace('/(tabs)'))

import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

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
        onPress={() => router.replace("/(tabs)")}
        title="SPARA PROFIL"
        color="#841584"
        accessibilityLabel="create account"
      />
    </View>
  );
}