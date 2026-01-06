import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedTextInput } from '@/components/ui/themed-textinput';
import { ThemedButton } from '@/components/ui/themed-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useLanguage } from '@/contexts/language-context';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal = ({ visible, onClose }: LoginModalProps) => {
  const textColor = useThemeColor({}, 'text'); // IconSymbol
  const backgroundAltColor = useThemeColor({}, 'backgroundAlt'); // ThemedView
  const successPrimary = useThemeColor({}, 'successPrimary'); // Snackbar
  const errorPrimary = useThemeColor({}, 'errorPrimary'); // Snackbar

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      // Simula login exitoso si email y password no están vacíos
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

  const handleForgotPassword = () => {
    // Placeholder - sin funcionalidad implementada
    console.log('Forgot password clicked');
  };

  const handleRegister = () => {
    // Placeholder - sin funcionalidad implementada
    console.log('Register clicked');
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
              Iniciar Sesión
            </ThemedText>

            {/* Campo de Email */}
            <View style={styles.inputContainer}>
              <ThemedTextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Correo electrónico"
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
                  placeholder="Contraseña"
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
              
              {/* Enlace "¿Olvidaste tu contraseña?" */}
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <ThemedText type="link">
                    ¿Olvidaste tu contraseña?
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Principal */}
            <ThemedButton
              style={styles.mainButton}
              onPress={handleLogin}
              disabled={isLoggingIn}
            >
              <ThemedText style={styles.buttonText}>
                {isLoggingIn ? 'Iniciando...' : 'Iniciar Sesión'}
              </ThemedText>
            </ThemedButton>

            {/* Enlace "Registrarse" */}
            <View style={styles.registerContainer}>
              <ThemedText style={styles.registerText}>
                ¿No tienes cuenta?{' '}
              </ThemedText>
              <TouchableOpacity onPress={handleRegister}>
                <ThemedText type="link" style={styles.registerText}>
                  Registrarse
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
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
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default LoginModal;
