import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface ServerConfigSectionProps {
  inputUrl: string;
  setInputUrl: (value: string) => void;
  backendUrl: string;
  handleSave: () => void;
  handleTestConnection: () => void;
  isTestingConnection: boolean;
}

export default function ServerConfigSection({
  inputUrl,
  setInputUrl,
  backendUrl,
  handleSave,
  handleTestConnection,
  isTestingConnection,
}: ServerConfigSectionProps) {
  return (
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
          placeholder="Ej: http://192.168.100.1:8000"
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
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#FF9500',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  updateButton: {
    backgroundColor: '#34C759',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
