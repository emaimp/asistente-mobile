import { Audio } from 'expo-av';
import { useState, useEffect, useCallback, useRef } from 'react';

export function useAudioPlayback(uri: string | null) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const currentUriRef = useRef<string | null>(null);
  const pendingAutoPlayRef = useRef(false);

  const loadSound = useCallback(async () => {
    if (!uri || uri === currentUriRef.current) return;

    setIsLoading(true);
    setIsLoaded(false);
    currentUriRef.current = uri;
    pendingAutoPlayRef.current = true; // Marcar para reproducción automática

    try {
      // Limpiar sonido anterior si existe
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = newSound;

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          setIsLoading(false);
          setIsLoaded(true);
          setDuration(status.durationMillis || null);
          setPosition(status.positionMillis || null);
          setIsPlaying(status.isPlaying);

          // Reproducción automática si está pendiente
          if (pendingAutoPlayRef.current) {
            console.log('🔊 Ejecutando reproducción automática...');
            pendingAutoPlayRef.current = false;
            // Usar setTimeout para evitar llamadas recursivas
            setTimeout(() => {
              if (newSound && !status.isPlaying) {
                newSound.playAsync().catch(() => {});
              }
            }, 100);
          }
        } else if (status.error) {
          setIsLoading(false);
          pendingAutoPlayRef.current = false; // Resetear si hay error
        }
      });
    } catch {
      setIsLoading(false);
      setIsLoaded(false);
    }
  }, [uri]);

  useEffect(() => {
    if (uri && uri !== currentUriRef.current) {
      loadSound();
    } else if (!uri) {
      // Limpiar cuando no hay URI
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsLoading(false);
      setIsLoaded(false);
      setIsPlaying(false);
      setDuration(null);
      setPosition(null);
      currentUriRef.current = null;
      pendingAutoPlayRef.current = false; // Resetear flag
    }

    return () => {
      // Cleanup solo cuando el componente se desmonta
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [uri, loadSound]);

  const playPause = useCallback(async () => {
    if (!soundRef.current || !isLoaded) {
      return;
    }

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch {
    }
  }, [isPlaying, isLoaded]);

  const stop = useCallback(async () => {
    if (!soundRef.current || !isLoaded) return;

    try {
      await soundRef.current.stopAsync();
      setPosition(0);
    } catch {
    }
  }, [isLoaded]);

  const formatTime = (millis: number | null) => {
    if (!millis) return '0:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    isPlaying,
    isLoading,
    isLoaded,
    duration,
    position,
    playPause,
    stop,
    formatTime,
  };
}
