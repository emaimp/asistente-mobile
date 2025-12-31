import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useMemo, useState, useEffect, useRef } from 'react';
import { ThemedView } from '@/components/ui/themed-view';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';
import { useLanguage } from '@/contexts/language-context';
import { useGender } from '@/contexts/gender-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { ChatInput } from '@/components/chat/input';
import { TopBar } from '@/components/ui/top-bar';
import SideDrawer, { SideDrawerRef } from '@/components/ui/side-drawer';
import JarvisCore from '@/components/main/jarvis-core';
import InitialModal from '@/components/main/initial-modal';
import ConversationView from '@/components/chat-conversation';

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
  const { messages, handleRecordingComplete, handleTextSubmit, isProcessing } = useConversation();
  const { isAnyAudioPlaying } = useAudioPlaybackContext();
  const { t } = useLanguage();

  const { width, height } = Dimensions.get('window'); // Dimensiones de la ventana
  const jarvisSize = Math.min(width * 0.6, height * 0.6); // Tamaño responsivo

  const gender = useGender().currentGender; // 'Man' | 'Woman'
  const colorScheme = useColorScheme(); // 'light' | 'dark'

  const drawerRef = useRef<SideDrawerRef>(null); // Referencia al SideDrawer

  // Colores del tema
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const backgroundAltColor = useThemeColor({}, 'backgroundAlt');

  const [showChat, setShowChat] = useState(false); // Estado para mostrar/ocultar chat
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
      <TopBar
        backgroundColor={backgroundColor}
        leftElement={
          <TouchableOpacity onPress={() => drawerRef.current?.open()}>
            <IconSymbol name="menu" size={24} color={textColor} />
          </TouchableOpacity>
        }
        rightElement={
          <View style={styles.topBarRight}>
            <TouchableOpacity onPress={() => setShowChat(!showChat)} style={styles.toggleButton}>
              <IconSymbol name={showChat ? "eye.slash.fill" : "eye.fill"} size={20} color={textColor} />
            </TouchableOpacity>
            <View style={styles.messageContainer}>
              <IconSymbol name="message.fill" size={24} color={textColor} />
              {messages.length > 0 && (
                <View style={[styles.messageBadge, { backgroundColor: tintColor }]}>
                  <Text style={[styles.badgeText, { color: backgroundColor }]}>{messages.length}</Text>
                </View>
              )}
            </View>
          </View>
        }
      />
      <View style={styles.mainContainer}>
        {showChat ? (
          <ConversationView messages={messages} autoPlayInputType="all" />
        ) : (
          <View style={{ width: jarvisSize, height: jarvisSize }}>
            <JarvisCore isProcessing={isAnyAudioPlaying} size={jarvisSize} />
          </View>
        )}
      </View>
      <ChatInput
        onSubmit={handleTextSubmit}
        onRecordingStart={() => {}}
        onRecordingComplete={handleRecordingComplete}
        isProcessing={isProcessing}
        placeholder={t('chat.placeholder')}
      />
      <AutoResponsePlayer messages={messages} />
      <InitialModal visible={showInitialModal} onClose={handleCloseModal} />
      <SideDrawer ref={drawerRef} backgroundColor={backgroundAltColor} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    padding: 8,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageContainer: {
    position: 'relative',
  },
  messageBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  eyeIcon: {
    fontSize: 20,
  },
});
