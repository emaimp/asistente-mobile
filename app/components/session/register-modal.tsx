import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { ThemedView } from '@/components/ui/theme/themed-view';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { ThemedTextInput } from '@/components/ui/theme/themed-textinput';
import { ThemedButton } from '@/components/ui/theme/themed-button';
import { IconSymbol } from '@/components/ui/icon/icon-symbol';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import { apiService } from '@/services/api';

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: (token: string) => void;
}

const RegisterModal = ({ visible, onClose, onSwitchToLogin, onRegisterSuccess }: RegisterModalProps) => {
  const textColor = useThemeColor({}, 'text'); // IconSymbol
  const backgroundAltColor = useThemeColor({}, 'backgroundAlt'); // ThemedView
  const successPrimary = useThemeColor({}, 'successPrimary'); // Snackbar
  const errorPrimary = useThemeColor({}, 'errorPrimary'); // Snackbar

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const { t } = useLanguage();

  const handleRegister = async () => {
    if (isRegistering) return;
    setIsRegistering(true);
    try {
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setSnackbarType('error');
        setSnackbarMessage(t('register.registerError'));
        setSnackbarVisible(true);
        return;
      }

      if (password !== confirmPassword) {
        setSnackbarType('error');
        setSnackbarMessage(t('register.passwordMismatch'));
        setSnackbarVisible(true);
        return;
      }

      const response = await apiService.register({
        username: name.trim(),
        email: email.trim(),
        password: password,
      });

      setSnackbarType('success');
      setSnackbarMessage(t('register.registerSuccess'));
      setSnackbarVisible(true);

      // Guardar token para mantener sesión
      if (onRegisterSuccess) {
        onRegisterSuccess(response.access_token);
      }

      onClose();
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error instanceof Error ? error.message : t('register.registerError');
      setSnackbarType('error');
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleOverlayPress = () => {
    onClose();
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
            style={[styles.modalContainer, { backgroundColor: backgroundAltColor }]}
          >
            {/* Título */}
            <ThemedText style={styles.title}>
              {t('register.title')}
            </ThemedText>

            {/* Campo de Nombre */}
            <View style={styles.inputContainer}>
              <ThemedTextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder={t('register.namePlaceholder')}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Campo de Email */}
            <View style={styles.inputContainer}>
              <ThemedTextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder={t('register.emailPlaceholder')}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            {/* Campo de Password */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <ThemedTextInput
                  style={[styles.textInput, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('register.passwordPlaceholder')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <IconSymbol
                    name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                    size={20}
                    color={textColor + '80'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Campo de Confirmar Password */}
            <View style={styles.inputContainer}>
              <ThemedTextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('register.confirmPasswordPlaceholder')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Botón Principal */}
            <ThemedButton
              style={styles.mainButton}
              onPress={handleRegister}
              disabled={isRegistering}
            >
              <ThemedText style={styles.buttonText}>
                {isRegistering ? t('register.registering') : t('register.button')}
              </ThemedText>
            </ThemedButton>

            {/* Enlace "Iniciar Sesión" */}
            <View style={styles.loginContainer}>
              <ThemedText style={styles.loginText}>
                {t('register.haveAccount')}{' '}
              </ThemedText>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <ThemedText type="link" style={styles.loginText}>
                  {t('register.login')}
                </ThemedText>
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
        <ThemedText style={{ textAlign: 'center' }}>
          {snackbarMessage}
        </ThemedText>
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
    width: '85%',
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
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
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
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
    padding: 4,
  },
  mainButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RegisterModal;