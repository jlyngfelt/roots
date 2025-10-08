import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { createTamagui,TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';


export const unstable_settings = {
  anchor: '(tabs)',
};

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  const colorScheme = useColorScheme();



  return (

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider config={config}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
      </TamaguiProvider>
    </ThemeProvider>
  );
}
