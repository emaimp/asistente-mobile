import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { forwardRef, useImperativeHandle, useState, PropsWithChildren } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/theme/use-theme-color';

export interface SideDrawerRef {
  open: () => void;
  close: () => void;
}

interface SideDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  width?: number;
  backgroundColor?: string;
}

/**
 * Panel lateral básico con animación.
 * Contenedor simple sin contenido predefinido.
 */
const SideDrawer = forwardRef<SideDrawerRef, PropsWithChildren<SideDrawerProps>>(({
  children,
  isOpen: controlledIsOpen,
  onClose,
  width = 250,
  backgroundColor
}, ref) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const translateX = useSharedValue(-width);
  const borderColor = useThemeColor({}, 'border');
  const defaultBackgroundColor = useThemeColor({}, 'tabBackground');

  // Usar estado controlado si se proporciona, sino estado interno
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useImperativeHandle(ref, () => ({
    open: () => {
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(true);
      }
      translateX.value = withTiming(0, { duration: 300 });
    },
    close: () => {
      translateX.value = withTiming(-width, { duration: 300 });
      if (controlledIsOpen === undefined) {
        setTimeout(() => setInternalIsOpen(false), 300);
      }
      onClose?.();
    },
  }));

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleOverlayPress = () => {
    (ref as React.RefObject<SideDrawerRef>)?.current?.close();
  };

  if (!isOpen) return null;

  return (
    <>
      <TouchableOpacity style={styles.overlay} onPress={handleOverlayPress} />
      <Animated.View style={[
        styles.drawer,
        drawerAnimatedStyle,
        { width, backgroundColor: backgroundColor || defaultBackgroundColor, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: borderColor + '10' }
      ]}>
        {children}
      </Animated.View>
    </>
  );
});

SideDrawer.displayName = 'SideDrawer';

export default SideDrawer;

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 30,
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
});
