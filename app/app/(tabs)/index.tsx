import { StyleSheet, Image, View } from 'react-native';
import { useMemo } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import AudioRecorder from '@/components/index-audio-recorder';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { Colors } from '@/constants/theme';

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
    <ThemedView style={{flex: 1}} lightColor={Colors.light.tabBackground} darkColor={Colors.dark.tabBackground}>
      <View style={styles.mainContainer}>
        <View style={styles.topHalf}>
          <Image source={require('@/assets/images/cat-bot.webp')} style={styles.botImage} resizeMode="contain" />
        </View>
        <View style={styles.middle}>
          <ThemedText
            style={styles.instructionText}
            lightColor="#000000"
            darkColor="#FFFFFF"
          >
            Presiona para hablar
          </ThemedText>
        </View>
        <View style={styles.bottomHalf}>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} isProcessing={isProcessing} />
        </View>
      </View>
      <AutoResponsePlayer messages={messages} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    marginTop: 0,
    marginBottom: 0,
  },
  mainContainer: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    marginTop: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'center',
  },
  botImage: {
    width: 400,
    height: 400,
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 50,
  },
});
