import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconSymbol } from '../ui/icon/icon-symbol';
import { useAudioPlayer } from '@/hooks/audio/use-audio-player';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
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
  const { playbackState, play, pause, stop, isLoaded, isBlocked } = useAudioPlayer(audioUri);

  // Manejadores de eventos
  const handlePlayPause = async () => {
    if (isBlocked) return; // Bloqueado por otro audio
    if (playbackState === 'stopped' || playbackState === 'paused') {
      await play();
    } else if (playbackState === 'playing') {
      await pause();
    }
  };

  const handleStop = async () => {
    if (isBlocked) return; // Bloqueado por otro audio
    await stop();
  };

  // Icono para el botón play/pause
  const getPlayPauseIcon = () => {
    if (isBlocked) return 'lock.fill';
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
          style={[
            styles.audioButton, 
            { backgroundColor: backgroundColor + 'FF' },
            isBlocked && { opacity: 0.5 }
          ]}
          onPress={handlePlayPause}
          disabled={!isLoaded || isBlocked} // Deshabilitado cuando está bloqueado
        >
          <IconSymbol
            name={getPlayPauseIcon()}
            size={20}
            color={textColor}
          />
        </TouchableOpacity>

        {/* Botón Stop */}
        <TouchableOpacity
          style={[
            styles.audioButton, 
            { backgroundColor: backgroundColor + 'FF' },
            isBlocked && { opacity: 0.5 }
          ]}
          onPress={handleStop}
          disabled={!isLoaded || isBlocked} // Deshabilitado cuando está bloqueado
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
