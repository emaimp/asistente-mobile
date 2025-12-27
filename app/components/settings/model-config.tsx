import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/contexts/language-context';

interface AIModelConfigSectionProps {
  inputModel: string;
  setInputModel: (value: string) => void;
  model: string;
}

export default function AIModelConfigSection({
  inputModel,
  setInputModel,
  model,
}: AIModelConfigSectionProps) {
  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const { t } = useLanguage();

  return (
    <ThemedView style={[styles.section, { borderColor: textColor }]}>
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
      >
        {t('settings.model.title')}
      </ThemedText>
      <ThemedText
        style={styles.description}
      >
        {t('settings.model.description')}
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
        >
          {t('settings.model.current')}
        </ThemedText>
        <ThemedText style={[styles.currentUrl, { color: textColor, backgroundColor: textColor + '20' }]}>
          {model}
        </ThemedText>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
        >
          {t('settings.model.new')}
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              color: textColor,
              borderColor: tintColor,
              backgroundColor: backgroundColor + 'E6'
            }
          ]}
          value={inputModel}
          onChangeText={setInputModel}
          placeholder={t('settings.model.placeholder')}
          placeholderTextColor={textColor + '66'}
          autoCapitalize="none"
          autoCorrect={false}
        />
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentUrl: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 8,
    borderRadius: 6,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
