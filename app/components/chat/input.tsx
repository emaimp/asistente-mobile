import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ChatInputProps {
  onSubmit: (text: string) => Promise<void>;
  isProcessing: boolean;
  placeholder: string;
}

/*
 * Componente para la entrada de texto y envío de mensajes en el chat.
*/
export function ChatInput({ onSubmit, isProcessing, placeholder }: ChatInputProps) {
  const [inputText, setInputText] = useState('');

  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Maneja el envío del texto
  const handleSubmit = async () => {
    if (inputText.trim() && !isProcessing) {
      const textToSend = inputText.trim();
      setInputText('');
      await onSubmit(textToSend);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, { borderColor: tintColor }]}>
        <TextInput
          style={[styles.textInput, { color: textColor }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholder}
          placeholderTextColor={textColor + '80'}
          multiline
          maxLength={500}
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isProcessing) && styles.sendButtonDisabled, { borderColor: tintColor }]}
          onPress={handleSubmit}
          disabled={!inputText.trim() || isProcessing}
        >
          <IconSymbol
            name="paperplane.fill"
            size={20}
            color={(!inputText.trim() || isProcessing) ? textColor : tintColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 44,
    maxHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingRight: 50,
  },
  sendButton: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 8,
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
});
