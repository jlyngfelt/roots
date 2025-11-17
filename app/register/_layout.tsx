import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";

export default function RegisterLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="ProfileStep" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}