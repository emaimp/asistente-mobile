import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ConversationView from '@/components/chat-conversation-view';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/language-context';
import { Colors } from '@/constants/theme';

export default function ChatScreen() {
  const { messages, handleTextSubmit, isProcessing } = useConversation();
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const colorScheme = useColorScheme();
  const textInputColor = colorScheme === 'dark' ? 'white' : 'black';
  const placeholderColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
  const { width } = Dimensions.get('window');
  const backgroundImageSize = Math.min(width * 0.55, 300); // 55% del ancho, máximo 300px

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
              <ThemedText
                style={styles.sendButtonText}
                lightColor="#FFFFFF"
                darkColor="#FFFFFF"
              >
                {isProcessing ? t('chat.sending') : t('chat.sendButton')}
              </ThemedText>
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
    paddingTop: 45,
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
    // width y height se establecen dinámicamente
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(159, 159, 159, 0.5)',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
