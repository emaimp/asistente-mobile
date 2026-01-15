import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { ThemedView } from '@/components/ui/theme/themed-view';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { Avatar } from '@/components/ui/avatar';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useGender } from '@/contexts/gender-context';
import { useColorScheme } from '@/hooks/theme/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';
import { Colors } from '@/constants/theme';

export default function AccountView() {
  const { user, logout } = useAuth();
  const gender = useGender().currentGender;
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const greenAlt = useThemeColor({}, 'greenAlt');
  const yellowAlt = useThemeColor({}, 'yellowAlt');
  const redAlt = useThemeColor({}, 'redAlt');

  if (!user) {
    return null;
  }

  const initials = user.username.charAt(0).toUpperCase();

  return (
    <ThemedView style={styles.container}>
      <BackgroundPattern gender={gender} colorScheme={colorScheme as 'light' | 'dark'} />
      <View style={[StyleSheet.absoluteFillObject, {backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabBackground, zIndex: -2}]} />

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar size="xxlarge" initials={initials} />
            <View style={[styles.statusDot, {
              backgroundColor: user.is_active ? greenAlt : yellowAlt, borderColor: backgroundColor
            }]} />
          </View>
          <ThemedText style={styles.email}>{user.email}</ThemedText>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.option}>
            <ThemedText style={styles.optionText}>Editar Perfil</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <ThemedText style={styles.optionText}>Privacidad</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: redAlt }]}
          onPress={logout}
        >
          <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 95,
    paddingBottom: 45,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 12,
  },
  optionsSection: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
