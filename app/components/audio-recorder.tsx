import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useAudioRecording } from '@/hooks/use-audio-recording';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { IconSymbol } from './ui/icon-symbol';

interface AudioRecorderProps {
  onRecordingComplete: (uri: string) => void;
  isProcessing?: boolean;
  audioUri?: string | null;
  onRecordingStart?: () => void;
}

export default function AudioRecorder({ onRecordingComplete, isProcessing = false, audioUri, onRecordingStart }: AudioRecorderProps) {
  const { isRecording, startRecording, stopRecording } = useAudioRecording(onRecordingComplete);
  const { isPlaying, isLoading } = useAudioPlayback(audioUri || null);
  const rotation = useSharedValue(0);
  const lastAutoPlayedUri = useRef<string | null>(null);
  const wasRotatingRef = useRef(false);

  // Giro continuo sin reinicios
  useEffect(() => {
    const isRotating = isProcessing || isLoading || isPlaying;

    if (isRotating && !wasRotatingRef.current) {
      // Iniciar giro continuo
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
      wasRotatingRef.current = true;
    } else if (!isRotating && wasRotatingRef.current) {
      // Detener giro
      rotation.value = 0;
      wasRotatingRef.current = false;
    }
  }, [isProcessing, isLoading, isPlaying, rotation]);

  // Resetear el flag de última reproducción automática cuando cambia la URI
  useEffect(() => {
    if (audioUri && audioUri !== lastAutoPlayedUri.current) {
      lastAutoPlayedUri.current = audioUri;
    }
  }, [audioUri]);

  // Animación de borde pulsante para estados activos
  const borderAnimatedStyle = useAnimatedStyle(() => {
    const isActive = isProcessing || isLoading || isPlaying;
    return {
      opacity: isActive ? 1 : 0,
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const getIconName = () => {
    if (isProcessing) return 'mic.fill'; // Azul - procesando
    if (isPlaying) return 'volume.up.fill'; // Verde - reproduciendo
    return 'mic.fill'; // Azul - default (carga)
  };

  const getButtonStyle = () => {
    if (isRecording) return styles.recordingButton;
    if (isProcessing) return styles.processingButton;
    if (isPlaying) return styles.playingButton; // Verde durante reproducción
    return {}; // Azul por defecto
  };

  const getStatusMessage = () => {
    if (isRecording) return { text: 'Grabando...', style: styles.recordingText };
    if (isProcessing) return { text: 'Procesando...', style: styles.processingText };
    if (isPlaying) return { text: 'Reproduciendo...', style: styles.playingText };
    return null;
  };

  const statusMessage = getStatusMessage();

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      onRecordingStart?.();
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.borderRing, borderAnimatedStyle]} />
        <View style={[styles.button, getButtonStyle()]} >
          <TouchableOpacity
            style={styles.buttonTouchable}
            onPress={isProcessing || isPlaying ? undefined : handlePress}
            disabled={isProcessing || isPlaying}
          >
            <IconSymbol name={getIconName()} size={80} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.statusTextContainer}>
        {statusMessage && <Text style={statusMessage.style}>{statusMessage.text}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 0,
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderRing: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderStyle: 'dashed',
  },
  button: {
    backgroundColor: '#007AFF',
    width: 210,
    height: 210,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.7)',
    elevation: 12,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  processingButton: {
    backgroundColor: '#007AFF',
  },
  loadingButton: {
    backgroundColor: '#34C759',
  },
  playingButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingText: {
    marginTop: 16,
    color: '#FF3B30',
    fontSize: 14,
  },
  processingText: {
    marginTop: 16,
    color: '#007AFF',
    fontSize: 14,
  },
  playingText: {
    marginTop: 16,
    color: '#34C759',
    fontSize: 14,
  },
  buttonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
