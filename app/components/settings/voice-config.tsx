import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { ThemedView } from '@/components/ui/theme/themed-view';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import { useGender } from '@/contexts/gender-context';

interface VoiceConfigSectionProps {
  inputVoice: string;
  setInputVoice: (value: string) => void;
  currentVoice: string;
}

const VOICES = {
  English: {
    Woman: ['af_heart', 'af_alloy', 'af_bella', 'af_jessica', 'af_nicole', 'af_sarah'],
    Man: ['am_adam', 'am_echo', 'am_eric', 'am_fenrir', 'am_liam', 'am_michael'],
  },
  Chinese: {
    Woman: ['zf_xiaobei', 'zf_xiaoni'],
    Man: ['zm_yunjian', 'zm_yunxi'],
  },
  Japanese: {
    Woman: ['jf_alpha', 'jf_nezumi'],
    Man: ['jm_kumo'],
  },
  Spanish: {
    Woman: ['ef_dora'],
    Man: ['em_alex'],
  },
};

export default function VoiceConfigSection({
  inputVoice,
  setInputVoice,
  currentVoice,
}: VoiceConfigSectionProps) {
  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const { t } = useLanguage();
  const { currentGender, setGender } = useGender();

  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const availableVoices = VOICES[selectedLanguage as keyof typeof VOICES][currentGender as keyof typeof VOICES[keyof typeof VOICES]];

  useEffect(() => {
    // Actualizar inputVoice a la primera voz disponible cuando cambia el idioma o el género
    setInputVoice(availableVoices[0] || '');
  }, [availableVoices, setInputVoice]);

  return (
    <ThemedView style={[styles.section, { borderColor: textColor, backgroundColor: 'transparent' }]}>
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
      >
        {t('settings.voice.title')}
      </ThemedText>
      <ThemedText
        style={styles.description}
      >
        {t('settings.voice.description')}
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
        >
          {t('settings.voice.current')}
        </ThemedText>
        <ThemedText style={[styles.currentVoice, { color: textColor, backgroundColor: textColor + '20' }]}>
          {currentVoice}
        </ThemedText>
      </View>

      <View style={styles.selectionContainer}>
        <View style={styles.selectionRow}>
          <ThemedText
            style={styles.label}
          >
            {t('settings.voice.language')}
          </ThemedText>
          <View style={styles.selectionButtons}>
            {Object.keys(VOICES).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.selectionButton,
                  { borderColor: tintColor },
                  selectedLanguage === lang && { backgroundColor: tintColor }
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <ThemedText
                  style={[
                    styles.selectionButtonText,
                    selectedLanguage === lang && { color: 'white' }
                  ]}
                >
                  {lang}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.selectionRow}>
          <ThemedText
            style={styles.label}
          >
            {t('settings.voice.gender')}
          </ThemedText>
          <View style={styles.selectionButtons}>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                { borderColor: tintColor },
                currentGender === 'Man' && { backgroundColor: tintColor }
              ]}
              onPress={() => setGender('Man')}
            >
              <ThemedText
                style={[
                  styles.selectionButtonText,
                  currentGender === 'Man' && { color: 'white' }
                ]}
              >
                {t('settings.voice.man')}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                { borderColor: tintColor },
                currentGender === 'Woman' && { backgroundColor: tintColor }
              ]}
              onPress={() => setGender('Woman')}
            >
              <ThemedText
                style={[
                  styles.selectionButtonText,
                  currentGender === 'Woman' && { color: 'white' }
                ]}
              >
                {t('settings.voice.woman')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.dropdownContainer}>
        <ThemedText
          style={styles.label}
        >
          {t('settings.voice.new')}
        </ThemedText>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              { borderColor: tintColor, backgroundColor: backgroundColor + 'E6' }
            ]}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <ThemedText style={[styles.dropdownButtonText, { color: textColor }]}>
              {inputVoice || t('settings.voice.select')}
            </ThemedText>
            <ThemedText style={[styles.dropdownArrow, { color: textColor }]}>
              {isDropdownOpen ? '▲' : '▼'}
            </ThemedText>
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={[
              styles.dropdownList,
              { borderColor: tintColor, backgroundColor: backgroundColor + 'FF' }
            ]}>
              {availableVoices.map((voice) => (
                <TouchableOpacity
                  key={voice}
                  style={[styles.dropdownItem, { borderBottomColor: textColor + '19' }]}
                  onPress={() => {
                    setInputVoice(voice);
                    setIsDropdownOpen(false);
                  }}
                >
                  <ThemedText style={[styles.dropdownItemText, { color: textColor }]}>
                    {voice}
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
  selectionContainer: {
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
  selectionRow: {
    marginBottom: 12,
  },
  selectionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentVoice: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 8,
    borderRadius: 6,
  },
});
