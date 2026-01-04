import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedView } from '@/components/ui/themed-view';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { useGender } from '@/contexts/gender-context';
import { useColorScheme } from '@/hooks/theme/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ChatScreen() {
  const gender = useGender().currentGender;
  const colorScheme = useColorScheme();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ThemedView style={{flex: 1, backgroundColor: 'transparent'}}>
        <BackgroundPattern gender={gender} colorScheme={colorScheme as 'light' | 'dark'} />
        <View style={[StyleSheet.absoluteFillObject, {backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabBackground, zIndex: -2}]} />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
