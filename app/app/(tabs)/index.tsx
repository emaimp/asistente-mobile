import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AudioRecorder from '@/components/audio-recorder';
import { useConversation } from '@/contexts/conversation-context';

export default function HomeScreen() {
  const { handleRecordingComplete, isProcessing } = useConversation();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.stepContainer} lightColor="transparent" darkColor="transparent">
        <AudioRecorder onRecordingComplete={handleRecordingComplete} isProcessing={isProcessing} />
      </ThemedView>
      <ThemedView style={styles.instructionContainer} lightColor="transparent" darkColor="transparent">
        <ThemedText style={styles.instructionText}>💡 Presiona el botón para comenzar a hablar con el BOT.</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    marginTop: 70,
    marginBottom: 0,
  },
  instructionContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    backgroundColor: 'rgba(16, 16, 49, 0.80)',
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
  },
});
