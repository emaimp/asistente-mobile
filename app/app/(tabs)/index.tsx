import { StyleSheet } from 'react-native';
import { useMemo } from 'react';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AudioRecorder from '@/components/index-audio-recorder';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useAudioPlayback } from '@/hooks/use-audio-playback';

// Componente que reproduce automáticamente el audio de la última respuesta del bot
function AutoResponsePlayer({ messages }: { messages: any[] }) {
  // Encontrar el último mensaje del bot con audio
  const lastBotAudioUri = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'bot' && messages[i].audioUri) {
        return messages[i].audioUri;
      }
    }
    return null;
  }, [messages]);

  // Reproducción automática del último audio del bot
  useAudioPlayback(lastBotAudioUri, true);

  // Este componente no renderiza nada visible
  return null;
}

export default function HomeScreen() {
  const { messages, handleRecordingComplete, isProcessing } = useConversation();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.stepContainer} lightColor="transparent" darkColor="transparent">
        <AudioRecorder onRecordingComplete={handleRecordingComplete} isProcessing={isProcessing} />
      </ThemedView>
      <ThemedView style={styles.instructionContainer} lightColor="transparent" darkColor="transparent">
        <ThemedText style={styles.instructionText}>💡 Presiona el botón para comenzar a hablar con el BOT.</ThemedText>
      </ThemedView>
      <AutoResponsePlayer messages={messages} />
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
