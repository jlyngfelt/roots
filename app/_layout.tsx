import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { defaultConfig } from "@tamagui/config/v4";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { createTamagui, TamaguiProvider } from "tamagui";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

//flytta options={{ headerShown: false }} till stack och skriv screenOptions={{ headerShown: false }}

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <TamaguiProvider config={config}>
        <AuthProvider>
          <NavigationHandler />
        </AuthProvider>
        <StatusBar style="auto" />
      </TamaguiProvider>
    </ThemeProvider>
  );
}

function NavigationHandler() {
  const { user, loading } = useAuth();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    // Don't interfere with the loading screen
    if (segments[0] === undefined) return;

    const inAuthGroup =
      segments[0] === "welcome" ||
      segments[0] === "login" ||
      segments[0] === "register";

    if (!user && !inAuthGroup) {
      router.replace("/welcome");
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)/explore");
    }
  }, [user, loading, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="create-profile" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}
