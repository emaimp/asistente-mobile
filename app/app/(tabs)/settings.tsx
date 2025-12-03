import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBackendConfig } from '@/hooks/use-backend-config';

export default function SettingsScreen() {
  const { backendUrl, saveBackendUrl, testConnection, isLoading } = useBackendConfig();
  const [inputUrl, setInputUrl] = useState(backendUrl);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Actualizar el input cuando cambie la URL guardada
  React.useEffect(() => {
    setInputUrl(backendUrl);
  }, [backendUrl]);

  const handleSave = async () => {
    if (!inputUrl.trim()) {
      Alert.alert('Error', 'Por favor ingresa una URL válida');
      return;
    }

    // Validación básica de URL
    try {
      new URL(inputUrl);
    } catch {
      Alert.alert('Error', 'La URL no tiene un formato válido');
      return;
    }

    const success = await saveBackendUrl(inputUrl.trim());
    if (success) {
      Alert.alert('Éxito', 'URL del backend guardada correctamente');
    } else {
      Alert.alert('Error', 'No se pudo guardar la URL');
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await testConnection(inputUrl.trim());
      Alert.alert(
        result.success ? 'Conexión Exitosa' : 'Error de Conexión',
        result.message
      );
    } catch {
      Alert.alert('Error', 'No se pudo probar la conexión');
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (isLoading) {
    return (
      <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
        <ThemedView style={styles.container}>
          <ThemedText>Cargando configuración...</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Servidor
          </ThemedText>
          <ThemedText style={styles.description}>
            Configura la dirección del servidor.
          </ThemedText>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>URL Actual:</ThemedText>
            <ThemedText style={styles.currentUrl}>{backendUrl}</ThemedText>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>URL Nueva:</ThemedText>
            <TextInput
              style={styles.textInput}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="Ej: http://192.168.1.100:8000"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={handleTestConnection}
              disabled={isTestingConnection}
            >
              <ThemedText style={styles.testButtonText}>
                {isTestingConnection ? 'Probando...' : 'Probar'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Instrucciones:
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            • Para desarrollo local, usa la IP de tu máquina.
            {'\n'}• Asegúrate que el servidor tenga el puerto 8000.
            {'\n'}• Prueba la conexión antes de usar la app.
            {'\n'}• La configuración se guarda automáticamente.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    backgroundColor: 'rgba(16, 16, 49, 0.80)',
  },
  sectionTitle: {
    color: 'white',
    marginBottom: 12,
  },
  description: {
    color: 'white',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentUrl: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#34C759',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionText: {
    color: 'white',
    lineHeight: 22,
    fontSize: 14,
  },
});
