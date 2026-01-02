import React from 'react';
import { Circle, Line, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  interpolate,
  SharedValue
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedLine = Animated.createAnimatedComponent(Line);

// Tipos para los componentes
export interface VoiceSpectrumProps {
  center: number;
  innerRadius: number;
  amplitude: SharedValue<number>;
  timeValue: SharedValue<number>;
  isProcessing: boolean;
  jarvisPrimary: string;
  scale: number;
}

export interface HudTicksProps {
  center: number;
  radius: number;
  jarvisPrimary: string;
  scale: number;
}

export interface CoreRingsProps {
  center: number;
  scale: number;
  jarvisPrimary: string;
  rotateProps: any;
  counterRotateProps: any;
}

export interface CoreCenterProps {
  center: number;
  scale: number;
  jarvisCore: string;
  coreBreathProps: any;
}

// ==================== COMPONENTE VOICE SPECTRUM ====================
export const VoiceSpectrum = ({
  center,
  innerRadius,
  amplitude,
  timeValue,
  isProcessing,
  jarvisPrimary,
  scale
}: VoiceSpectrumProps) => {
  const barCount = 80;

  const Bar = ({
    i,
    timeValue,
    isProcessing,
    scale
  }: {
    i: number;
    timeValue: SharedValue<number>;
    isProcessing: boolean;
    scale: number;
  }) => {
    const angle = (i * (360 / barCount)) * (Math.PI / 180);

    const animatedBarProps = useAnimatedProps(() => {
      let height;
      if (!isProcessing) {
        const randomFactor = Math.sin(i * 0.5) * 0.5 + 0.5;
        height = interpolate(amplitude.value, [0, 2], [10 * scale, 5 * randomFactor * scale]);
      } else {
        const freq = 0.1;
        const wave = (Math.sin(timeValue.value * freq + i * 0.3) + 1) * 0.5;
        height = (10 + 5 * wave) * scale;
      }

      return {
        x1: center + innerRadius * Math.cos(angle),
        y1: center + innerRadius * Math.sin(angle),
        x2: center + (innerRadius + height) * Math.cos(angle),
        y2: center + (innerRadius + height) * Math.sin(angle),
        strokeOpacity: interpolate(amplitude.value, [0, 1], [0.2, 0.8]),
      };
    });

    return (
      <AnimatedLine
        animatedProps={animatedBarProps}
        stroke={jarvisPrimary}
        strokeWidth={Math.max(1, 1.5 * scale)}
        strokeLinecap="round"
      />
    );
  };

  const bars = Array.from({ length: barCount }, (_, i) => (
    <Bar key={i} i={i} timeValue={timeValue} isProcessing={isProcessing} scale={scale} />
  ));

  return <G>{bars}</G>;
};

// ==================== COMPONENTE HUD TICKS ====================
export const HudTicks = ({ center, radius, jarvisPrimary, scale }: HudTicksProps) => {
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6) * (Math.PI / 180);
    const isMajor = i % 5 === 0;
    const length = isMajor ? 12 * scale : 5 * scale;
    ticks.push(
      <Line
        key={i}
        x1={center + radius * Math.cos(angle)}
        y1={center + radius * Math.sin(angle)}
        x2={center + (radius + length) * Math.cos(angle)}
        y2={center + (radius + length) * Math.sin(angle)}
        stroke={jarvisPrimary}
        strokeWidth={Math.max(1, isMajor ? 2 * scale : 1 * scale)}
        strokeOpacity={isMajor ? 0.8 : 0.2}
      />
    );
  }
  return <G>{ticks}</G>;
};

// ==================== COMPONENTE CORE RINGS ====================
export const CoreRings = ({ 
  center, 
  scale, 
  jarvisPrimary, 
  rotateProps, 
  counterRotateProps 
}: CoreRingsProps) => {
  return (
    <>
      {/* Anillo de Fragmentos (Tech Ring) */}
      <AnimatedG animatedProps={rotateProps}>
        <Circle
          cx={center} cy={center} r={105 * scale}
          stroke={jarvisPrimary} strokeWidth={Math.max(1, 7 * scale)} strokeOpacity={0.5}
          strokeDasharray={[2 * scale, 10 * scale, 30 * scale, 15 * scale]} fill="none"
        />
      </AnimatedG>

      {/* Anillos Giratorios Principales */}
      <AnimatedG animatedProps={rotateProps}>
        <Circle cx={center} cy={center} r={150 * scale} stroke={jarvisPrimary} strokeWidth={Math.max(1, 17 * scale)} strokeOpacity={1} strokeDasharray={[360 * scale, 90 * scale]} fill="none" />
        <Circle cx={center} cy={center} r={150 * scale} stroke={jarvisPrimary} strokeWidth={Math.max(1, 2 * scale)} strokeOpacity={0.5} strokeDasharray={[360 * scale, 0]} strokeDashoffset={180 * scale} fill="none" />
      </AnimatedG>

      <AnimatedG animatedProps={counterRotateProps}>
        <Circle cx={center} cy={center} r={90 * scale} stroke={jarvisPrimary} strokeWidth={Math.max(1, 1.5 * scale)} strokeOpacity={0.4} strokeDasharray={[5 * scale, 10 * scale]} fill="none" />
      </AnimatedG>
    </>
  );
};

// ==================== COMPONENTE CORE CENTER ====================
export const CoreCenter = ({ 
  center, 
  scale, 
  jarvisCore, 
  coreBreathProps 
}: CoreCenterProps) => {
  return (
    <>
      {/* Núcleo Central */}
      <Circle cx={center} cy={center} r={45 * scale} fill={jarvisCore} />
      <AnimatedCircle cx={center} cy={center} animatedProps={coreBreathProps} fill="url(#coreGlow)" />
    </>
  );
};

// ==================== COMPONENTE GRADIENTS ====================
export const JarvisGradients = ({ 
  jarvisGradientStart, 
  jarvisGradientMiddle, 
  jarvisGradientEnd 
}: {
  jarvisGradientStart: string;
  jarvisGradientMiddle: string;
  jarvisGradientEnd: string;
}) => {
  return (
    <Defs>
      <RadialGradient id="coreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
        <Stop offset="0%" stopColor={jarvisGradientStart} stopOpacity="1" />
        <Stop offset="50%" stopColor={jarvisGradientMiddle} stopOpacity="0.8" />
        <Stop offset="100%" stopColor={jarvisGradientEnd} stopOpacity="0" />
      </RadialGradient>
    </Defs>
  );
};
