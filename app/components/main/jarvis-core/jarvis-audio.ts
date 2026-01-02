import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation
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

  // Estados para controlar las animaciones
  const [animationMode, setAnimationMode] = useState<'normal' | 'reactive' | 'resetting'>('normal');
  const [hasAudioAnimation, setHasAudioAnimation] = useState(false);

  // Valores animados
  const audioAmplitude = useSharedValue(0);
  const rotateAngle = useSharedValue(0);
  const breathValue = useSharedValue(0);
  const timeValue = useSharedValue(0);

  // =============== ANIMACIONES BÁSICAS (solo una vez)
  useEffect(() => {
    // TimeValue animation
    timeValue.value = withRepeat(
      withTiming(1000, { duration: 3500, easing: Easing.linear }),
      -1, false
    );

    // Rotate angle animation
    rotateAngle.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1, false
    );

    // Breath animation
    breathValue.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );

    return () => {
      // Cleanup al desmontar
      cancelAnimation(timeValue);
      cancelAnimation(rotateAngle);
      cancelAnimation(breathValue);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencias vacías - solo se ejecuta una vez

  // =============== CONTROL DE MODO DE ANIMACIÓN
  useEffect(() => {
    if (animationMode === 'normal') {
      // Animación normal: ruido de fondo suave
      if (hasAudioAnimation) {
        // Cancelar cualquier animación previa
        cancelAnimation(audioAmplitude);
        setHasAudioAnimation(false);
      }
      
      // Activar animación suave de ruido
      audioAmplitude.value = withRepeat(
        withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        -1, true
      );
      setHasAudioAnimation(true);
      
    } else if (animationMode === 'reactive') {
      // Animación reactiva: durante el audio
      if (hasAudioAnimation) {
        cancelAnimation(audioAmplitude);
        setHasAudioAnimation(false);
      }
      
      audioAmplitude.value = withRepeat(
        withTiming(2, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        -1, true
      );
      setHasAudioAnimation(true);
      
    } else if (animationMode === 'resetting') {
      // Modo reset: transición suave al estado normal
      if (hasAudioAnimation) {
        cancelAnimation(audioAmplitude);
        setHasAudioAnimation(false);
      }
      
      audioAmplitude.value = withTiming(0.5, { 
        duration: 300, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      });
      
      // Cambiar a modo normal después de la transición
      setTimeout(() => {
        setAnimationMode('normal');
      }, 350);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationMode, hasAudioAnimation]);

  // =============== LÓGICA DE AUTO-REPRODUCCIÓN
  useEffect(() => {
    // Marcamos que el componente está montado para evitar ejecutar lógica en componentes desmontados
    isMountedRef.current = true;
    
    // Si no hay URI de audio del bot, aseguramos modo normal y salimos
    if (!latestBotAudioUri) {
      setAnimationMode('normal'); // Asegurar modo normal cuando no hay audio
      return () => {
        isMountedRef.current = false;
      };
    }

    // Detectar si es un audio NUEVO comparando con el anterior
    const isNewAudio = latestBotAudioUri !== previousAudioUriRef.current;
    
    if (isNewAudio) {
      // Actualizar referencias para el nuevo audio
      previousAudioUriRef.current = latestBotAudioUri;
      hasAutoPlayedRef.current = false; // Resetear flag de auto-reproducción
      currentAudioIdRef.current = generateAudioId(latestBotAudioUri);
    }

    const checkAndPlayAudio = async () => {
      if (!currentAudioIdRef.current) return;
      
      // Verificar si este audio ya fue reproducido anteriormente (persistencia)
      const alreadyPlayed = await hasAudioBeenPlayed(currentAudioIdRef.current);
      
      // Condiciones para auto-reproducir:
      // 1. Audio cargado
      // 2. No se ha auto-reproducido en esta sesión
      // 3. Player está en estado 'stopped'
      // 4. No ha sido reproducido anteriormente (persistencia)
      if (isLoaded && !hasAutoPlayedRef.current && playbackState === 'stopped' && !alreadyPlayed) {
        hasAutoPlayedRef.current = true; // Marcar como auto-reproducido
        
        // Timer con delay para evitar conflictos con otros procesos
        const timer = setTimeout(async () => {
          if (isMountedRef.current) {
            try {
              // Ejecutar reproducción del audio
              await play();
              setAnimationMode('reactive'); // Cambiar a modo reactivo para animaciones
              
              // Marcar como reproducido en almacenamiento persistente
              if (currentAudioIdRef.current) {
                await markAudioAsPlayed(currentAudioIdRef.current);
              }
            } catch (error) {
              console.error('Error al reproducir audio:', error);
              hasAutoPlayedRef.current = false; // Resetear flag en caso de error
            }
          }
        }, 200); // Delay reducido para mejor responsividad
        
        return () => {
          clearTimeout(timer);
          isMountedRef.current = false;
        };
      }
    };

    checkAndPlayAudio(); // Ejecutar verificación
    
    return () => {
      isMountedRef.current = false;
    };
  }, [latestBotAudioUri, isLoaded, playbackState, play]);

  // =============== DETECTAR FIN DE AUDIO
  useEffect(() => {
    // Detectar cuando el audio pasa de 'playing' a 'stopped' (fin natural)
    // Solo se activa si el audio fue auto-reproducido
    if (hasAutoPlayedRef.current && playbackState === 'stopped') {
      setAnimationMode('resetting'); // Activar modo reset
      hasAutoPlayedRef.current = false;
    }
  }, [playbackState]);

  // =============== FUNCIÓN STOP
  const stopAudio = async () => {
    try {
      // Detener la reproducción del audio usando el hook useAudioPlayer
      await stop();
      
      // Resetear flag para permitir futuras reproducciones automáticas
      hasAutoPlayedRef.current = false;
      
      // Activar modo reset para volver suavemente al estado normal de animaciones
      setAnimationMode('resetting');
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
