import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/ui/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useGender } from '@/contexts/gender-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { messages } = useConversation();
  const { currentGender } = useGender();
  const botMessageCount = messages.filter(message => message.type === 'bot').length;

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors.gender[currentGender][colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.gender[currentGender][colorScheme ?? 'light'].tabBackground,
          overflow: 'visible',
        },
      }}>
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
          tabBarBadge: botMessageCount > 0 ? botMessageCount.toString() : undefined,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bot',
          tabBarIcon: ({ color }) => (
            <View style={styles.container}>
              <View style={[styles.button, { backgroundColor: color }]}>
                <IconSymbol size={24} name="bot" color="white" />
              </View>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="settings" color={color} />,
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
    left: '-50%',
    width: 55,
    height: 55,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
