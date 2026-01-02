import { useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// =============== FUNCIONES HELPER PARA PERSISTENCIA

// Genera un ID único para el audio basado en su URI
const generateAudioId = (audioUri: string): string => {
  const hash = audioUri.split('').reduce((acc, char) => {
    acc = ((acc << 5) - acc) + char.charCodeAt(0);
    return acc & acc;
  }, 0);
  return `jarvis_audio_${Math.abs(hash)}`;
};

// Verifica si un audio ya fue reproducido
const hasAudioBeenPlayed = async (audioId: string): Promise<boolean> => {
  try {
    const played = await AsyncStorage.getItem(`audio_${audioId}`);
    return played === 'true';
  } catch (error) {
    console.warn('Error al verificar estado de reproducción:', error);
    return false;
  }
};

// Marca un audio como reproducido
const markAudioAsPlayed = async (audioId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(`audio_${audioId}`, 'true');
  } catch (error) {
    console.warn('Error al marcar audio como reproducido:', error);
  }
};

// =============== HOOK PRINCIPAL
export const useJarvisAudio = ({ latestBotAudioUri }: UseJarvisAudioProps): UseJarvisAudioReturn => {
  // Hook para manejar audio del bot
  const { playbackState, play, stop, isLoaded } = useAudioPlayer(latestBotAudioUri || '');
  
  // Refs para evitar múltiples auto-reproducciones
  const hasAutoPlayedRef = useRef(false);
  const previousAudioUriRef = useRef<string | null>(null);
  const isMountedRef = useRef(false);
  const currentAudioIdRef = useRef<string | null>(null);

  // Valores animados
  const audioAmplitude = useSharedValue(0);
  const rotateAngle = useSharedValue(0);
  const breathValue = useSharedValue(0);
  const timeValue = useSharedValue(0);

  // =============== ANIMACIONES
  
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

  // =============== LÓGICA UNIFICADA DE AUTO-REPRODUCCIÓN CON PERSISTENCIA
  useEffect(() => {
    isMountedRef.current = true;
    
    // Solo proceder si hay audio disponible
    if (!latestBotAudioUri) {
      return () => {
        isMountedRef.current = false;
      };
    }

    // Detectar si es un audio NUEVO (diferente al anterior)
    const isNewAudio = latestBotAudioUri !== previousAudioUriRef.current;
    
    if (isNewAudio) {
      previousAudioUriRef.current = latestBotAudioUri;
      hasAutoPlayedRef.current = false; // Resetear para el audio nuevo
      
      // Generar ID único para este audio
      currentAudioIdRef.current = generateAudioId(latestBotAudioUri);
    }

    // Verificar si ya fue reproducido anteriormente
    const checkAndPlayAudio = async () => {
      if (!currentAudioIdRef.current) return;
      
      const alreadyPlayed = await hasAudioBeenPlayed(currentAudioIdRef.current);
      
      // Solo auto-reproducir SI el audio está cargado, no se ha reproducido antes, el player está stopped Y no ha sido reproducido anteriormente
      if (isLoaded && !hasAutoPlayedRef.current && playbackState === 'stopped' && !alreadyPlayed) {
        hasAutoPlayedRef.current = true; // Marcar como ya reproducido en esta sesión
        
        // Auto-reproducir con delay optimizado para evitar conflictos
        const timer = setTimeout(async () => {
          if (isMountedRef.current) {
            try {
              await play();
              
              // Activar espectro de voz reactivo
              audioAmplitude.value = withRepeat(
                withTiming(2, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
                -1, true
              );
              
              // Marcar como reproducido en almacenamiento persistente
              if (currentAudioIdRef.current) {
                await markAudioAsPlayed(currentAudioIdRef.current);
              }
            } catch (error) {
              console.error('Error al reproducir audio:', error);
              // En caso de error, resetear flags para intentar de nuevo
              hasAutoPlayedRef.current = false;
            }
          }
        }, 300); // Delay optimizado para mejor compatibilidad
        
        return () => {
          clearTimeout(timer);
          isMountedRef.current = false;
        };
      }
    };

    checkAndPlayAudio();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [latestBotAudioUri, isLoaded, playbackState, play, audioAmplitude]);

  // =============== FUNCIÓN STOP
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
