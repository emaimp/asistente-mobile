import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedLine = Animated.createAnimatedComponent(Line);

/* ───────── Espectro de Voz Radial ───────── */
const VoiceSpectrum = ({ center, innerRadius, amplitude }: { center: number, innerRadius: number, amplitude: SharedValue<number> }) => {
  const barCount = 70;

  const Bar = ({ i }: { i: number }) => {
    const angle = (i * (360 / barCount)) * (Math.PI / 180);

    const animatedBarProps = useAnimatedProps(() => {
      const randomFactor = Math.sin(i * 0.5) * 0.5 + 0.5;
      const height = interpolate(amplitude.value, [0, 2], [10, 5 * randomFactor]);

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

  const bars = Array.from({ length: barCount }, (_, i) => <Bar key={i} i={i} />);

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
  const audioAmplitude = useSharedValue(0); // <--- VALOR PARA EL AUDIO

  useEffect(() => {
    rotateAngle.value = withRepeat(
      withTiming(360, { duration: isProcessing ? 3000 : 10000, easing: Easing.linear }),
      -1, false
    );

    breathValue.value = withRepeat(
      withTiming(1, { duration: isProcessing ? 600 : 1800, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );

    // Simulación de ruido de audio (esto lo reemplazarás con datos reales)
    audioAmplitude.value = withRepeat(
      withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      -1, true
    );
  }, [audioAmplitude, breathValue, isProcessing, rotateAngle]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateAngle.value}deg` },
      { scale: interpolate(breathValue.value, [0, 1], [0.80, 0.85]) }
    ],
    opacity: interpolate(breathValue.value, [0, 1], isProcessing ? [0.4, 0.8] : [0.2, 0.5]),
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
        <LinearGradient colors={['rgba(94,242,255,0.4)', 'transparent']} style={styles.gradient} />
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
        <HudTicks center={center} radius={145} />

        {/* Anillo de Fragmentos (Tech Ring) */}
        <AnimatedG animatedProps={rotateProps}>
          <Circle
            cx={center} cy={center} r={110}
            stroke="#5EF2FF" strokeWidth={6} strokeOpacity={0.2}
            strokeDasharray={[2, 10, 30, 15]} fill="none"
          />
        </AnimatedG>

        {/* Espectro de Voz (Radial) */}
        <VoiceSpectrum center={center} innerRadius={55} amplitude={audioAmplitude} />

        {/* Anillos Giratorios Principales */}
        <AnimatedG animatedProps={rotateProps}>
          <Circle cx={center} cy={center} r={130} stroke="#5EF2FF" strokeWidth={2} strokeOpacity={0.5} strokeDasharray={[20, 15]} fill="none" />
        </AnimatedG>

        <AnimatedG animatedProps={counterRotateProps}>
          <Circle cx={center} cy={center} r={95} stroke="#5EF2FF" strokeWidth={1.5} strokeOpacity={0.4} strokeDasharray={[5, 10]} fill="none" />
        </AnimatedG>

        {/* Núcleo Central */}
        <Circle cx={center} cy={center} r={45} fill="rgba(94,242,255,0.05)" />
        <AnimatedCircle cx={center} cy={center} animatedProps={coreBreathProps} fill="url(#coreGlow)" />
      </Svg>

      <View style={styles.centerText} pointerEvents="none">
        <Text style={styles.jarvisText}>J.A.R.V.I.S</Text>
        <Text style={styles.subtitleText}>{isProcessing ? 'PROCESSING...' : 'CORE SYSTEM'}</Text>
      </View>
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
    width: 340,
    height: 340
  },
  gradient: {
    flex: 1,
    borderRadius: 170
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center'
  },
  jarvisText: {
    color: '#5EF2FF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(94,242,255,0.8)',
    textShadowRadius: 10
  },
  subtitleText: {
    color: 'rgba(94,242,255,0.5)',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 4,
    letterSpacing: 1
  },
});
