import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { defaultConfig } from "@tamagui/config/v4";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { User } from "firebase/auth";
import { useEffect } from "react";
import "react-native-reanimated";
import { createTamagui, TamaguiProvider } from "tamagui";
import { onAuthChange } from "../auth";

export const unstable_settings = {
  anchor: "(tabs)",
};

//flytta options={{ headerShown: false }} till stack och skriv screenOptions={{ headerShown: false }}

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthChange((user: User | null) => {

      if (!user && (segments[0] === 'settings')) {
        router.replace("/welcome");
      } 
    });

    return () => unsubscribe();
  }, [segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <TamaguiProvider config={config}>


        <Stack >
          <Stack.Screen name="index" options={{ headerShown: false }}/> 
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
        
        <StatusBar style="auto" />
      </TamaguiProvider>
    </ThemeProvider>
  );
}
