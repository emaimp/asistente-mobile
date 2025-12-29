import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useCallback, useRef } from 'react';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';

export function useAudioPlayback(uri: string | null, autoPlay: boolean = true) {
  const { incrementPlayback, decrementPlayback, registerStopFunction, unregisterStopFunction, setCurrentPlayingUri } = useAudioPlaybackContext();
  const player = useAudioPlayer(uri || undefined);
  const status = useAudioPlayerStatus(player);
  const currentUriRef = useRef<string | null>(null);
  const pendingAutoPlayRef = useRef(false);
  const prevIsPlayingRef = useRef(false);

  // Estado derivado del status del player
  const isPlaying = status.playing || false;
  const isLoading = status.isBuffering || false;
  const isLoaded = status.isLoaded || false;
  const duration = status.duration || null;
  const position = status.currentTime || null;

  // Detiene la reproducción actual y actualiza el estado global
  const stop = useCallback(async () => {
    try {
      player.pause();
      player.seekTo(0);
      // Decrementar contador global y desregistrar función stop
      decrementPlayback();
      unregisterStopFunction(stop);
      setCurrentPlayingUri(null);
    } catch {
      // Ignorar errores al detener
    }
  }, [player, decrementPlayback, unregisterStopFunction, setCurrentPlayingUri]);

  useEffect(() => {
    if (uri && uri !== currentUriRef.current) {
      currentUriRef.current = uri;
      pendingAutoPlayRef.current = autoPlay;

      // Reproducción automática inmediata (sin esperar isLoaded)
      if (pendingAutoPlayRef.current) {
        console.log('🔄 Reproducción automática inmediata...');
        pendingAutoPlayRef.current = false;
        setTimeout(() => {
          try {
            player.play();
          } catch (error) {
            console.error('Error en reproducción automática:', error);
          }
        }, 100);
      }
    } else if (!uri) {
      currentUriRef.current = null;
      pendingAutoPlayRef.current = false;
    }
  }, [uri, autoPlay, player]);

  // Manejar cambios en el estado de reproducción
  useEffect(() => {
    if (isPlaying !== prevIsPlayingRef.current) {
      if (isPlaying) {
        incrementPlayback();
        registerStopFunction(stop);
        setCurrentPlayingUri(uri);
      } else {
        decrementPlayback();
        unregisterStopFunction(stop);
        setCurrentPlayingUri(null);
      }
      prevIsPlayingRef.current = isPlaying;
    }
  }, [isPlaying, incrementPlayback, decrementPlayback, registerStopFunction, unregisterStopFunction, stop, setCurrentPlayingUri, uri]);

  const play = useCallback(async () => {
    if (!isLoaded) return;

    try {
      // Si está al final, resetear al inicio antes de reproducir
      if (position && duration && position >= duration - 1000) { // 1 segundo de tolerancia
        player.seekTo(0);
      }
      player.play();
    } catch {
      // Ignorar errores
    }
  }, [isLoaded, position, duration, player]);

  const pause = useCallback(async () => {
    if (!isLoaded) return;

    try {
      player.pause();
    } catch {
      // Ignorar errores
    }
  }, [isLoaded, player]);

  const formatTime = (millis: number | null) => {
    if (!millis) return '0:00';
    const minutes = Math.floor(millis / 60);
    const seconds = Math.floor(millis % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    isPlaying,
    isLoading,
    isLoaded,
    duration,
    position,
    play,
    pause,
    stop,
    formatTime,
  };
}
