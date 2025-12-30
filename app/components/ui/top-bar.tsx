import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

/*
 * Barra superior básica y flexible.
 * Contenedor simple sin elementos predefinidos.
 */
interface TopBarProps {
  leftElement?: React.ReactNode;
  centerElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  height?: number;
  backgroundColor?: string;
  borderBottomColor?: string;
}

export function TopBar({
  leftElement,
  centerElement,
  rightElement,
  height = 95,
  borderBottomColor,
  backgroundColor = 'transparent'
}: TopBarProps) {
  return (
    <View style={[
      styles.topBar,
      {
        height,
        backgroundColor,
        borderBottomColor,
        borderBottomWidth: borderBottomColor ? 1 : 0,
      }
    ]}>
      <View style={styles.leftContainer}>
        {leftElement}
      </View>
      <View style={styles.centerContainer}>
        {centerElement}
      </View>
      <View style={styles.rightContainer}>
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 24,
    zIndex: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
