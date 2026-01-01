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
  const position = status.currentTime || 0;
  const duration = status.duration || 0;

  // Estado local para controlar el estado de reproducción
  const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  
  // Ref para rastrear el estado anterior sin crear dependencias circulares
  const prevPlayingRef = useRef(false);
  // Ref para detectar fin natural del audio (no pausa)
  const audioFinishedNaturallyRef = useRef(false);
  // Ref para rastrear si el usuario pausó manualmente
  const userPausedRef = useRef(false);
  // Ref para evitar conflictos entre update optimista y useEffect
  const lastManualActionRef = useRef<'play' | 'pause' | 'stop' | null>(null);

  // Actualizar estado local basado en el estado del player
  useEffect(() => {
    const wasPlaying = prevPlayingRef.current;
    const currentlyPlaying = isPlaying;
    
    // Si hubo una acción manual reciente, dejar que esa acción maneje el estado
    if (lastManualActionRef.current) {
      prevPlayingRef.current = currentlyPlaying;
      return;
    }
    
    // Detectar fin natural del audio (cuando está realmente al final)
    if (position > 0 && duration > 0 && position >= duration - 500) {
      // El audio llegó al final naturalmente
      if (wasPlaying && !currentlyPlaying && !userPausedRef.current) {
        setPlaybackState('stopped');
        audioFinishedNaturallyRef.current = true;
        userPausedRef.current = false; // Reset para próxima reproducción
        prevPlayingRef.current = currentlyPlaying;
        return;
      }
    }
    
    // Resetear flags cuando se reproduce desde el inicio
    if (currentlyPlaying && position < 1000) {
      audioFinishedNaturallyRef.current = false;
      userPausedRef.current = false;
    }
    
    // Detectar transiciones de estado (solo si no hay acción manual reciente)
    if (currentlyPlaying && !wasPlaying) {
      // Cambio a playing
      setPlaybackState('playing');
    } else if (!currentlyPlaying && wasPlaying) {
      // Cambio de playing a paused
      // Solo establecer paused si no fue fin natural
      if (!audioFinishedNaturallyRef.current) {
        setPlaybackState('paused');
      }
    }
    
    // Actualizar el ref para la próxima iteración
    prevPlayingRef.current = currentlyPlaying;
  }, [isPlaying, position, duration]);

  // Función para reproducir audio con update optimista
  const play = useCallback(async () => {
    if (!isLoaded) return;

    try {
      // Update optimista: establecer estado inmediatamente
      setPlaybackState('playing');
      lastManualActionRef.current = 'play';
      
      // Solo resetear al inicio si el audio terminó naturalmente
      if (audioFinishedNaturallyRef.current) {
        await player.seekTo(0);
        audioFinishedNaturallyRef.current = false;
      }
      // Si no terminó naturalmente, continuar desde donde está
      
      await player.play();
      
      // Limpiar flag después de un breve delay para que el useEffect no interfiera
      setTimeout(() => {
        lastManualActionRef.current = null;
      }, 100);
      
    } catch (error) {
      console.error('Error al reproducir:', error);
      // En caso de error, revertir estado
      setPlaybackState('stopped');
      lastManualActionRef.current = null;
    }
  }, [player, isLoaded]);

  // Función para pausar audio con update optimista
  const pause = useCallback(async () => {
    if (!isLoaded) return;

    try {
      // Update optimista: establecer estado inmediatamente
      setPlaybackState('paused');
      lastManualActionRef.current = 'pause';
      userPausedRef.current = true;
      
      await player.pause();
      
      // Limpiar flag después de un breve delay
      setTimeout(() => {
        lastManualActionRef.current = null;
      }, 100);
      
    } catch (error) {
      console.error('Error al pausar:', error);
      // En caso de error, revertir estado
      setPlaybackState('playing');
      lastManualActionRef.current = null;
      userPausedRef.current = false;
    }
  }, [player, isLoaded]);

  // Función para detener audio con update optimista
  const stop = useCallback(async () => {
    try {
      // Update optimista: establecer estado inmediatamente
      setPlaybackState('stopped');
      lastManualActionRef.current = 'stop';
      audioFinishedNaturallyRef.current = false;
      userPausedRef.current = false;
      
      await player.pause();
      player.seekTo(0);
      
      // Limpiar flag después de un breve delay
      setTimeout(() => {
        lastManualActionRef.current = null;
      }, 100);
      
    } catch (error) {
      console.error('Error al detener:', error);
      // En caso de error, mantener estado stopped pero limpiar flags
      audioFinishedNaturallyRef.current = false;
      userPausedRef.current = false;
      lastManualActionRef.current = null;
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
