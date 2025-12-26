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
  },
  dark: {
    text: '#ffffff',
    background: '#1e1e1e',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    tabBackground: '#1e1e1e',
  },
  // Colores específicos por género
  gender: {
    Man: {
      light: {
        text: '#000000',
        background: '#cdcdcd',
        tint: '#1976d2',
        icon: '#687076',
        tabIconDefault: '#1976d2',
        tabIconSelected: '#0d47a1',
        tabBackground: '#cdcdcd',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#005096',
        jarvisGlow: 'rgba(94,242,255,0.5)',
        jarvisCore: 'rgba(94,242,255,0.05)',
        jarvisGradientStart: '#EFFFFF',
        jarvisGradientMiddle: '#005096',
        jarvisGradientEnd: '#003844',
      },
      dark: {
        text: '#ffffff',
        background: '#1e1e1e',
        tint: '#64b5f6',
        icon: '#687076',
        tabIconDefault: '#64b5f6',
        tabIconSelected: '#bbdefb',
        tabBackground: '#1e1e1e',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#005096',
        jarvisGlow: 'rgba(94,242,255,0.5)',
        jarvisCore: 'rgba(94,242,255,0.05)',
        jarvisGradientStart: '#EFFFFF',
        jarvisGradientMiddle: '#005096',
        jarvisGradientEnd: '#003844',
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
        jarvisGlow: 'rgba(244,143,177,0.5)',
        jarvisCore: 'rgba(244,143,177,0.05)',
        jarvisGradientStart: '#fce4ec',
        jarvisGradientMiddle: '#e91e63',
        jarvisGradientEnd: '#4a148c',
      },
      dark: {
        text: '#ffffff',
        background: '#1e1e1e',
        tint: '#e91e63',
        icon: '#687076',
        tabIconDefault: '#e91e63',
        tabIconSelected: '#fce4ec',
        tabBackground: '#1e1e1e',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#e91e63',
        jarvisGlow: 'rgba(244,143,177,0.5)',
        jarvisCore: 'rgba(244,143,177,0.05)',
        jarvisGradientStart: '#fce4ec',
        jarvisGradientMiddle: '#e91e63',
        jarvisGradientEnd: '#4a148c',
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
