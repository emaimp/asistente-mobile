import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/ui/haptic-tab';
import { IconSymbol } from '@/components/ui/icon/icon-symbol';
import { useThemeColor } from '@/hooks/theme/use-theme-color';

export default function TabLayout() {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const tabIconSelected = useThemeColor({}, 'tabIconSelected');

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: tabIconSelected,
          overflow: 'visible',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index',
          tabBarIcon: ({ color }) => (
            <View style={styles.container}>
              <View style={[styles.button, { backgroundColor: color }]}>
                <IconSymbol size={24} name="bot.fill" color={iconColor} />
              </View>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    top: -15,
    left: '50%',
    transform: [{ translateX: -27.5 }],
    width: '180%',
    height: 55,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
