import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ui/theme/themed-view';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { ThemedTextInput } from '@/components/ui/theme/themed-textinput';
import { ThemedButton } from '@/components/ui/theme/themed-button';
import { ThemedSnackbar } from '@/components/ui/theme/themed-snackbar';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import { useBackendUrlConfig } from '@/hooks/api/settings/use-backend-url-config';

interface InitialModalProps {
  visible: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'initial-modal-dismissed';

export default function InitialModal({ visible, onClose }: InitialModalProps) {
  const tintColor = useThemeColor({}, 'tint'); // Checkbox border
  const tabBackgroundColor = useThemeColor({}, 'tabBackground'); // ThemedView

  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const { backendUrl, saveBackendUrl, testConnection } = useBackendUrlConfig();
  const { t } = useLanguage();

  useEffect(() => {
    if (visible && backendUrl) {
      setInputUrl(backendUrl);
    }
  }, [visible, backendUrl]);

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const result = await testConnection(inputUrl);
      if (result.success) {
        await saveBackendUrl(inputUrl);
        if (dontShowAgain) {
          await AsyncStorage.setItem(STORAGE_KEY, 'true');
        }
        setSnackbarType('success');
        setSnackbarMessage(t('modal.success'));
        setSnackbarVisible(true);
      } else {
        setSnackbarType('error');
        setSnackbarMessage(t('modal.error'));
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error connecting:', error);
      setSnackbarType('error');
      setSnackbarMessage(t('modal.error'));
      setSnackbarVisible(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleOverlayPress = () => {
    onClose();
  };

  const toggleDontShowAgain = () => {
    setDontShowAgain(!dontShowAgain);
  };

  return (
    <>
      {visible && (
        <View style={styles.overlay}>
          {/* Overlay visual */}
          <View style={styles.overlayBackground} />
          
          {/* Overlay clickeable para cerrar */}
          <TouchableOpacity 
            style={styles.overlayTouchable}
            onPress={handleOverlayPress}
            activeOpacity={1}
          />
          
          {/* Modal */}
          <ThemedView 
            style={[styles.modalContainer, { backgroundColor: tabBackgroundColor }]}
          >
            <ThemedText style={styles.title}>
              {t('modal.title')}
            </ThemedText>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>
                {t('modal.url')}
              </ThemedText>
              <ThemedTextInput
                style={styles.textInput}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder={t('modal.placeholder')}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            <TouchableOpacity style={styles.checkboxContainer} onPress={toggleDontShowAgain}>
              <View style={[styles.checkbox, { borderColor: tintColor }, dontShowAgain && { backgroundColor: tintColor }]}>
                {dontShowAgain && <ThemedText style={styles.checkmark}>✓</ThemedText>}
              </View>
              <ThemedText style={styles.checkboxText}>
                {t('modal.dontShowAgain')}
              </ThemedText>
            </TouchableOpacity>

            {/* Botón "Conectar" */}
            <ThemedButton
              style={styles.mainButton}
              onPress={handleConnect}
              disabled={isConnecting}
            >
              <ThemedText style={styles.buttonText}>
                {isConnecting ? t('modal.connecting') : t('modal.connect')}
              </ThemedText>
            </ThemedButton>
          </ThemedView>
        </View>
      )}
      <ThemedSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        type={snackbarType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '80%',
    maxWidth: 380,
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  mainButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    fontSize: 16,
    width: '100%',
  },
});
