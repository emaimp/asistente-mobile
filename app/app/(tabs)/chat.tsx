import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import ConversationView from '@/components/conversation-view';
import { useConversation } from '@/contexts/conversation-context';

export default function ChatScreen() {
  const { messages, handleTextSubmit, isProcessing } = useConversation();
  const [inputText, setInputText] = useState('');

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
      <LinearGradient
        colors={['#0a0a5c', '#004480']}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={[styles.content, messages.length === 0 && styles.emptyState]}>
            {messages.length === 0 ? (
              <ThemedText style={styles.emptyText}>Sin historial de Chat</ThemedText>
            ) : (
              <ConversationView messages={messages} autoPlayInputType="all" />
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
              <ThemedText style={styles.sendButtonText}>
                {isProcessing ? '...' : 'Enviar'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
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
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
