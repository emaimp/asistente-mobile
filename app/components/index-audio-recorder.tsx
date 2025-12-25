import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, cancelAnimation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
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
  const buttonScale = useSharedValue(1);
  const lastAutoPlayedUri = useRef<string | null>(null);



  // Brillo pulsante siempre activo con ritmo y escala según estado
  useEffect(() => {
    const getGlowConfig = () => {
      if (isRecording) return { scale: 1.3, duration: 800 };
      if (isProcessing) return { scale: 1.3, duration: 1000 };
      if (isAnyAudioPlaying) return { scale: 1.3, duration: 600 };
      return { scale: 1.3, duration: 2000 }; // inactivo
    };

    // Cancelar animaciones anteriores
    cancelAnimation(glowScale);
    cancelAnimation(glowOpacity);

    // Resetear valores iniciales
    glowScale.value = 1;
    glowOpacity.value = 0.5;

    const { scale, duration } = getGlowConfig();

    // Iniciar nuevas animaciones
    glowScale.value = withRepeat(
      withTiming(scale, { duration }), -1, true
    );
    glowOpacity.value = withRepeat(
      withTiming(0.2, { duration }), -1, true
    );
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

  // Animación de escala al presionar
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
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

  const getGradientColors = (): readonly [string, string] => {
    if (isRecording) return ['#ff0000', '#800000'];
    if (isProcessing) return ['#00bfff', '#004080'];
    if (isAnyAudioPlaying) return ['#00ff00', '#008000'];
    return ['#00bfff', '#004080'];
  };

  const getGlowStyle = () => {
    if (isRecording) return { backgroundColor: 'rgba(255, 70, 56, 0.6)', shadowColor: '#ff4638' };
    if (isProcessing) return { backgroundColor: 'rgba(42, 176, 225, 0.6)', shadowColor: '#2ab0e1' };
    if (isAnyAudioPlaying) return { backgroundColor: 'rgba(0, 240, 113, 0.6)', shadowColor: '#00f071' };
    return { backgroundColor: 'rgba(42, 176, 225, 0.6)', shadowColor: '#2ab0e1' };
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
        <Animated.View style={[styles.glow, getGlowStyle(), glowAnimatedStyle]} />
        {/* Ondas circulares cuando está activo */}
        {(isRecording || isProcessing || isAnyAudioPlaying) && (
          <>
            {[...Array(3)].map((_, i) => (
              <AudioWave
                key={i}
                delay={i * 300}
                color={isRecording ? '#ff4638' : isAnyAudioPlaying ? '#00f071' : '#2ab0e1'}
                maxScale={isRecording ? 1.3 : isProcessing ? 1.3 : 1.3}
                duration={isRecording ? 800 : isProcessing ? 1000 : 600}
              />
            ))}
          </>
        )}
        <LinearGradient colors={getGradientColors()} start={{x: 0, y: 0}} end={{x: 0, y: 1}} style={[styles.button, getButtonStyle()]} >
          <Pressable
            style={styles.buttonTouchable}
            onPress={isProcessing ? undefined : handlePress}
            onPressIn={() => { buttonScale.value = withTiming(0.95, { duration: 100 }); }}
            onPressOut={() => { buttonScale.value = withTiming(1, { duration: 100 }); }}
            disabled={isProcessing}
          >
            <Animated.View style={[buttonAnimatedStyle, styles.iconContainer]}>
              <IconSymbol name={getIconName()} size={55} color={iconColor} />
            </Animated.View>
          </Pressable>
        </LinearGradient>
      </View>
      <View style={styles.statusTextContainer}>
        {statusMessage && <Text style={statusMessage.style}>{statusMessage.text}</Text>}
      </View>
    </View>
  );
}

// Componente para ondas circulares de audio
function AudioWave({ delay, color, maxScale = 1.3, duration = 800 }: { delay: number; color: string; maxScale?: number; duration?: number }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(withTiming(maxScale, { duration }), -1, false));
    opacity.value = withDelay(delay, withRepeat(withTiming(0, { duration }), -1, false));
  }, [delay, scale, opacity, maxScale, duration]);

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
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.7)',
    elevation: 12,
  },
  recordingButton: {
  },
  processingButton: {
  },
  loadingButton: {
  },
  playingButton: {
  },
  recordingText: {
    marginTop: 40,
    color: '#ff4638',
    fontSize: 14,
  },
  processingText: {
    marginTop: 40,
    color: '#2ab0e1',
    fontSize: 14,
  },
  playingText: {
    marginTop: 40,
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
    borderWidth: 5,
    borderColor: '#ff4638',
    backgroundColor: 'transparent',
  },
  statusTextContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
