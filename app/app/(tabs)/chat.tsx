import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
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
  const { width } = Dimensions.get('window');
  
  const backgroundImageSize = Math.min(width * 0.55, 300); // 55% del ancho, máximo 300px
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
          <View style={[styles.topBar, { backgroundColor: Colors[colorScheme ?? 'light'].tabBackground, borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }]}>
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
              <IconSymbol name="menu" size={24} color={iconColor} />
            </TouchableOpacity>
            <ThemedText style={styles.title}>CHAT</ThemedText>
            <View style={styles.placeholder} />
          </View>
          {drawerOpen && (
            <>
              <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />
              <Animated.View style={[styles.drawer, drawerAnimatedStyle, { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' }]}>
                <ThemedText style={styles.drawerItem}>Cuenta</ThemedText>
                <ThemedText style={styles.drawerItem}>Historial</ThemedText>
              </Animated.View>
            </>
          )}
          <View style={styles.content}>
            <View style={styles.backgroundImageContainer}>
              <Image
                source={colorScheme === 'dark' ? require('@/assets/images/head-white.webp') : require('@/assets/images/head-black.webp')}
                style={[styles.backgroundImage, { width: backgroundImageSize, height: backgroundImageSize }]}
              />
            </View>
            <ConversationView messages={messages} />
          </View>

          <View style={styles.inputContainer}>
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
              style={[styles.sendButton, (!inputText.trim() || isProcessing) && styles.sendButtonDisabled]}
              onPress={handleSubmit}
              disabled={!inputText.trim() || isProcessing}
            >
              <IconSymbol
                name="paperplane.fill"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
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
    paddingTop: 110,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    opacity: 0.1,
  },
  backgroundImage: {
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    backgroundColor: '#2ab0e1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(159, 159, 159, 0.5)',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  menuButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
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
  drawer: {
    position: 'absolute',
    top: 95,
    left: 0,
    width: 250,
    bottom: 0,
    zIndex: 30,
    padding: 20,
  },
  drawerItem: {
    fontSize: 16,
    marginVertical: 10,
  },
});
