import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { IconSymbol } from '../ui/icon-symbol';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import { styles } from './styles';

/*
 * Renderiza controles de reproducción de audio para mensajes del bot.
 * Maneja estado de reproducción y prevención de ecos.
*/
export function AudioMessagePlayer({
  audioUri,
  inputType,
  autoPlayInputType,
  isLastBotMessage = false,
  isAnyAudioPlaying = false,
  currentPlayingUri
}: {
  audioUri: string;
  inputType?: 'audio' | 'text';
  autoPlayInputType?: 'audio' | 'text' | 'all';
  isLastBotMessage?: boolean;
  isAnyAudioPlaying?: boolean;
  currentPlayingUri?: string | null;
}) {
  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const { t } = useLanguage();

  // Determinar si este audio debe reproducirse automáticamente
  const shouldAutoPlay = isLastBotMessage && (
    autoPlayInputType === 'all' ||
    (autoPlayInputType === 'audio' && inputType === 'audio') ||
    (autoPlayInputType === 'text' && inputType === 'text')
  );

  // Hook personalizado para controlar reproducción específica de este audio
  const { isPlaying, isLoading, play } = useAudioPlayback(audioUri, shouldAutoPlay);

  // Función para detener todas las reproducciones
  const { stopAllPlayback } = useAudioPlaybackContext();

  // Bloquear todos los controles cuando hay audio reproduciendo para evitar eco
  const isBlocked = isAnyAudioPlaying;

  const handlePress = () => {
    if (!isPlaying) {
      play();
    }
  };

  return (
    <View style={[styles.audioContainer, { backgroundColor: textColor + '1A' }]}>
      <View style={styles.audioControls}>
        <TouchableOpacity
          style={[styles.audioButton, isBlocked && styles.audioButtonBlocked, { backgroundColor: backgroundColor + 'FF' }]}
          onPress={handlePress}
          disabled={isLoading || (isAnyAudioPlaying && !isPlaying)}
        >
          <IconSymbol
            name={(isPlaying || (isLastBotMessage && isAnyAudioPlaying && currentPlayingUri === audioUri)) ? 'volume.up.fill' : (isAnyAudioPlaying ? 'speaker.slash.fill' : 'play.fill')}
            size={20}
            color={textColor}
          />
          <ThemedText
            style={styles.audioButtonText}
          >
            {isPlaying ? t('audioRecorder.playing') : (isLoading ? t('chat.processingAudio') : t('chat.play'))}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.stopButton, (currentPlayingUri !== audioUri) && styles.audioButtonBlocked, { backgroundColor: backgroundColor + 'FF' }]}
          onPress={async () => await stopAllPlayback()}
          disabled={isLoading || currentPlayingUri !== audioUri}
        >
          <IconSymbol
            name="stop.fill"
            size={20}
            color={textColor}
          />
          <ThemedText
            style={styles.audioButtonText}
          >
            {t('chat.stop')}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
