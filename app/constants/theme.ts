/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1e1e1e';
const tintColorDark = '#cdcdcd';

export const Colors = {
  light: {
    text: '#000000',
    background: '#cdcdcd',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    tabBackground: '#cdcdcd',

    // Colores para notificaciones
    successPrimary: '#00a21c',
    errorPrimary: '#b50f05',
  },
  dark: {
    text: '#ffffff',
    background: '#1e1e1e',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    tabBackground: '#1e1e1e',

    // Colores para notificaciones
    successPrimary: '#00a21c',
    errorPrimary: '#b50f05',
  },
  // Colores específicos por género
  gender: {
    Man: {
      light: {
        text: '#000000',
        background: '#cdcdcd',
        tint: '#005096',
        icon: '#687076',
        tabIconDefault: '#005096',
        tabIconSelected: '#0b3660',
        tabBackground: '#cdcdcd',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#005096',
        jarvisGlow: 'rgba(0,80,150,0.3)',
        jarvisCore: 'rgba(94,242,255,0.05)',
        jarvisGradientStart: '#EFFFFF',
        jarvisGradientMiddle: '#005096',
        jarvisGradientEnd: '#003844',

        // Colores para estados del audio recorder
        recordingPrimary: '#ff0000',
        recordingSecondary: '#800000',
        playingPrimary: '#00ff00',
        playingSecondary: '#008000',
      },
      dark: {
        text: '#ffffff',
        background: '#1e1e1e',
        tint: '#005096',
        icon: '#687076',
        tabIconDefault: '#005096',
        tabIconSelected: '#0b3660',
        tabBackground: '#1e1e1e',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#005096',
        jarvisGlow: 'rgba(0,80,150,0.3)',
        jarvisCore: 'rgba(94,242,255,0.05)',
        jarvisGradientStart: '#EFFFFF',
        jarvisGradientMiddle: '#005096',
        jarvisGradientEnd: '#003844',

        // Colores para estados del audio recorder
        recordingPrimary: '#ff0000',
        recordingSecondary: '#800000',
        playingPrimary: '#00ff00',
        playingSecondary: '#008000',
      },
    },
    Woman: {
      light: {
        text: '#000000',
        background: '#cdcdcd',
        tint: '#e91e63',
        icon: '#687076',
        tabIconDefault: '#e91e63',
        tabIconSelected: '#880e4f',
        tabBackground: '#cdcdcd',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#e91e63',
        jarvisGlow: 'rgba(233,30,99,0.3)',
        jarvisCore: 'rgba(244,143,177,0.05)',
        jarvisGradientStart: '#fce4ec',
        jarvisGradientMiddle: '#e91e63',
        jarvisGradientEnd: '#4a148c',

        // Colores para estados del audio recorder
        recordingPrimary: '#ff0000',
        recordingSecondary: '#800000',
        playingPrimary: '#00ff00',
        playingSecondary: '#008000',
      },
      dark: {
        text: '#ffffff',
        background: '#1e1e1e',
        tint: '#e91e63',
        icon: '#687076',
        tabIconDefault: '#e91e63',
        tabIconSelected: '#880e4f',
        tabBackground: '#1e1e1e',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#e91e63',
        jarvisGlow: 'rgba(233,30,99,0.3)',
        jarvisCore: 'rgba(244,143,177,0.05)',
        jarvisGradientStart: '#fce4ec',
        jarvisGradientMiddle: '#e91e63',
        jarvisGradientEnd: '#4a148c',

        // Colores para estados del audio recorder
        recordingPrimary: '#ff0000',
        recordingSecondary: '#800000',
        playingPrimary: '#00ff00',
        playingSecondary: '#008000',
      },
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
