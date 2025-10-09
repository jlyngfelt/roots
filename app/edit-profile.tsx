// här ändrar man ex sin bio, sin profilbild och kanske mer. När man trycker på spara = (router.replace('/(tabs)'))

import { useRouter } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { Button, Text } from "tamagui";

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
        style={{ height: 40, fontSize: 30, color: "black" }}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="lösenord"
        secureTextEntry={true}
        autoCapitalize="none"
        style={{ height: 40, fontSize: 30, color: "black" }}
      />

      <Button
        onPress={() => router.replace("/(tabs)")}
        color="#841584"
        size="$4"
        marginVertical="10"
      >
        {"Skapa Profil"}
      </Button>
      <Button
        onPress={() => router.replace("/settings")}
        color="#841584"
        size="$4"
        marginVertical="10"
      >
        {"Inställningar"}
      </Button>
    </View>
  );
}
