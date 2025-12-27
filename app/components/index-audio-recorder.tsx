import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioRecording } from '@/hooks/use-audio-recording';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';
import { IconSymbol } from './ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/contexts/language-context';

interface AudioRecorderProps {
  onRecordingComplete: (uri: string) => void;
  isProcessing?: boolean;
  audioUri?: string | null;
  onRecordingStart?: () => void;
}

export default function AudioRecorder({ onRecordingComplete, isProcessing = false, audioUri, onRecordingStart }: AudioRecorderProps) {
  const { height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenHeight < 700; // Umbral para pantallas pequeñas
  const styles = getResponsiveStyles(isSmallScreen); // Estilos responsivos

  const { isRecording, startRecording, stopRecording } = useAudioRecording(onRecordingComplete);
  const { isAnyAudioPlaying, stopAllPlayback } = useAudioPlaybackContext();
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const buttonScale = useSharedValue(1);
  const lastAutoPlayedUri = useRef<string | null>(null);

  // Brillo pulsante en todos los estados sin variación
  useEffect(() => {
    // Cancelar animaciones anteriores
    cancelAnimation(glowScale);
    cancelAnimation(glowOpacity);

    // Iniciar animaciones constantes
    glowScale.value = withRepeat(withTiming(1.2, { duration: 2000 }), -1, true);
    glowOpacity.value = withRepeat(withTiming(0.3, { duration: 2000 }), -1, true);
  }, [glowScale, glowOpacity]);

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

  // Determinar el ícono y estilos según el estado
  const getIconName = () => {
    if (isRecording) return 'record.fill'; // Grabando
    if (isProcessing) return 'mic.fill'; // Procesando
    if (isAnyAudioPlaying) return 'volume.up.fill'; // Reproduciendo
    return 'mic.fill'; // Default
  };

  // Determinar estilos de botón según el estado
  const getButtonStyle = () => {
    if (isRecording) return styles.recordingButton; // Grabando
    if (isProcessing) return styles.processingButton; // Procesando
    if (isAnyAudioPlaying) return styles.playingButton; // Reproduciendo
    return {}; // Default
  };

  // Traducciones y colores dinámicos basados en género
  const { t } = useLanguage();
  const tintColor = useThemeColor({}, 'tint');

  const getGradientColors = (): readonly [string, string] => {
    if (isRecording) return [tintColor, tintColor + '66'];
    if (isProcessing) return [tintColor, tintColor + '66'];
    if (isAnyAudioPlaying) return [tintColor, tintColor + '66'];
    return [tintColor, tintColor + '66'];
  };

  const getGlowStyle = () => {
    if (isRecording) return { backgroundColor: tintColor + 'CC', shadowColor: tintColor };
    if (isProcessing) return { backgroundColor: tintColor + 'CC', shadowColor: tintColor };
    if (isAnyAudioPlaying) return { backgroundColor: tintColor + 'CC', shadowColor: tintColor };
    return { backgroundColor: tintColor + 'CC', shadowColor: tintColor };
  };

  const getStatusMessage = () => {
    if (isRecording) return { text: t('audioRecorder.recording'), style: [styles.statusText, { color: tintColor }] };
    if (isProcessing) return { text: t('audioRecorder.processing'), style: [styles.statusText, { color: tintColor }] };
    if (isAnyAudioPlaying) return { text: t('audioRecorder.playing'), style: [styles.statusText, { color: tintColor }] };
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

// Estilos responsivos
const getResponsiveStyles = (isSmallScreen: boolean) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 0,
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 122,
    height: 122,
    borderRadius: 75,
  },
  button: {
    width: 130,
    height: 130,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  buttonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    marginTop: isSmallScreen ? 10 : 20,
    fontSize: 16,
  },
  statusTextContainer: {
    height: isSmallScreen ? 35 : 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
  },
  processingButton: {
  },
  loadingButton: {
  },
  playingButton: {
  },
});
