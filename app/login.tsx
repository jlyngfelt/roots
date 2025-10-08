//Här ska man logga in med email och lösen (skickas sen vidare till tabs)
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
        title="LOGGA IN"
        color="#841584"
        accessibilityLabel="Go to login"
      />
    </View>
  );
}
