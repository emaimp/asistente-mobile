import { StyleSheet, Alert } from 'react-native';
import { useState } from 'react';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AudioRecorder from '@/components/audio-recorder';
import ConversationView from '@/components/conversation-view';
import { useApi } from '@/hooks/use-backend-api';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  audioUri?: string;
  timestamp: Date;
}

export default function HomeScreen() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showInstruction, setShowInstruction] = useState(true);
  const { sendAudio, isProcessing } = useApi();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleRecordingComplete = async (audioUri: string) => {
    try {
      // Enviar al backend primero para obtener la transcripción
      const result = await sendAudio(audioUri, currentSessionId);

      // Guardar session_id si es la primera respuesta
      if (!currentSessionId && result.data.session_id) {
        setCurrentSessionId(result.data.session_id);
      }

      // Agregar mensaje del usuario (solo texto transcrito)
      const userMessage: Message = {
        id: generateId(),
        type: 'user',
        content: result.data.question, // Mostrar la pregunta transcrita
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, userMessage]);
      setShowInstruction(false);

      // Agregar respuesta del bot
      const botMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: result.data.answer,
        audioUri: result.audioUri,
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, botMessage]);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo procesar el audio: ${message}`);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.stepContainer} lightColor="transparent" darkColor="transparent">
        <AudioRecorder onRecordingComplete={handleRecordingComplete} isProcessing={isProcessing} />
      </ThemedView>
      {showInstruction && conversation.length === 0 && (
        <ThemedView style={styles.instructionContainer} lightColor="transparent" darkColor="transparent">
          <ThemedText style={styles.instructionText}>💡 Presiona el botón para comenzar a hablar con el BOT.</ThemedText>
        </ThemedView>
      )}
      <ConversationView messages={conversation} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  instructionContainer: {
    gap: 8,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    backgroundColor: 'rgba(16, 16, 49, 0.80)',
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
  },
});
