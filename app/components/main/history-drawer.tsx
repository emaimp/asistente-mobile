import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HistoryDrawerProps {
  onLoginPress: () => void;
  tintColor: string;
  textColor: string;
  backgroundAltColor: string;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  onLoginPress,
  tintColor,
  textColor,
  backgroundAltColor,
}) => {
  return (
    <View style={[styles.drawerContent, { backgroundColor: backgroundAltColor }]}>
      <Text style={[styles.drawerText, { color: textColor }]}>
        Inicia sesión para ver el historial.{' '}
        <Text 
          style={[styles.drawerLink, { color: tintColor }]}
          onPress={onLoginPress}
        >
          Acceder
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  drawerText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  drawerLink: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default HistoryDrawer;
