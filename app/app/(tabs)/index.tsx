import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useMemo, useState, useEffect } from 'react';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';
import { useLanguage } from '@/contexts/language-context';
import { useGender } from '@/contexts/gender-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import InitialModal from '@/components/main/initial-modal';
import AudioRecorder from '@/components/main/audio-recorder';
import JarvisCore from '@/components/main/jarvis-core';

// Componente que reproduce automáticamente el audio de la última respuesta del bot
function AutoResponsePlayer({ messages }: { messages: any[] }) {
  // Encuentra el último mensaje del bot con audio
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
  const { isAnyAudioPlaying } = useAudioPlaybackContext();
  const { width, height } = Dimensions.get('window');
  const { t } = useLanguage();

  const gender = useGender().currentGender;
  const colorScheme = useColorScheme();
  const jarvisSize = Math.min(width * 0.8, height * 0.4); // Tamaño responsivo: 80% ancho o 40% alto
  const topMargin = height * 0.20; // 20% de la altura para el margen superior
  const textMarginTop = height * 0.05; // Margen superior del texto basado en altura
  const textMarginBottom = height * 0.01; // Margen inferior del texto

  const [showInitialModal, setShowInitialModal] = useState(false); // Estado para el modal inicial

  // Comprobar si se debe mostrar el modal inicial
  useEffect(() => {
    const checkInitialModal = async () => {
      try {
        const dismissed = await AsyncStorage.getItem('initial-modal-dismissed');
        if (dismissed !== 'true') {
          setShowInitialModal(true);
        }
      } catch (error) {
        console.error('Error checking initial modal:', error);
        setShowInitialModal(true); // Mostrar si hay error
      }
    };
    checkInitialModal();
  }, []);

  // Maneja el cierre del modal inicial
  const handleCloseModal = () => {
    setShowInitialModal(false);
  };

  return (
    <ThemedView style={{flex: 1, backgroundColor: 'transparent'}}>
      <BackgroundPattern gender={gender} colorScheme={colorScheme as 'light' | 'dark'} />
      <View style={[StyleSheet.absoluteFillObject, {backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabBackground, zIndex: -2}]} />
      <View style={styles.mainContainer}>
        <View style={[styles.topHalf, { marginTop: topMargin }]}>
          <View style={{ width: jarvisSize, height: jarvisSize }}>
            <JarvisCore isProcessing={isAnyAudioPlaying} />
          </View>
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
      <InitialModal visible={showInitialModal} onClose={handleCloseModal} />
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
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
