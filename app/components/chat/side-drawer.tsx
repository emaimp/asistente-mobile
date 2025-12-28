import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ui/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import LoginModal from '@/components/session/login-modal';

export interface SideDrawerRef {
  open: () => void;
  close: () => void;
}

interface SideDrawerProps {
  backgroundColor: string;
  backgroundAltColor: string;
  textColor: string;
}

const SideDrawer = forwardRef<SideDrawerRef, SideDrawerProps>(({ backgroundColor, backgroundAltColor, textColor }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const translateX = useSharedValue(-250);

  // Colores dinámicos
  const tintColor = useThemeColor({}, 'tint');
  const { t } = useLanguage();

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      translateX.value = withTiming(0, { duration: 300 });
    },
    close: () => {
      translateX.value = withTiming(-250, { duration: 300 });
      setTimeout(() => setIsOpen(false), 300);
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
      <Animated.View style={[styles.drawer, drawerAnimatedStyle, { backgroundColor: backgroundAltColor }]}>
        <View style={styles.avatarContainer}>
          <IconSymbol name="person.circle.fill" size={120} color={textColor} />
          <ThemedText style={styles.emailText}>usuario@example.com</ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: tintColor }]}
          onPress={() => setLoginModalVisible(true)}
        >
          <ThemedText style={styles.loginButtonText}>{t('login.title')}</ThemedText>
        </TouchableOpacity>
      </Animated.View>
      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
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
    width: 250,
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
  avatarContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  emailText: {
    fontSize: 14,
    marginTop: 10,
    opacity: 0.7,
  },
  loginButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
