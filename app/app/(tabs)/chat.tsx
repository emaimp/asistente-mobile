import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ConversationView from '@/components/chat-conversation-view';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/language-context';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ChatScreen() {
  const { messages, handleTextSubmit, isProcessing } = useConversation();
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const colorScheme = useColorScheme();
  const iconColor = useThemeColor({}, 'text');
  const textInputColor = colorScheme === 'dark' ? 'white' : 'black';
  const placeholderColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
  
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

  // Maneja el envío del texto
  const handleSubmit = async () => {
    if (inputText.trim() && !isProcessing) {
      const textToSend = inputText.trim();
      setInputText('');
      await handleTextSubmit(textToSend);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ThemedView style={{flex: 1}} lightColor={Colors.light.tabBackground} darkColor={Colors.dark.tabBackground}>
        <View style={styles.container}>
          <View style={[styles.topBar, { backgroundColor: Colors[colorScheme ?? 'light'].tabBackground, borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }]}>
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
              <IconSymbol name="menu" size={24} color={iconColor} />
            </TouchableOpacity>
            <ThemedText style={styles.title}>{t('chat.title')}</ThemedText>
            <View style={styles.placeholder} />
          </View>
          {drawerOpen && (
            <>
              <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />
              <Animated.View style={[styles.drawer, drawerAnimatedStyle, { backgroundColor: Colors[colorScheme ?? 'light'].tabBackground }]}>
                <View style={styles.avatarContainer}>
                  <IconSymbol name="person.circle.fill" size={120} color={iconColor} />
                  <ThemedText style={styles.emailText}>usuario@example.com</ThemedText>
                </View>
              </Animated.View>
            </>
          )}
          <View style={styles.content}>
            <ConversationView messages={messages} />
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { borderColor: colorScheme === 'dark' ? 'white' : 'black' }]}>
              <TextInput
                style={[styles.textInput, { color: textInputColor }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder={t('chat.placeholder')}
                placeholderTextColor={placeholderColor}
                multiline
                maxLength={500}
                onSubmitEditing={handleSubmit}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || isProcessing) && styles.sendButtonDisabled, { borderColor: colorScheme === 'dark' ? 'white' : 'black' }]}
                onPress={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
              >
                <IconSymbol
                  name="paperplane.fill"
                  size={20}
                  color={(!inputText.trim() || isProcessing) ? (colorScheme === 'dark' ? 'white' : 'black') : '#2ab0e1'}
                />
              </TouchableOpacity>
            </View>
          </View>
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
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingRight: 50,
  },
  inputWrapper: {
    position: 'relative',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 44,
    maxHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 0,
    right: 3,
    top: 3,
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'transparent',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
