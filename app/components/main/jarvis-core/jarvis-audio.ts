import { useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';

// Tipos para el hook
export interface UseJarvisAudioReturn {
  playbackState: any;
  play: () => Promise<void>;
  stop: () => Promise<void>;
  isLoaded: boolean;
  audioAmplitude: any;
  rotateAngle: any;
  breathValue: any;
  timeValue: any;
  hasAutoPlayedRef: any;
  previousAudioUriRef: any;
  isMountedRef: any;
  stopAudio: () => Promise<void>;
}

export interface UseJarvisAudioProps {
  latestBotAudioUri?: string;
}

// ==================== HOOK PRINCIPAL ====================
export const useJarvisAudio = ({ latestBotAudioUri }: UseJarvisAudioProps): UseJarvisAudioReturn => {
  // Hook para manejar audio del bot
  const { playbackState, play, stop, isLoaded } = useAudioPlayer(latestBotAudioUri || '');
  
  // Refs para evitar múltiples auto-reproducciones
  const hasAutoPlayedRef = useRef(false);
  const previousAudioUriRef = useRef<string | null>(null);
  const isMountedRef = useRef(false);

  // Valores animados
  const audioAmplitude = useSharedValue(0);
  const rotateAngle = useSharedValue(0);
  const breathValue = useSharedValue(0);
  const timeValue = useSharedValue(0);

  // ==================== ANIMACIONES ====================
  
  // TimeValue animation
  useEffect(() => {
    timeValue.value = withRepeat(
      withTiming(1000, { duration: 3500, easing: Easing.linear }),
      -1, false
    );
  }, [timeValue]);

  // Rotate angle y breath animations
  useEffect(() => {
    rotateAngle.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1, false
    );

    breathValue.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );

    // Simulación de ruido de audio (solo cuando no hay audio del bot)
    if (!latestBotAudioUri) {
      audioAmplitude.value = withRepeat(
        withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        -1, true
      );
    }
  }, [audioAmplitude, breathValue, rotateAngle, latestBotAudioUri]);

  // ==================== INICIALIZACIÓN AL MONTAR ====================
  useEffect(() => {
    isMountedRef.current = true;
    
    // Si hay audio disponible al montar, intentar auto-reproducir
    if (latestBotAudioUri && isLoaded && playbackState === 'stopped' && !hasAutoPlayedRef.current) {
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          hasAutoPlayedRef.current = true;
          play();
          // Activar espectro de voz reactivo
          audioAmplitude.value = withRepeat(
            withTiming(2, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
            -1, true
          );
        }
      }, 200); // Delay para asegurar que todo esté inicializado
      
      return () => {
        clearTimeout(timer);
        isMountedRef.current = false;
      };
    }
  }, []);

  // ==================== LÓGICA DE AUTO-REPRODUCCIÓN ====================
  useEffect(() => {
    // Solo proceder si hay audio disponible
    if (!latestBotAudioUri) return;

    // Detectar si es un audio NUEVO (diferente al anterior)
    const isNewAudio = latestBotAudioUri !== previousAudioUriRef.current;
    
    if (isNewAudio) {
      previousAudioUriRef.current = latestBotAudioUri;
      hasAutoPlayedRef.current = false; // Resetear para el audio nuevo
    }

    // Solo auto-reproducir SI es audio nuevo Y no se ha reproducido antes
    if (isNewAudio && isLoaded && playbackState === 'stopped' && !hasAutoPlayedRef.current) {
      hasAutoPlayedRef.current = true; // Marcar como ya reproducido
      
      // Auto-reproducir con un pequeño delay para evitar conflictos
      const timer = setTimeout(() => {
        play();
        // Activar espectro de voz reactivo
        audioAmplitude.value = withRepeat(
          withTiming(2, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          -1, true
        );
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [latestBotAudioUri, isLoaded, playbackState, play]);

  // ==================== FUNCIÓN STOP ====================
  const stopAudio = async () => {
    try {
      await stop();
      // Resetear flag para permitir nueva reproducción
      hasAutoPlayedRef.current = false;
      // Resetear amplitud visual
      audioAmplitude.value = withTiming(0.5, { duration: 300 });
    } catch (error) {
      console.error('Error stopping JARVIS audio:', error);
    }
  };

  return {
    playbackState,
    play,
    stop,
    isLoaded,
    audioAmplitude,
    rotateAngle,
    breathValue,
    timeValue,
    hasAutoPlayedRef,
    previousAudioUriRef,
    isMountedRef,
    stopAudio
  };
};
