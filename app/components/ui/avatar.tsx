import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { ThemedView } from './theme/themed-view';
import { ThemedText } from './theme/themed-text';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

export interface AvatarProps {
  size?: AvatarSize;
  initials: string;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

/**
 * Componente Avatar simple con iniciales
 * Versión preparada para futura carga de imágenes
 */
export function Avatar({
  size = 'medium',
  initials,
  style,
  backgroundColor,
  textColor,
  fontSize
}: AvatarProps) {
  const defaultBackgroundColor = useThemeColor({}, 'tint');
  const defaultTextColor = useThemeColor({}, 'background');

  // Obtener dimensiones según el tamaño
  const dimensions = getSizeDimensions(size);
  
  // Colores: usar props o colores por defecto del tema
  const avatarBackgroundColor = backgroundColor || defaultBackgroundColor;
  const avatarTextColor = textColor || defaultTextColor;

  return (
    <ThemedView
      style={[
        styles.container,
        dimensions,
        { backgroundColor: avatarBackgroundColor },
        style
      ]}
    >
      <ThemedText
        style={[
          styles.initials,
          { fontSize: fontSize || dimensions.fontSize, color: avatarTextColor }
        ]}
        type="defaultSemiBold"
      >
        {initials}
      </ThemedText>
    </ThemedView>
  );
}

// Obtiene las dimensiones y estilos según el tamaño
function getSizeDimensions(size: AvatarSize) {
  const sizeConfig = {
    small: {
      width: 32,
      height: 32,
      fontSize: 12
    },
    medium: {
      width: 48,
      height: 48,
      fontSize: 16
    },
    large: {
      width: 64,
      height: 64,
      fontSize: 20
    },
    xlarge: {
      width: 80,
      height: 80,
      fontSize: 24
    },
    xxlarge: {
      width: 96,
      height: 96,
      fontSize: 28
    }
  };

  const config = sizeConfig[size];
  
  return {
    width: config.width,
    height: config.height,
    borderRadius: config.width / 2,
    fontSize: config.fontSize
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default Avatar;
