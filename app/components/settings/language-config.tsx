import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/language-context';

interface LanguageConfigSectionProps {
  inputLanguage: string;
  setInputLanguage: (value: string) => void;
  currentLanguage: string;
  handleUpdateLanguage: () => void;
  handleSaveLanguageLocally: () => void;
  isUpdatingLanguage: boolean;
}

const LANGUAGES = {
  'a': '🇺🇸 American English',
  'e': '🇪🇸 Spanish',
  'j': '🇯🇵 Japanese',
  'z': '🇨🇳 Chinese',
};

export default function LanguageConfigSection({
  inputLanguage,
  setInputLanguage,
  currentLanguage,
  handleUpdateLanguage,
  handleSaveLanguageLocally,
  isUpdatingLanguage,
}: LanguageConfigSectionProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const { t } = useLanguage();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <ThemedView style={[styles.section, { borderColor }]}>
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        {t('settings.language.title')}
      </ThemedText>
      <ThemedText
        style={styles.description}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        {t('settings.language.description')}
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
          lightColor="#000000"
          darkColor="#FFFFFF"
        >
          {t('settings.language.current')}
        </ThemedText>
        <ThemedText style={styles.currentLanguage}>
          {t(`languages.${currentLanguage}`, currentLanguage)}
        </ThemedText>
      </View>

      <View style={styles.dropdownContainer}>
        <ThemedText
          style={styles.label}
          lightColor="#000000"
          darkColor="#FFFFFF"
        >
          {t('settings.language.new')}
        </ThemedText>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[styles.dropdownButton, { borderColor: '#2ab0e1' }]}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <ThemedText style={[styles.dropdownButtonText, { color: 'black' }]}>
              {t(`languages.${inputLanguage}`, t('settings.language.select'))}
            </ThemedText>
            <ThemedText style={[styles.dropdownArrow, { color: 'black' }]}>
              {isDropdownOpen ? '▲' : '▼'}
            </ThemedText>
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={[styles.dropdownList, { borderColor: '#2ab0e1' }]}>
              {Object.keys(LANGUAGES).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setInputLanguage(key);
                    setIsDropdownOpen(false);
                  }}
                >
                  <ThemedText style={[styles.dropdownItemText, { color: 'black' }]}>
                    {t(`languages.${key}`)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.applyButton, { opacity: isUpdatingLanguage ? 0.5 : 1 }]}
          onPress={async () => {
            // Primero guardar localmente
            await handleSaveLanguageLocally();
            // Luego actualizar al backend
            await handleUpdateLanguage();
          }}
          disabled={isUpdatingLanguage}
        >
          <ThemedText
            style={styles.applyButtonText}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            {isUpdatingLanguage ? t('settings.language.applying') : t('settings.language.apply')}
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
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 50,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdownArrow: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
    elevation: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentLanguage: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 8,
    borderRadius: 6,
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
