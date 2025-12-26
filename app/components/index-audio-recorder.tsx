import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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

  // Traducciones y colores dinámicos basados en género
  const { t } = useLanguage();
  const recordingPrimary = useThemeColor({}, 'recordingPrimary');
  const recordingSecondary = useThemeColor({}, 'recordingSecondary');
  const playingPrimary = useThemeColor({}, 'playingPrimary');
  const playingSecondary = useThemeColor({}, 'playingSecondary');
  const tintColor = useThemeColor({}, 'tint');

  const getGradientColors = (): readonly [string, string] => {
    if (isRecording) return [recordingPrimary, recordingSecondary];
    if (isProcessing) return [tintColor, tintColor + '66'];
    if (isAnyAudioPlaying) return [playingPrimary, playingSecondary];
    return [tintColor, tintColor + '66'];
  };

  const getGlowStyle = () => {
    if (isRecording) return { backgroundColor: recordingPrimary + 'CC', shadowColor: recordingPrimary };
    if (isProcessing) return { backgroundColor: tintColor + 'CC', shadowColor: tintColor };
    if (isAnyAudioPlaying) return { backgroundColor: playingPrimary + 'CC', shadowColor: playingPrimary };
    return { backgroundColor: tintColor + 'CC', shadowColor: tintColor };
  };

  const getStatusMessage = () => {
    if (isRecording) return { text: t('audioRecorder.recording'), style: [styles.statusText, { color: recordingPrimary }] };
    if (isProcessing) return { text: t('audioRecorder.processing'), style: [styles.statusText, { color: tintColor }] };
    if (isAnyAudioPlaying) return { text: t('audioRecorder.playing'), style: [styles.statusText, { color: playingPrimary }] };
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
  glow: {
    position: 'absolute',
    width: 130,
    height: 130,
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
    marginTop: 40,
    fontSize: 14,
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
  recordingButton: {
  },
  processingButton: {
  },
  loadingButton: {
  },
  playingButton: {
  },
});
