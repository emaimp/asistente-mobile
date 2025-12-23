import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBackendUrlConfig } from '@/hooks/api-settings/use-backend-url-config';
import { useLanguage } from '@/contexts/language-context';

interface InitialModalProps {
  visible: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'initial-modal-dismissed';

export default function InitialModal({ visible, onClose }: InitialModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const colorScheme = useColorScheme();
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
        <ThemedView style={styles.modalContainer} lightColor="#FFFFFF" darkColor="#1C1C1E">
          <Text style={[styles.title, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
            {t('modal.title')}
          </Text>

          <View style={styles.inputContainer}>
            <ThemedText
              style={styles.label}
              lightColor="#000000"
              darkColor="#FFFFFF"
            >
              {t('modal.url')}
            </ThemedText>
            <TextInput
              style={[styles.textInput, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder={t('modal.placeholder')}
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>

          <TouchableOpacity style={styles.checkboxContainer} onPress={toggleDontShowAgain}>
            <View style={[styles.checkbox, dontShowAgain && styles.checkboxChecked]}>
              {dontShowAgain && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkboxText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
              {t('modal.dontShowAgain')}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [styles.button, styles.acceptButton, { opacity: isConnected ? 0.5 : 1 }, pressed && styles.pressedBlue]}
              onPress={handleConnect}
              disabled={isConnected}
            >
              <Text style={styles.acceptButtonText}>
                {t('modal.connect')}
              </Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.button, styles.closeButton, pressed && styles.pressed]} onPress={handleCancel}>
              <Text style={styles.closeButtonText}>{t('modal.close')}</Text>
            </Pressable>
          </View>
        </ThemedView>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarType === 'success' ? '#2eb733' : '#e00023' }}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2ab0e1',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#2ab0e1',
  },
  checkboxText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#2ab0e1',
    borderBottomWidth: 4,
    borderBottomColor: '#105293',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ff4638',
    borderBottomWidth: 4,
    borderBottomColor: '#b81414',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    borderBottomWidth: 2,
    borderBottomColor: '#b81414',
  },
  pressedBlue: {
    transform: [{ scale: 0.95 }],
    borderBottomWidth: 2,
    borderBottomColor: '#105293',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#2ab0e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
