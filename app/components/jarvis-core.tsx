import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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
const VoiceSpectrum = ({ center, innerRadius, amplitude, timeValue, isProcessing }: { center: number, innerRadius: number, amplitude: SharedValue<number>, timeValue: SharedValue<number>, isProcessing: boolean }) => {
  const barCount = 100;

  const Bar = ({ i, timeValue, isProcessing }: { i: number, timeValue: SharedValue<number>, isProcessing: boolean }) => {
    const angle = (i * (360 / barCount)) * (Math.PI / 180);

    const animatedBarProps = useAnimatedProps(() => {
      let height;
      if (!isProcessing) {
        const randomFactor = Math.sin(i * 0.5) * 0.5 + 0.5;
        height = interpolate(amplitude.value, [0, 2], [10, 5 * randomFactor]);
      } else {
        const freq = 0.1;
        const wave = (Math.sin(timeValue.value * freq + i * 0.3) + 1) * 0.5;
        height = 10 + 5 * wave;
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
        stroke="#5EF2FF"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    );
  };

  const bars = Array.from({ length: barCount }, (_, i) => <Bar key={i} i={i} timeValue={timeValue} isProcessing={isProcessing} />);

  return <G>{bars}</G>;
};

const HudTicks = ({ center, radius }: { center: number, radius: number }) => {
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6) * (Math.PI / 180);
    const isMajor = i % 5 === 0;
    const length = isMajor ? 12 : 5;
    ticks.push(
      <Line
        key={i}
        x1={center + radius * Math.cos(angle)}
        y1={center + radius * Math.sin(angle)}
        x2={center + (radius + length) * Math.cos(angle)}
        y2={center + (radius + length) * Math.sin(angle)}
        stroke="#5EF2FF"
        strokeWidth={isMajor ? 2 : 1}
        strokeOpacity={isMajor ? 0.8 : 0.2}
      />
    );
  }
  return <G>{ticks}</G>;
};

export default function JarvisCore({ isProcessing = false }) {
  const size = 320;
  const center = size / 2;

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
    r: interpolate(breathValue.value, [0, 1], [42, 52]),
    fillOpacity: interpolate(breathValue.value, [0, 1], [0.6, 1]),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, glowStyle]}>
        <View style={[styles.gradient, {backgroundColor: 'rgba(94,242,255,0.3)'}]} />
      </Animated.View>

      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="coreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#EFFFFF" stopOpacity="1" />
            <Stop offset="50%" stopColor="#5EF2FF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#003844" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* HUD Exterior */}
        <HudTicks center={center} radius={125} />

        {/* Anillo de Fragmentos (Tech Ring) */}
        <AnimatedG animatedProps={rotateProps}>
          <Circle
            cx={center} cy={center} r={110}
            stroke="#5EF2FF" strokeWidth={6} strokeOpacity={0.2}
            strokeDasharray={[2, 10, 30, 15]} fill="none"
          />
        </AnimatedG>

        {/* Espectro de Voz (Radial) */}
        <VoiceSpectrum center={center} innerRadius={55} amplitude={audioAmplitude} timeValue={timeValue} isProcessing={isProcessing} />

        {/* Anillos Giratorios Principales */}
        <AnimatedG animatedProps={rotateProps}>
          <Circle cx={center} cy={center} r={150} stroke="#5EF2FF" strokeWidth={10} strokeOpacity={1} strokeDasharray={[360, 360]} fill="none" />
          <Circle cx={center} cy={center} r={150} stroke="#5EF2FF" strokeWidth={2} strokeOpacity={0.5} strokeDasharray={[360, 0]} strokeDashoffset={180} fill="none" />
        </AnimatedG>

        <AnimatedG animatedProps={counterRotateProps}>
          <Circle cx={center} cy={center} r={95} stroke="#5EF2FF" strokeWidth={1.5} strokeOpacity={0.4} strokeDasharray={[5, 10]} fill="none" />
        </AnimatedG>

        {/* Núcleo Central */}
        <Circle cx={center} cy={center} r={45} fill="rgba(94,242,255,0.05)" />
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
    width: 190,
    height: 190
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
