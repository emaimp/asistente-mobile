import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import Svg, { Circle, Line, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  interpolate,
  SharedValue
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedLine = Animated.createAnimatedComponent(Line);

// Espectro de Voz Radial
const VoiceSpectrum = ({
  center,
  innerRadius,
  amplitude,
  timeValue,
  isProcessing,
  jarvisPrimary,
  scale
}: {
  center: number,
  innerRadius: number,
  amplitude: SharedValue<number>,
  timeValue: SharedValue<number>,
  isProcessing: boolean,
  jarvisPrimary: string,
  scale: number
}) => {
  const barCount = 80;

  const Bar = ({
    i,
    timeValue,
    isProcessing,
    scale
  }: {
    i: number,
    timeValue: SharedValue<number>,
    isProcessing: boolean,
    scale: number
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

  const bars = Array.from({ length: barCount }, (_, i) => <Bar key={i} i={i} timeValue={timeValue} isProcessing={isProcessing} scale={scale} />);

  return <G>{bars}</G>;
};

const HudTicks = ({ center, radius, jarvisPrimary, scale }: { center: number, radius: number, jarvisPrimary: string, scale: number }) => {
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

export default function JarvisCore({ isProcessing = false, size = 320 }) {
  // Colores dinámicos basados en género
  const jarvisPrimary = useThemeColor({}, 'jarvisPrimary');
  const jarvisGlow = useThemeColor({}, 'jarvisGlow');
  const jarvisCore = useThemeColor({}, 'jarvisCore');
  const jarvisGradientStart = useThemeColor({}, 'jarvisGradientStart');
  const jarvisGradientMiddle = useThemeColor({}, 'jarvisGradientMiddle');
  const jarvisGradientEnd = useThemeColor({}, 'jarvisGradientEnd');

  const center = size / 2;
  const scale = size / 320; // Factor de escala basado en tamaño original
  const rotateAngle = useSharedValue(0);
  const breathValue = useSharedValue(0);
  const audioAmplitude = useSharedValue(0);
  const timeValue = useSharedValue(0);

  useEffect(() => {
    timeValue.value = withRepeat(
      withTiming(1000, { duration: 3500, easing: Easing.linear }),
      -1, false
    );
  }, [timeValue]);

  useEffect(() => {
    rotateAngle.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1, false
    );

    breathValue.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );

    // Simulación de ruido de audio
    audioAmplitude.value = withRepeat(
      withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      -1, true
    );
  }, [audioAmplitude, breathValue, rotateAngle]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.1,
  }));

  const rotateProps = useAnimatedProps(() => ({
    transform: [{ translateX: center }, { translateY: center }, { rotate: `${rotateAngle.value}deg` }, { translateX: -center }, { translateY: -center }]
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
        <Defs>
          <RadialGradient id="coreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={jarvisGradientStart} stopOpacity="1" />
            <Stop offset="50%" stopColor={jarvisGradientMiddle} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={jarvisGradientEnd} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* HUD (estilo reloj) */}
        <HudTicks center={center} radius={120 * scale} jarvisPrimary={jarvisPrimary} scale={scale} />

        {/* Anillo de Fragmentos (Tech Ring) */}
        <AnimatedG animatedProps={rotateProps}>
          <Circle
            cx={center} cy={center} r={105 * scale}
            stroke={jarvisPrimary} strokeWidth={Math.max(1, 7 * scale)} strokeOpacity={0.5}
            strokeDasharray={[2 * scale, 10 * scale, 30 * scale, 15 * scale]} fill="none"
          />
        </AnimatedG>

        {/* Espectro de Voz (Radial) */}
        <VoiceSpectrum center={center} innerRadius={55 * scale} amplitude={audioAmplitude} timeValue={timeValue} isProcessing={isProcessing} jarvisPrimary={jarvisPrimary} scale={scale} />

        {/* Anillos Giratorios Principales */}
        <AnimatedG animatedProps={rotateProps}>
          <Circle cx={center} cy={center} r={150 * scale} stroke={jarvisPrimary} strokeWidth={Math.max(1, 17 * scale)} strokeOpacity={1} strokeDasharray={[360 * scale, 90 * scale]} fill="none" />
          <Circle cx={center} cy={center} r={150 * scale} stroke={jarvisPrimary} strokeWidth={Math.max(1, 2 * scale)} strokeOpacity={0.5} strokeDasharray={[360 * scale, 0]} strokeDashoffset={180 * scale} fill="none" />
        </AnimatedG>

        <AnimatedG animatedProps={counterRotateProps}>
          <Circle cx={center} cy={center} r={90 * scale} stroke={jarvisPrimary} strokeWidth={Math.max(1, 1.5 * scale)} strokeOpacity={0.4} strokeDasharray={[5 * scale, 10 * scale]} fill="none" />
        </AnimatedG>

        {/* Núcleo Central */}
        <Circle cx={center} cy={center} r={45 * scale} fill={jarvisCore} />
        <AnimatedCircle cx={center} cy={center} animatedProps={coreBreathProps} fill="url(#coreGlow)" />
      </Svg>
    </View>
  );
}

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
  },
  gradient: {
    flex: 1,
    borderRadius: 170
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center'
  },
});
