import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay } from 'react-native-reanimated';
import { useAudioRecording } from '@/hooks/use-audio-recording';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';
import { IconSymbol } from './ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface AudioRecorderProps {
  onRecordingComplete: (uri: string) => void;
  isProcessing?: boolean;
  audioUri?: string | null;
  onRecordingStart?: () => void;
}

export default function AudioRecorder({ onRecordingComplete, isProcessing = false, audioUri, onRecordingStart }: AudioRecorderProps) {
  const { isRecording, startRecording, stopRecording } = useAudioRecording(onRecordingComplete);
  const { isAnyAudioPlaying, stopAllPlayback } = useAudioPlaybackContext();
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const lastAutoPlayedUri = useRef<string | null>(null);



  // Brillo pulsante cuando esta inactivo
  useEffect(() => {
    const isIdle = !isRecording && !isProcessing && !isAnyAudioPlaying;

    if (isIdle) {
      glowScale.value = withRepeat(
        withTiming(1.3, { duration: 1500 }), -1, true
      );
      glowOpacity.value = withRepeat(
        withTiming(0.2, { duration: 1500 }), -1, true
      );
    } else {
      glowScale.value = withTiming(1, { duration: 500 });
      glowOpacity.value = 0;
    }
  }, [isRecording, isProcessing, isAnyAudioPlaying, glowScale, glowOpacity]);

  // Resetear el flag de última reproducción automática cuando cambia la URI
  useEffect(() => {
    if (audioUri && audioUri !== lastAutoPlayedUri.current) {
      lastAutoPlayedUri.current = audioUri;
    }
  }, [audioUri]);

  // Animación de brillo pulsante
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const getIconName = () => {
    if (isProcessing) return 'mic.fill'; // Azul - procesando
    if (isAnyAudioPlaying) return 'volume.up.fill'; // Verde - reproduciendo
    return 'mic.fill'; // Azul - default
  };

  const getButtonStyle = () => {
    if (isRecording) return styles.recordingButton;
    if (isProcessing) return styles.processingButton;
    if (isAnyAudioPlaying) return styles.playingButton; // Verde durante reproducción global
    return {}; // Azul por defecto
  };

  const getStatusMessage = () => {
    if (isRecording) return { text: 'Grabando...', style: styles.recordingText };
    if (isProcessing) return { text: 'Procesando...', style: styles.processingText };
    if (isAnyAudioPlaying) return { text: 'Reproduciendo...', style: styles.playingText };
    return null;
  };

  const statusMessage = getStatusMessage();
  const iconColor = useThemeColor({}, 'tabBackground');

  const handlePress = async () => {
    if (isAnyAudioPlaying) {
      await stopAllPlayback(); // Detener todas las reproducciones activas
    } else if (isRecording) {
      stopRecording();
    } else {
      onRecordingStart?.();
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.glow, glowAnimatedStyle]} />
        {/* Ondas circulares cuando está activo */}
        {(isRecording || isProcessing || isAnyAudioPlaying) && (
          <>
            {[...Array(3)].map((_, i) => (
              <AudioWave
                key={i}
                delay={i * 300}
                color={isRecording ? '#ff4638' : isAnyAudioPlaying ? '#00f071' : '#2ab0e1'}
              />
            ))}
          </>
        )}
        <View style={[styles.button, getButtonStyle()]} >
          <TouchableOpacity
            style={styles.buttonTouchable}
            onPress={isProcessing ? undefined : handlePress}
            disabled={isProcessing}
          >
            <IconSymbol name={getIconName()} size={80} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.statusTextContainer}>
        {statusMessage && <Text style={statusMessage.style}>{statusMessage.text}</Text>}
      </View>
    </View>
  );
}

// Componente para ondas circulares de audio
function AudioWave({ delay, color }: { delay: number; color: string }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(withTiming(1.3, { duration: 800 }), -1, false));
    opacity.value = withDelay(delay, withRepeat(withTiming(0, { duration: 800 }), -1, false));
  }, [delay, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    borderColor: color,
  }));

  return (
    <Animated.View
      style={[
        styles.audioWave,
        animatedStyle,
      ]}
    />
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

  button: {
    backgroundColor: '#2ab0e1',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.7)',
    elevation: 12,
  },
  recordingButton: {
    backgroundColor: '#ff4638',
  },
  processingButton: {
    backgroundColor: '#2ab0e1',
  },
  loadingButton: {
    backgroundColor: '#00f071',
  },
  playingButton: {
    backgroundColor: '#00f071',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingText: {
    marginTop: 16,
    color: '#ff4638',
    fontSize: 14,
  },
  processingText: {
    marginTop: 16,
    color: '#2ab0e1',
    fontSize: 14,
  },
  playingText: {
    marginTop: 16,
    color: '#00f071',
    fontSize: 14,
  },
  buttonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(80, 200, 250, 0.6)',
    shadowColor: '#2ab0e1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  audioWave: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#ff4638',
    backgroundColor: 'transparent',
  },
  statusTextContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
