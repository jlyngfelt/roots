import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
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
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
  const { user } = useAuth();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!user && segments[0] === "settings") {
      router.replace("/welcome");
    }
  }, [user, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="create-profile" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
