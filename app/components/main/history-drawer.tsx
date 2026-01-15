import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon/icon-symbol';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';

interface HistoryDrawerProps {
  onLoginPress: () => void;
  onUserPress?: () => void;
  onSettingsPress?: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  onLoginPress,
  onUserPress,
  onSettingsPress,
}) => {
  const { t } = useLanguage();
  const { user, isLoggedIn, isLoading } = useAuth();
  const greenAlt = useThemeColor({}, 'greenAlt');
  const yellowAlt = useThemeColor({}, 'yellowAlt');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  // Obtener iniciales del username (primera letra en mayúscula)
  const initials = user?.username ? user.username.charAt(0).toUpperCase() : '';

  return (
    <View style={styles.drawerContent}>
      {/* Contenido condicional basado en estado de autenticación */}
      {isLoading && (
        <ThemedText style={styles.drawerText}>
          {t('common.loading')}
        </ThemedText>
      )}

      {isLoggedIn && user && (
        <>
          <TouchableOpacity style={[styles.userSection, { borderColor: borderColor + '10' }]} onPress={onUserPress}>
            <View style={styles.avatarContainer}>
              <Avatar
                size="medium"
                initials={initials}
              />
              <View style={[styles.statusDot, { backgroundColor: user.is_active ? greenAlt : yellowAlt, borderColor: backgroundColor }]} />
            </View>
            <ThemedText style={styles.username}>
              {user.username}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.historySection}>
            <ThemedText style={styles.historyPlaceholder}>
              Sin historial
            </ThemedText>
          </View>
        </>
      )}

      {!isLoggedIn && !isLoading && (
        <ThemedText style={styles.drawerText}>
          {t('history.loginToView')}{' '}
          <ThemedText
            style={styles.drawerLink}
            type="link"
            onPress={onLoginPress}
          >
            {t('history.access')}
          </ThemedText>
        </ThemedText>
      )}

      {/* settings */}
      {onSettingsPress && (
        <TouchableOpacity style={[styles.settingsSection, { borderColor: borderColor + '10' }]} onPress={onSettingsPress}>
          <IconSymbol name="settings.fill" size={24} color={iconColor} />
          <ThemedText style={styles.settingsText}>
            Configuración
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 0,
  },
  avatarContainer: {
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 6,
  },
  username: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  historySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyPlaceholder: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  settingsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 0,
    marginTop: 'auto',
    marginBottom: 20,
  },
  settingsText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryDrawer;
