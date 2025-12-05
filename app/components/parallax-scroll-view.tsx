import type { PropsWithChildren } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerBackgroundColor,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0a0a5c', '#004480']}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.ScrollView
        ref={scrollRef}
        style={{ backgroundColor: 'transparent', flex: 1 }}
        scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          headerAnimatedStyle,
        ]}>
        <LinearGradient
          colors={['#008080', '#20b2aa']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.headerTitle}>
          <Image source={require('@/assets/images/bot.png')} style={styles.botImage} />
          <View style={styles.bubble}>
            <ThemedText type="title" lightColor="black" darkColor="black" style={{fontFamily: 'monospace', fontSize: 30,}}
              >
              HOLA 😀
              </ThemedText>
            <View style={styles.pointer} />
          </View>
        </View>
      </Animated.View>
        <ThemedView style={[styles.content, { backgroundColor: 'transparent' }]}>{children}</ThemedView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  headerTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },
  botImage: {
    width: 150,
    height: 150,
    position: 'absolute',
    left: 20,
    bottom: -5,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'relative',
    marginLeft: 120,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    position: 'absolute',
    left: -15,
    top: '50%',
    transform: [{translateY: -10}],
  },
});
