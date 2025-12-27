import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ChatInput } from '@/components/chat/input';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useLanguage } from '@/contexts/language-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import ConversationView from '@/components/chat-conversation';

export default function ChatScreen() {
  // Colores dinámicos basados en género
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const { messages, handleTextSubmit, isProcessing } = useConversation();
  const { t } = useLanguage();

  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para el menú lateral
  const translateX = useSharedValue(-250); // Posición inicial fuera de pantalla

  // Funciones para abrir y cerrar el menú lateral
  const openDrawer = () => {
    setDrawerOpen(true);
    translateX.value = withTiming(0, { duration: 300 });
  };

  const closeDrawer = () => {
    translateX.value = withTiming(-250, { duration: 300 });
    setTimeout(() => setDrawerOpen(false), 300);
  };

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ThemedView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={[styles.topBar, { backgroundColor: backgroundColor, borderBottomColor: textColor + '04' }]}>
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
              <IconSymbol name="menu" size={24} color={textColor} />
            </TouchableOpacity>
            <ThemedText style={styles.title}>{t('chat.title')}</ThemedText>
            <View style={styles.placeholder} />
          </View>
          {drawerOpen && (
            <>
              <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />
              <Animated.View style={[styles.drawer, drawerAnimatedStyle, { backgroundColor: backgroundColor }]}>
                <View style={styles.avatarContainer}>
                  <IconSymbol name="person.circle.fill" size={120} color={textColor} />
                  <ThemedText style={styles.emailText}>usuario@example.com</ThemedText>
                </View>
              </Animated.View>
            </>
          )}
          <View style={styles.content}>
            <ConversationView messages={messages} />
          </View>

          <ChatInput
            onSubmit={handleTextSubmit}
            isProcessing={isProcessing}
            placeholder={t('chat.placeholder')}
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 16,
    paddingTop: 105,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  topBar: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    bottom: 0,
    zIndex: 30,
    padding: 20,
  },
  placeholder: {
    width: 40,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  emailText: {
    fontSize: 14,
    marginTop: 10,
    opacity: 0.7,
  },
});
