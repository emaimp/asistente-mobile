import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/language-context';

interface AIModelConfigSectionProps {
  inputModel: string;
  setInputModel: (value: string) => void;
  model: string;
  handleUpdateModel: () => void;
  handleSaveModelLocally: () => void;
  isUpdatingModel: boolean;
}

export default function AIModelConfigSection({
  inputModel,
  setInputModel,
  model,
  handleUpdateModel,
  handleSaveModelLocally,
  isUpdatingModel,
}: AIModelConfigSectionProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const { t } = useLanguage();

  return (
    <ThemedView style={[styles.section, { borderColor }]}>
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        {t('settings.model.title')}
      </ThemedText>
      <ThemedText
        style={styles.description}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        {t('settings.model.description')}
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
          lightColor="#000000"
          darkColor="#FFFFFF"
        >
          {t('settings.model.current')}
        </ThemedText>
        <ThemedText style={styles.currentUrl}>{model}</ThemedText>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
          lightColor="#000000"
          darkColor="#FFFFFF"
        >
          {t('settings.model.new')}
        </ThemedText>
        <TextInput
          style={[styles.textInput, { color: 'black' }]}
          value={inputModel}
          onChangeText={setInputModel}
          placeholder={t('settings.model.placeholder')}
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.applyButton, { opacity: isUpdatingModel ? 0.5 : 1 }]}
          onPress={async () => {
            // Primero guardar localmente
            await handleSaveModelLocally();
            // Luego actualizar al backend
            await handleUpdateModel();
          }}
          disabled={isUpdatingModel}
        >
          <ThemedText
            style={styles.applyButtonText}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            {isUpdatingModel ? t('settings.model.applying') : t('settings.model.apply')}
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
    marginTop: 16,
  },
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  applyButton: {
    backgroundColor: '#2ab0e1',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
