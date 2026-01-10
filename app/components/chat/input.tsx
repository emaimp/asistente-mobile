import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { IconSymbol } from '../ui/icon/icon-symbol';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useAudioRecording } from '@/hooks/audio/use-audio-recording';
import { styles } from './styles';

interface ChatInputProps {
  onSubmit: (text: string) => Promise<void>;
  onRecordingStart?: () => void;
  onRecordingComplete?: (uri: string) => void;
  onStopJarvis?: () => void;
  isProcessing: boolean;
  placeholder: string;
  hasJarvisAudio?: boolean;
  rightElement?: React.ReactNode;
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
  hasJarvisAudio = false,
  rightElement
}: ChatInputProps) {
  const [inputText, setInputText] = useState('');

  // Hook para grabación de audio
  const { isRecording, startRecording, stopRecording } = useAudioRecording(onRecordingComplete || (() => {}));

  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');
  const redAltColor = useThemeColor({}, 'redAlt');

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

  // Determina si mostrar botón de envío o de grabación
  const hasText = inputText.trim().length > 0;

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputRow}>
        <View style={[styles.inputWrapper, { borderColor: tintColor, backgroundColor }]}>
          {/* Botón de stop de JARVIS - siempre visible */}
          {onStopJarvis && (
            <TouchableOpacity
              style={[
                styles.jarvisStopButton,
                { backgroundColor: hasJarvisAudio ? redAltColor + '50' : iconColor + '20' },
                !hasJarvisAudio && { opacity: 0.4 }
              ]}
              onPress={onStopJarvis}
              disabled={!hasJarvisAudio || isProcessing}
            >
              <IconSymbol
                name="stop.fill"
                size={20}
                color={hasJarvisAudio ? redAltColor : iconColor}
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
          
          {/* Botón alternante: enviar (con texto) o grabar (sin texto) */}
          <TouchableOpacity
            style={[styles.sendButton, { borderColor: tintColor }]}
            onPress={hasText ? handleSubmit : handleRecording}
            disabled={isProcessing}
          >
            <IconSymbol
              name={hasText ? "paperplane.fill" : "mic.fill"}
              size={20}
              color={hasText ? tintColor : (isRecording ? redAltColor : iconColor)}
            />
          </TouchableOpacity>
        </View>
        
        {/* Botón externo en el lado derecho del TextInput */}
        {rightElement}
      </View>
    </View>
  );
}
