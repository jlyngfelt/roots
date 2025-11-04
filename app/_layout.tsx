import { TopBar } from "@/components/ui/TopBar";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { defaultConfig } from "@tamagui/config/v4";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { createTamagui, TamaguiProvider } from "tamagui";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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
    if (segments[0] === undefined) return;

    const inAuthGroup =
      segments[0] === "welcome" ||
      segments[0] === "login" ||
      segments[0] === "register";

    if (!user && !inAuthGroup) {
      router.replace("/welcome");
    }

    // if (user && user.emailVerified && inAuthGroup) {
    //   router.replace("/(tabs)/explore");
    // }
  }, [user, loading, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register/index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="create-profile" options={{ headerShown: false }} /> */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="edit-plant/[plantId]"
        options={{
          headerShown: true,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Stack.Screen
        name="view-plant/[plantId]"
        options={{
          headerShown: true,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Stack.Screen
        name="view-profile/[userId]"
        options={{
          headerShown: true,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Stack.Screen
        name="update-email"
        options={{
          headerShown: true,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Stack.Screen
        name="update-password"
        options={{
          headerShown: true,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Stack.Screen
        name="conversation/[chatId]"
        options={{
          headerShown: true,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerShown: true,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
    </Stack>
  );
}
