import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConversationProvider } from '@/contexts/conversation-context';
import { AudioPlaybackProvider } from '@/contexts/audio-playback-context';
import { LanguageProvider } from '@/contexts/language-context';
import { GenderProvider } from '@/contexts/gender-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GenderProvider>
      <LanguageProvider>
        <AudioPlaybackProvider>
          <ConversationProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </ConversationProvider>
        </AudioPlaybackProvider>
      </LanguageProvider>
    </GenderProvider>
  );
}
