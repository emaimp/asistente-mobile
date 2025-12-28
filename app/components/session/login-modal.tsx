import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/contexts/language-context';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal = ({ visible, onClose }: LoginModalProps) => {
  // Colores dinámicos basados en género
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const backgroundAltColor = useThemeColor({}, 'backgroundAlt');
  const tabIconSelected = useThemeColor({}, 'tabIconSelected');
  const successPrimary = useThemeColor({}, 'successPrimary');
  const errorPrimary = useThemeColor({}, 'errorPrimary');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      // Implementar lógica de login real
      // Por ahora, simular login exitoso si email y password no están vacíos
      if (email.trim() && password.trim()) {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSnackbarType('success');
        setSnackbarMessage(t('login.loginSuccess'));
        setSnackbarVisible(true);
        // onLoginSuccess(); // Callback para actualizar estado global
        onClose();
      } else {
        setSnackbarType('error');
        setSnackbarMessage(t('login.loginError'));
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setSnackbarType('error');
      setSnackbarMessage(t('login.loginError'));
      setSnackbarVisible(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {visible && (
        <View style={styles.overlay}>
          <ThemedView style={[styles.modalContainer, { borderColor: textColor, backgroundColor: backgroundAltColor }]}>
            <Text style={[styles.title, { color: textColor }]}>
              {t('login.title')}
            </Text>

            <View style={styles.inputContainer}>
              <ThemedText
                style={styles.label}
              >
                {t('login.email')}
              </ThemedText>
              <TextInput
                style={[styles.textInput, { color: textColor, borderColor: tintColor, backgroundColor: backgroundColor + '1A' }]}
                value={email}
                onChangeText={setEmail}
                placeholder={t('login.emailPlaceholder')}
                placeholderTextColor={textColor + '66'}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText
                style={styles.label}
              >
                {t('login.password')}
              </ThemedText>
              <TextInput
                style={[styles.textInput, { color: textColor, borderColor: tintColor, backgroundColor: backgroundColor + '1A' }]}
                value={password}
                onChangeText={setPassword}
                placeholder={t('login.passwordPlaceholder')}
                placeholderTextColor={textColor + '66'}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: tintColor,
                    shadowColor: tabIconSelected,
                    opacity: isLoggingIn ? 0.5 : 1
                  }
                ]}
                onPress={handleLogin}
                disabled={isLoggingIn}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>
                  {t('login.button')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: errorPrimary,
                    shadowColor: tabIconSelected
                  }
                ]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>
                  {t('login.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      )}
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
    </>
  );
};

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
  modalContainer: {
    width: '80%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 6,
    borderWidth: 1,
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
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 0,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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

export default LoginModal;
