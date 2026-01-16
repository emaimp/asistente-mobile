import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { ThemedView } from '@/components/ui/theme/themed-view';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { IconSymbol } from '@/components/ui/icon/icon-symbol';
import { useConversationContext } from '@/contexts/conversation-context';
import { useLanguage } from '@/contexts/language-context';
import { useGender } from '@/contexts/gender-context';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/theme/use-color-scheme';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { Colors } from '@/constants/theme';
import { ChatInput } from '@/components/chat/input';
import { TopBar } from '@/components/ui/top-bar';
import SideDrawer, { SideDrawerRef } from '@/components/ui/side-drawer';
import JarvisCore, { JarvisCoreRef } from '@/components/main/jarvis-core';
import InitialModal from '@/components/main/initial-modal';
import ConversationView from '@/components/chat-conversation';
import HistoryDrawer from '@/components/main/history-drawer';
import LoginModal from '@/components/session/login-modal';
import AccountView from '@/views/account';
import SettingsView from '@/views/settings';

export default function HomeScreen() {
  const { messages, sendTextMessage, sendAudioMessage, isProcessing } = useConversationContext();
  const { t } = useLanguage();
  const { register, login, logout } = useAuth();

  const { width, height } = Dimensions.get('window');
  const jarvisSize = Math.min(width * 0.6, height * 0.6); // Tamaño responsivo

  const gender = useGender().currentGender;
  const colorScheme = useColorScheme();

  const drawerRef = useRef<SideDrawerRef>(null);
  const jarvisRef = useRef<JarvisCoreRef>(null);

  // Colores
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  // Estados
  const [currentView, setCurrentView] = useState<'jarvis' | 'chat' | 'account' | 'settings'>('jarvis');
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Extraer el último audio del bot
  const latestBotAudioUri = messages
    .filter(msg => msg.type === 'bot' && msg.audioUri)
    .slice(-1)[0]?.audioUri || undefined;

  // Comprobar si hay audio de JARVIS reproduciéndose (basado en estado real)
  const hasJarvisAudio = isAudioPlaying;

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

  // Función para detener audio de JARVIS
  const handleStopJarvisAudio = async () => {
    if (jarvisRef.current) {
      try {
        await jarvisRef.current.stopAudio();
      } catch (error) {
        console.error('Error stopping JARVIS audio:', error);
      }
    }
  };

  // Función para abrir el modal de login
  const handleOpenLogin = () => {
    setShowLoginModal(true);
    drawerRef.current?.close(); // Cerrar el drawer al abrir el modal
  };

  // Handlers para autenticación
  const handleLoginSuccess = async (token: string, user: any) => {
    await login(token, user);
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = async (token: string, user: any) => {
    await register(token, user);
    setShowLoginModal(false); // Cerrar modal de login que contiene el registro
  };

  return (
    <ThemedView style={styles.container}>
      <BackgroundPattern gender={gender} colorScheme={colorScheme as 'light' | 'dark'} />
      <View style={[StyleSheet.absoluteFillObject, {backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabBackground, zIndex: -2}]} />
      <TopBar
        backgroundColor={backgroundColor}
        borderBottomColor={borderColor + '10'}
        leftElement={
          currentView === 'account' || currentView === 'settings' ? (
            <TouchableOpacity onPress={() => setCurrentView('jarvis')}>
              <IconSymbol name="back.fill" size={24} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => drawerRef.current?.open()}>
              <IconSymbol name="menu.fill" size={24} color={iconColor} />
            </TouchableOpacity>
          )
        }
      />
      <View style={[styles.mainContainer, currentView === 'jarvis' && styles.centered]}>
        {currentView === 'chat' ? (
          <ConversationView />
        ) : currentView === 'jarvis' ? (
          <View style={{ width: jarvisSize, height: jarvisSize }}>
            <JarvisCore
              ref={jarvisRef}
              size={jarvisSize}
              latestBotAudioUri={latestBotAudioUri}
              onPlaybackStateChange={setIsAudioPlaying}
            />
          </View>
        ) : currentView === 'account' ? (
          <AccountView onLogout={async () => {
            await logout();
            setCurrentView('jarvis');
          }} />
        ) : currentView === 'settings' ? (
          <SettingsView />
        ) : null}
      </View>
      {(currentView === 'jarvis' || currentView === 'chat') && (
        <View style={styles.chatInputContainer}>
          <ChatInput
            onSubmit={sendTextMessage}
            onRecordingStart={() => {}}
            onRecordingComplete={sendAudioMessage}
            onStopJarvis={handleStopJarvisAudio}
            isProcessing={isProcessing}
            placeholder={t('chat.placeholder')}
            hasJarvisAudio={hasJarvisAudio}
            rightElement={
              <TouchableOpacity
                onPress={() => setCurrentView(currentView === 'jarvis' ? 'chat' : 'jarvis')}
                disabled={messages.filter(msg => msg.type === 'bot').length === 0}
                style={[styles.externalButton, { borderColor: tintColor, opacity: messages.filter(msg => msg.type === 'bot').length === 0 ? 0.5 : 1 }]}
              >
                <IconSymbol name="message.fill" size={24} color={currentView === 'chat' ? tintColor : iconColor} />
                {currentView !== 'chat' && messages.filter(msg => msg.type === 'bot').length > 0 && (
                  <View style={[styles.messageBadge, { backgroundColor: tintColor }]}>
                    <Text style={[styles.badgeText, { color: backgroundColor }]}>
                      {messages.filter(msg => msg.type === 'bot').length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            }
          />
        </View>
      )}
      <InitialModal visible={showInitialModal} onClose={handleCloseModal} />
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />
      <SideDrawer ref={drawerRef}>
        <HistoryDrawer
          onLoginPress={handleOpenLogin}
          onUserPress={() => {
            drawerRef.current?.close();
            setCurrentView('account');
          }}
          onSettingsPress={() => {
            drawerRef.current?.close();
            setCurrentView('settings');
          }}
        />
      </SideDrawer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInputContainer: {
    marginBottom: 20,
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
  externalButton: {
    position: 'relative',
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
});
