import { useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useState, useEffect, useCallback, useRef } from 'react';

/*
 * Hook para controlar reproducción de audio.
 * Proporciona controles básicos: play, pause, stop.
*/
export function useAudioPlayer(uri: string) {
  const player = useExpoAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  // Estados del player
  const isPlaying = status.playing || false;
  const isLoaded = status.isLoaded || false;

  // Estado local para controlar el estado de reproducción
  const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  
  // Ref para rastrear el estado anterior sin crear dependencias circulares
  const prevPlayingRef = useRef(false);

  // Actualizar estado local basado en el estado del player
  useEffect(() => {
    const wasPlaying = prevPlayingRef.current;
    const currentlyPlaying = isPlaying;
    
    // Detectar transiciones de estado
    if (currentlyPlaying && !wasPlaying) {
      // Cambio a playing
      setPlaybackState('playing');
    } else if (!currentlyPlaying && wasPlaying) {
      // Cambio de playing a paused
      setPlaybackState('paused');
    }
    
    // Actualizar el ref para la próxima iteración
    prevPlayingRef.current = currentlyPlaying;
  }, [isPlaying]);

  // Función para reproducir audio
  const play = useCallback(async () => {
    if (!isLoaded) return;

    try {
      await player.play();
      setPlaybackState('playing');
    } catch (error) {
      console.error('Error al reproducir:', error);
    }
  }, [player, isLoaded]);

  // Función para pausar audio
  const pause = useCallback(async () => {
    if (!isLoaded) return;

    try {
      await player.pause();
      setPlaybackState('paused');
    } catch (error) {
      console.error('Error al pausar:', error);
    }
  }, [player, isLoaded]);

  // Función para detener audio
  const stop = useCallback(async () => {
    try {
      await player.pause();
      player.seekTo(0);
      setPlaybackState('stopped');
    } catch (error) {
      console.error('Error al detener:', error);
    }
  }, [player]);

  return {
    // Estados
    playbackState,
    isPlaying,
    isLoaded,

    // Controles
    play,
    pause,
    stop,
  };
}
