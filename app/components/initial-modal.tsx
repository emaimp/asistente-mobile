import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useBackendUrlConfig } from '@/hooks/api-settings/use-backend-url-config';
import { useLanguage } from '@/contexts/language-context';

interface InitialModalProps {
  visible: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'initial-modal-dismissed';

export default function InitialModal({ visible, onClose }: InitialModalProps) {
  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const successPrimary = useThemeColor({}, 'successPrimary');
  const errorPrimary = useThemeColor({}, 'errorPrimary');

  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
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
        setIsConnected(true);
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

  const handleCancel = () => {
    onClose();
  };

  const toggleDontShowAgain = () => {
    setDontShowAgain(!dontShowAgain);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modalContainer}>
          <Text style={[styles.title, { color: textColor }]}>
            {t('modal.title')}
          </Text>

          <View style={styles.inputContainer}>
            <ThemedText
              style={styles.label}
            >
              {t('modal.url')}
            </ThemedText>
            <TextInput
              style={[styles.textInput, { color: textColor, borderColor: tintColor, backgroundColor: backgroundColor + '1A' }]}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder={t('modal.placeholder')}
              placeholderTextColor={textColor + '66'}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>

          <TouchableOpacity style={styles.checkboxContainer} onPress={toggleDontShowAgain}>
            <View style={[styles.checkbox, { borderColor: tintColor }, dontShowAgain && { backgroundColor: tintColor }]}>
              {dontShowAgain && <Text style={[styles.checkmark, { color: textColor }]}>✓</Text>}
            </View>
            <Text style={[styles.checkboxText, { color: textColor }]}>
              {t('modal.dontShowAgain')}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: tintColor,
                  borderColor: textColor,
                  opacity: isConnected ? 0.5 : 1
                }
              ]}
              onPress={handleConnect}
              disabled={isConnected}
            >
              <Text style={[styles.buttonText, { color: textColor }]}>
                {t('modal.connect')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: errorPrimary,
                  borderColor: textColor
                }
              ]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, { color: textColor }]}>
                {t('modal.close')}
              </Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarType === 'success' ? successPrimary : errorPrimary }}
      >
        <Text style={{ textAlign: 'center', color: 'white' }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 300,
    padding: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
