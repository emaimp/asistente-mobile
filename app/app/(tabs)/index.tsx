import { StyleSheet, Image, View, Dimensions } from 'react-native';
import { useMemo } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import AudioRecorder from '@/components/index-audio-recorder';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { useLanguage } from '@/contexts/language-context';
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
  const { t } = useLanguage();
  const { width, height } = Dimensions.get('window');
  const imageSize = Math.min(width * 0.85, 380); // Máximo 380px, 85% del ancho
  const topMargin = height * 0.1; // 10% de la altura para el margen superior
  const textMarginTop = height * 0.05; // Margen superior del texto basado en altura
  const textMarginBottom = height * 0.03; // Margen inferior del texto

  return (
    <ThemedView style={{flex: 1}} lightColor={Colors.light.tabBackground} darkColor={Colors.dark.tabBackground}>
      <View style={styles.mainContainer}>
        <View style={[styles.topHalf, { marginTop: topMargin }]}>
          <Image
            source={require('@/assets/images/cat-bot.webp')}
            style={[styles.botImage, { width: imageSize, height: imageSize }]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.middle}>
          <ThemedText
            style={[styles.instructionText, { marginTop: textMarginTop, marginBottom: textMarginBottom }]}
            lightColor="#000000"
            darkColor="#FFFFFF"
          >
            {t('home.pressButton')}
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
    // width y height se establecen dinámicamente
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    // marginTop y marginBottom se establecen dinámicamente
  },
});
