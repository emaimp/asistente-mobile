/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#000000';
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    tabBackground: '#ffffff',

    // Colores para notificaciones
    successPrimary: '#00a21c',
    errorPrimary: '#cb0000',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    tabBackground: '#000000',

    // Colores para notificaciones
    successPrimary: '#00a21c',
    errorPrimary: '#cb0000',
  },

  // Colores específicos por género
  gender: {
    Man: {
      light: {
        text: '#000000',
        background: '#ffffff',
        tint: '#005096',
        icon: '#687076',
        tabIconDefault: '#005096',
        tabIconSelected: '#0b3660',
        tabBackground: '#ffffff',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#005096',
        jarvisGlow: 'rgba(0,80,150,0.3)',
        jarvisCore: 'rgba(94,242,255,0.05)',
        jarvisGradientStart: '#EFFFFF',
        jarvisGradientMiddle: '#005096',
        jarvisGradientEnd: '#003844',
      },
      dark: {
        text: '#ffffff',
        background: '#000000',
        tint: '#005096',
        icon: '#687076',
        tabIconDefault: '#005096',
        tabIconSelected: '#0b3660',
        tabBackground: '#000000',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#005096',
        jarvisGlow: 'rgba(0,80,150,0.3)',
        jarvisCore: 'rgba(94,242,255,0.05)',
        jarvisGradientStart: '#EFFFFF',
        jarvisGradientMiddle: '#005096',
        jarvisGradientEnd: '#003844',
      },
    },
    Woman: {
      light: {
        text: '#000000',
        background: '#ffffff',
        tint: '#e91e63',
        icon: '#687076',
        tabIconDefault: '#e91e63',
        tabIconSelected: '#880e4f',
        tabBackground: '#ffffff',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#e91e63',
        jarvisGlow: 'rgba(233,30,99,0.3)',
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
        tabIconSelected: '#880e4f',
        tabBackground: '#000000',

        // Colores específicos para jarvis-core
        jarvisPrimary: '#e91e63',
        jarvisGlow: 'rgba(233,30,99,0.3)',
        jarvisCore: 'rgba(244,143,177,0.05)',
        jarvisGradientStart: '#fce4ec',
        jarvisGradientMiddle: '#e91e63',
        jarvisGradientEnd: '#4a148c',
      },
    },
  },
};

// Esquema de colores para el background
export const BackgroundPatterns = {
  // Polígonos en escalas de blanco y negro
  gender: {
    Man: {
      light: {
        tone1: '#f5f5f5',
        tone2: '#ffffff',
        tone3: '#e3e4e5',
      },
      dark: {
        tone1: '#1a1a1a',
        tone2: '#000000',
        tone3: '#404040',
        tone4: '#525252',
      },
    },
    Woman: {
      light: {
        tone1: '#f5f5f5',
        tone2: '#ffffff',
        tone3: '#e3e4e5',
      },
      dark: {
        tone1: '#1a1a1a',
        tone2: '#2d2d2d',
        tone3: '#404040',
        tone4: '#525252',
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
