import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAudioRecording } from '@/hooks/use-audio-recording';
import { styles } from './styles';

interface ChatInputProps {
  onSubmit: (text: string) => Promise<void>;
  onRecordingStart?: () => void;
  onRecordingComplete?: (uri: string) => void;
  onStopJarvis?: () => void;
  isProcessing: boolean;
  placeholder: string;
  hasJarvisAudio?: boolean;
}

/*
 * Componente para la entrada de texto y envío de mensajes en el chat.
*/
export function ChatInput({ 
  onSubmit, 
  onRecordingStart, 
  onRecordingComplete, 
  onStopJarvis,
  isProcessing, 
  placeholder,
  hasJarvisAudio = false 
}: ChatInputProps) {
  const [inputText, setInputText] = useState('');

  // Hook para grabación de audio
  const { isRecording, startRecording, stopRecording } = useAudioRecording(onRecordingComplete || (() => {}));

  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const errorColor = useThemeColor({}, 'errorPrimary');

  // Maneja el envío del texto
  const handleSubmit = async () => {
    if (inputText.trim() && !isProcessing) {
      const textToSend = inputText.trim();
      setInputText('');
      await onSubmit(textToSend);
    }
  };

  // Maneja la grabación de audio
  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      onRecordingStart?.();
      startRecording();
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, { borderColor: tintColor, backgroundColor }]}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecording}
          disabled={isProcessing}
        >
          <IconSymbol
            name="mic.fill"
            size={20}
            color={isRecording ? errorColor : textColor}
          />
        </TouchableOpacity>
        
        {/* Botón de stop de JARVIS - siempre visible */}
        {onStopJarvis && (
          <TouchableOpacity
            style={[
              styles.jarvisStopButton,
              !hasJarvisAudio && { opacity: 0.4 }
            ]}
            onPress={onStopJarvis}
            disabled={!hasJarvisAudio || isProcessing}
          >
            <IconSymbol
              name="stop.fill"
              size={20}
              color={hasJarvisAudio ? errorColor : textColor}
            />
          </TouchableOpacity>
        )}
        
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
