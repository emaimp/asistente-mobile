import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { useLanguage } from '@/contexts/language-context';

interface HistoryDrawerProps {
  onLoginPress: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  onLoginPress,
}) => {
  const { t } = useLanguage();

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
