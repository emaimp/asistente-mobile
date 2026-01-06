import React from 'react';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { ThemedText } from './themed-text';

export interface ThemedButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

/**
 * Componente Button con tema automático
 * Centraliza los colores de los botones en la app
 */
export function ThemedButton({ 
  children, 
  style,
  disabled,
  ...otherProps 
}: ThemedButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const tabIconSelected = useThemeColor({}, 'tabIconSelected');

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: tintColor,
          shadowColor: tabIconSelected,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      disabled={disabled}
      {...otherProps}
    >
      {typeof children === 'string' ? (
        <ThemedText
          style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}
          type="defaultSemiBold"
        >
          {children}
        </ThemedText>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export default ThemedButton;
