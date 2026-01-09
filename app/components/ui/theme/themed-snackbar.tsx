import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { ThemedText } from './themed-text';

export interface ThemedSnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info';
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function ThemedSnackbar({
  visible,
  onDismiss,
  message,
  duration = 10000,
  type = 'info',
  action
}: ThemedSnackbarProps) {
  const greenAltColor = useThemeColor({}, 'greenAlt');
  const redAltColor = useThemeColor({}, 'redAlt');
  const tabBackgroundColor = useThemeColor({}, 'tabBackground');

  const backgroundColor =
    type === 'success' ? greenAltColor :
    type === 'error' ? redAltColor :
    tabBackgroundColor;

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={{ backgroundColor, zIndex: 2000 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ThemedText
          style={{ flex: 1, textAlign: 'center' }}
          lightColor="#ffffff"
          darkColor="#ffffff"
        >
          {message}
        </ThemedText>
        <TouchableOpacity onPress={onDismiss} style={{ padding: 8 }}>
          <ThemedText
            lightColor="#ffffff"
            darkColor="#ffffff"
            style={{ fontSize: 18, fontWeight: 'bold' }}
          >
            ✕
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Snackbar>
  );
}

export default ThemedSnackbar;
