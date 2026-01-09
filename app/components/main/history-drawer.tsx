import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';

interface HistoryDrawerProps {
  onLoginPress: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  onLoginPress,
}) => {
  const { t } = useLanguage();
  const { user, isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.drawerContent}>
        <ThemedText style={styles.drawerText}>
          {t('common.loading')}
        </ThemedText>
      </View>
    );
  }

  if (isLoggedIn && user) {
    // Obtener iniciales del username (primera letra en mayúscula)
    const initials = user.username.charAt(0).toUpperCase();

    return (
      <View style={styles.drawerContent}>
        <View style={styles.userSection}>
          <Avatar
            size="xlarge"
            initials={initials}
            style={styles.avatar}
          />
          <View style={styles.userStatus}>
            <View style={[styles.statusIndicator, { backgroundColor: user.is_active ? '#4CAF50' : '#FFC107' }]} />
            <ThemedText style={styles.statusText}>
              {user.is_active ? 'Activo' : 'Inactivo'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.historySection}>
          <ThemedText style={styles.historyPlaceholder}>
            Sin historial
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.drawerContent}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
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
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    marginBottom: 12,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    opacity: 0.7,
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
});

export default HistoryDrawer;
