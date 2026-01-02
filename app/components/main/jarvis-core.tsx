import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useConversationContext } from '@/contexts/conversation-context';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';
import { 
  VoiceSpectrum, 
  HudTicks, 
  CoreRings, 
  CoreCenter, 
  JarvisGradients 
} from './jarvis-core/jarvis-components';
import { useJarvisAudio } from './jarvis-core/jarvis-audio';

interface JarvisCoreProps {
  size?: number;
  latestBotAudioUri?: string;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export interface JarvisCoreRef {
  stopAudio: () => Promise<void>;
  isPlaying: () => boolean;
}

const JarvisCore = forwardRef<JarvisCoreRef, JarvisCoreProps>(({ 
  size = 320,
  latestBotAudioUri,
  onPlaybackStateChange
}, ref) => {
  // Colores dinámicos basados en género
  const jarvisPrimary = useThemeColor({}, 'jarvisPrimary');
  const jarvisGlow = useThemeColor({}, 'jarvisGlow');
  const jarvisCore = useThemeColor({}, 'jarvisCore');
  const jarvisGradientStart = useThemeColor({}, 'jarvisGradientStart');
  const jarvisGradientMiddle = useThemeColor({}, 'jarvisGradientMiddle');
  const jarvisGradientEnd = useThemeColor({}, 'jarvisGradientEnd');

  // Obtener estado de procesamiento del contexto
  const { isProcessing } = useConversationContext();

  const center = size / 2;
  const scale = size / 320; // Factor de escala basado en tamaño original

  // Hook modularizado para toda la lógica de audio y animaciones
  const {
    playbackState,
    audioAmplitude,
    rotateAngle,
    breathValue,
    timeValue,
    stopAudio,
    fastRotateAngle,
    isThinking
  } = useJarvisAudio({ 
    latestBotAudioUri,
    isProcessing
  });

  // Exponer funciones para uso externo
  useImperativeHandle(ref, () => ({
    stopAudio: stopAudio,
    isPlaying: () => playbackState === 'playing'
  }));

  // Notificar cambios en el estado de reproducción
  useEffect(() => {
    onPlaybackStateChange?.(playbackState === 'playing');
  }, [playbackState, onPlaybackStateChange]);

  // Estilos animados
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.1,
  }));

  const rotateProps = useAnimatedProps(() => ({
    transform: [{ translateX: center }, { translateY: center }, { rotate: `${rotateAngle.value}deg` }, { translateX: -center }, { translateY: -center }]
  }));

  // Props para la rotación rápida del anillo externo
  const fastRotateProps = useAnimatedProps(() => ({
    transform: [{ translateX: center }, { translateY: center }, { rotate: `${fastRotateAngle.value}deg` }, { translateX: -center }, { translateY: -center }]
  }));

  const counterRotateProps = useAnimatedProps(() => ({
    transform: [{ translateX: center }, { translateY: center }, { rotate: `${-rotateAngle.value * 1.5}deg` }, { translateX: -center }, { translateY: -center }]
  }));

  const coreBreathProps = useAnimatedProps(() => ({
    r: interpolate(breathValue.value, [0, 1], [42 * scale, 52 * scale]),
    fillOpacity: interpolate(breathValue.value, [0, 1], [0.6, 1]),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[{ position: 'absolute', width: 180 * scale, height: 180 * scale, borderRadius: 170 * scale }, glowStyle]}>
        <View style={[{ flex: 1, backgroundColor: jarvisGlow, borderRadius: 170 * scale }]} />
      </Animated.View>

      <Svg width={size} height={size}>
        {/* Gradientes */}
        <JarvisGradients 
          jarvisGradientStart={jarvisGradientStart}
          jarvisGradientMiddle={jarvisGradientMiddle}
          jarvisGradientEnd={jarvisGradientEnd}
        />

        {/* HUD (estilo reloj) */}
        <HudTicks 
          center={center} 
          radius={120 * scale} 
          jarvisPrimary={jarvisPrimary} 
          scale={scale} 
        />

        {/* Anillos Core */}
        <CoreRings 
          center={center} 
          scale={scale} 
          jarvisPrimary={jarvisPrimary} 
          rotateProps={rotateProps} 
          counterRotateProps={counterRotateProps}
          fastRotateProps={isThinking ? fastRotateProps : undefined}
        />

        {/* Espectro de Voz (Radial) - Se activa con audio del bot */}
        <VoiceSpectrum 
          center={center} 
          innerRadius={55 * scale} 
          amplitude={audioAmplitude} 
          timeValue={timeValue} 
          isProcessing={!!latestBotAudioUri && playbackState === 'playing'} 
          jarvisPrimary={jarvisPrimary} 
          scale={scale} 
        />

        {/* Núcleo Central */}
        <CoreCenter 
          center={center} 
          scale={scale} 
          jarvisCore={jarvisCore} 
          coreBreathProps={coreBreathProps} 
        />
      </Svg>
    </View>
  );
});

// Agregar display name al componente forwardRef
JarvisCore.displayName = 'JarvisCore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180
  }
});

export default JarvisCore;
