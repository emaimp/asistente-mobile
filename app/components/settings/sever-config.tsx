import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <ThemedView style={[styles.section, { borderColor }]}>
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        Servidor
      </ThemedText>
      <ThemedText
        style={styles.description}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        Configura la dirección del servidor.
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
          lightColor="#000000"
          darkColor="#FFFFFF"
        >
          URL Actual:
        </ThemedText>
        <ThemedText style={styles.currentUrl}>{backendUrl}</ThemedText>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
          lightColor="#000000"
          darkColor="#FFFFFF"
        >
          URL Nueva:
        </ThemedText>
        <TextInput
          style={[styles.textInput, { color: 'black' }]}
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
          <ThemedText
            style={styles.testButtonText}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            {isTestingConnection ? 'Probando...' : 'Probar'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <ThemedText
            style={styles.saveButtonText}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            Guardar
          </ThemedText>
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
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentUrl: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 8,
    borderRadius: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#2ab0e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#2ab0e1',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#2ab0e1',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
