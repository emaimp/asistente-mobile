import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { ThemedView } from '@/components/ui/theme/themed-view';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useLanguage } from '@/contexts/language-context';

interface LanguageConfigSectionProps {
  inputLanguage: string;
  setInputLanguage: (value: string) => void;
  currentLanguage: string;
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
}: LanguageConfigSectionProps) {
  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const { t } = useLanguage();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <ThemedView style={[styles.section, { borderColor: textColor, backgroundColor: 'transparent' }]}>
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
      >
        {t('settings.language.title')}
      </ThemedText>
      <ThemedText
        style={styles.description}
      >
        {t('settings.language.description')}
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
        >
          {t('settings.language.current')}
        </ThemedText>
        <ThemedText style={[styles.currentLanguage, { color: textColor, backgroundColor: textColor + '20' }]}>
          {t(`languages.${currentLanguage}`, currentLanguage)}
        </ThemedText>
      </View>

      <View style={styles.dropdownContainer}>
        <ThemedText
          style={styles.label}
        >
          {t('settings.language.new')}
        </ThemedText>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[styles.dropdownButton, { borderColor: tintColor, backgroundColor: backgroundColor + 'E6' }]}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <ThemedText style={[styles.dropdownButtonText, { color: textColor }]}>
              {t(`languages.${inputLanguage}`, t('settings.language.select'))}
            </ThemedText>
            <ThemedText style={[styles.dropdownArrow, { color: textColor }]}>
              {isDropdownOpen ? '▲' : '▼'}
            </ThemedText>
          </TouchableOpacity>
          {isDropdownOpen && (
          <View style={[styles.dropdownList, { borderColor: tintColor, backgroundColor: backgroundColor + 'FF' }]}>
              {Object.keys(LANGUAGES).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.dropdownItem, { borderBottomColor: textColor + '19' }]}
                  onPress={() => {
                    setInputLanguage(key);
                    setIsDropdownOpen(false);
                  }}
                >
                  <ThemedText style={[styles.dropdownItemText, { color: textColor }]}>
                    {t(`languages.${key}`)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 0,
    padding: 16,
    borderWidth: 0,
    borderRadius: 0,
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
    zIndex: 1000,
    elevation: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
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
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 8,
    borderRadius: 6,
  },
});
