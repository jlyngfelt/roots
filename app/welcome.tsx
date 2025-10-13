//Här är sidan där man kan välja mellan logga in och registrera

import { useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

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
      <Button
        onPress={() => router.replace("/login")}
        title="LOGGA IN"
        color="#841584"
        accessibilityLabel="Go to login"
      />
      <Button
        onPress={() => router.replace("/register")}
        title="REGISTRERA"
        color="#841584"
        accessibilityLabel="Go to register"
      />
    </View>
  );
}
