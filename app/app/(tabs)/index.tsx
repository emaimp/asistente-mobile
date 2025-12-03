import { StyleSheet, Alert } from 'react-native';
import { useState } from 'react';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AudioRecorder from '@/components/audio-recorder';
import { useApi } from '@/hooks/use-backend-api';
import { ApiResponse } from '@/services/api';

export default function HomeScreen() {
  const [responseData, setResponseData] = useState<{ data: ApiResponse; audioUri: string } | null>(null);
  const [showInstruction, setShowInstruction] = useState(true);
  const { sendAudio, isProcessing } = useApi();

  const handleRecordingComplete = async (audioUri: string) => {
    try {
      const result = await sendAudio(audioUri);
      setResponseData(result);
      setShowInstruction(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo procesar el audio: ${message}`);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.stepContainer} lightColor="transparent" darkColor="transparent">
        <AudioRecorder onRecordingComplete={handleRecordingComplete} isProcessing={isProcessing} audioUri={responseData?.audioUri} />
      </ThemedView>
      {showInstruction && !responseData && (
        <ThemedView style={styles.instructionContainer} lightColor="transparent" darkColor="transparent">
          <ThemedText style={styles.instructionText}>💡 Presiona el botón para comenzar a hablar con el BOT.</ThemedText>
        </ThemedView>
      )}
      {responseData && (
        <ThemedView style={styles.questionContainer} lightColor="transparent" darkColor="transparent">
          <ThemedText type="subtitle" style={styles.whiteText}>Pregunta:</ThemedText>
          <ThemedText style={styles.whiteText}>{responseData.data.question}</ThemedText>
        </ThemedView>
      )}
      {responseData && (
        <ThemedView style={styles.answerContainer} lightColor="transparent" darkColor="transparent">
          <ThemedText type="subtitle" style={styles.whiteText}>Respuesta:</ThemedText>
          <ThemedText style={styles.whiteText}>{responseData.data.answer}</ThemedText>
        </ThemedView>
      )}
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
  questionContainer: {
    gap: 8,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    backgroundColor: 'rgba(16, 16, 49, 0.80)',
  },
  answerContainer: {
    gap: 8,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    backgroundColor: 'rgba(16, 16, 49, 0.80)',
  },
  whiteText: {
    color: 'white',
  },
});
