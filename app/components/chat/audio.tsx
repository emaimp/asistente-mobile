import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from './styles';

/*
 * Controles de reproducción de audio.
 * Dos botones: Play/Pause (alternativo) y Stop.
*/
export function AudioMessagePlayer({ audioUri }: { audioUri: string }) {
  // Colores del tema
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  // Hook simple de reproducción
  const { playbackState, play, pause, stop, isLoaded } = useAudioPlayer(audioUri);

  // Manejadores de eventos
  const handlePlayPause = async () => {
    if (playbackState === 'stopped' || playbackState === 'paused') {
      await play();
    } else if (playbackState === 'playing') {
      await pause();
    }
  };

  const handleStop = async () => {
    await stop();
  };

  // Icono para el botón play/pause
  const getPlayPauseIcon = () => {
    switch (playbackState) {
      case 'stopped':
      case 'paused':
        return 'play.fill';
      case 'playing':
        return 'pause.fill';
      default:
        return 'play.fill';
    }
  };

  return (
    <View style={[styles.audioContainer, { backgroundColor: textColor + '1A' }]}>
      <View style={styles.audioControls}>
        {/* Botón Play/Pause */}
        <TouchableOpacity
          style={[styles.audioButton, { backgroundColor: backgroundColor + 'FF' }]}
          onPress={handlePlayPause}
          disabled={!isLoaded}
        >
          <IconSymbol
            name={getPlayPauseIcon()}
            size={20}
            color={textColor}
          />
        </TouchableOpacity>

        {/* Botón Stop */}
        <TouchableOpacity
          style={[styles.audioButton, { backgroundColor: backgroundColor + 'FF' }]}
          onPress={handleStop}
          disabled={!isLoaded}
        >
          <IconSymbol
            name="stop.fill"
            size={20}
            color={textColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
