import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/theme/use-theme-color';

export type ThemedTextInputProps = TextInputProps;

/**
 * Componente TextInput con tema automático
 * Centraliza los colores de los inputs en la app
 */
export function ThemedTextInput({ style, ...otherProps }: ThemedTextInputProps) {
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <TextInput
      style={[
        {
          color: textColor,
          borderColor: tintColor,
          backgroundColor: backgroundColor + '1A',
        },
        style
      ]}
      placeholderTextColor={textColor + '66'}
      {...otherProps}
    />
  );
}

export default ThemedTextInput;
