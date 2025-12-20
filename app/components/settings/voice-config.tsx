import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface VoiceConfigSectionProps {
  inputVoice: string;
  setInputVoice: (value: string) => void;
  currentVoice: string;
  handleUpdateVoice: () => void;
  handleSaveVoiceLocally: () => void;
  isUpdatingVoice: boolean;
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
  handleUpdateVoice,
  handleSaveVoiceLocally,
  isUpdatingVoice,
}: VoiceConfigSectionProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [selectedGender, setSelectedGender] = useState<string>('Woman');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const availableVoices = VOICES[selectedLanguage as keyof typeof VOICES][selectedGender as keyof typeof VOICES[keyof typeof VOICES]];

  useEffect(() => {
    // Update inputVoice to first available voice when language/gender changes
    setInputVoice(availableVoices[0] || '');
  }, [availableVoices, setInputVoice]);

  return (
    <ThemedView style={[styles.section, { borderColor }]}>
      <ThemedText
        type="subtitle"
        style={styles.sectionTitle}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        Voz del Bot
      </ThemedText>
      <ThemedText
        style={styles.description}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        Configura la voz del bot por idioma y género.
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText
          style={styles.label}
          lightColor="#000000"
          darkColor="#FFFFFF"
        >
          Voz Actual:
        </ThemedText>
        <ThemedText style={styles.currentVoice}>{currentVoice}</ThemedText>
      </View>

      <View style={styles.selectionContainer}>
        <View style={styles.selectionRow}>
          <ThemedText
            style={styles.label}
            lightColor="#000000"
            darkColor="#FFFFFF"
          >
            Idioma:
          </ThemedText>
          <View style={styles.selectionButtons}>
            {Object.keys(VOICES).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.selectionButton, selectedLanguage === lang && styles.selectedButton]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <ThemedText
                  style={[styles.selectionButtonText, selectedLanguage === lang && styles.selectedButtonText]}
                  lightColor="#000000"
                  darkColor="#FFFFFF"
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
            lightColor="#000000"
            darkColor="#FFFFFF"
          >
            Género:
          </ThemedText>
          <View style={styles.selectionButtons}>
            <TouchableOpacity
              style={[styles.selectionButton, selectedGender === 'Man' && styles.selectedButton]}
              onPress={() => setSelectedGender('Man')}
            >
              <ThemedText
                style={[styles.selectionButtonText, selectedGender === 'Man' && styles.selectedButtonText]}
                lightColor="#000000"
                darkColor="#FFFFFF"
              >
                Hombre
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectionButton, selectedGender === 'Woman' && styles.selectedButton]}
              onPress={() => setSelectedGender('Woman')}
            >
              <ThemedText
                style={[styles.selectionButtonText, selectedGender === 'Woman' && styles.selectedButtonText]}
                lightColor="#000000"
                darkColor="#FFFFFF"
              >
                Mujer
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.dropdownContainer}>
        <ThemedText
          style={styles.label}
          lightColor="#000000"
          darkColor="#FFFFFF"
        >
          Nueva Voz:
        </ThemedText>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[styles.dropdownButton, { borderColor: '#2ab0e1' }]}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <ThemedText style={[styles.dropdownButtonText, { color: 'black' }]}>
              {inputVoice || 'Seleccionar voz'}
            </ThemedText>
            <ThemedText style={[styles.dropdownArrow, { color: 'black' }]}>
              {isDropdownOpen ? '▲' : '▼'}
            </ThemedText>
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={[styles.dropdownList, { borderColor: '#2ab0e1' }]}>
              {availableVoices.map((voice) => (
                <TouchableOpacity
                  key={voice}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setInputVoice(voice);
                    setIsDropdownOpen(false);
                  }}
                >
                  <ThemedText style={[styles.dropdownItemText, { color: 'black' }]}>
                    {voice}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={handleUpdateVoice}
          disabled={isUpdatingVoice}
        >
          <ThemedText
            style={styles.updateButtonText}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            {isUpdatingVoice ? 'Actualizando...' : 'Actualizar'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSaveVoiceLocally}
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
    borderColor: '#2ab0e1',
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: '#2ab0e1',
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentVoice: {
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
  voicesList: {
    marginBottom: 16,
  },
  voicesText: {
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 8,
    borderRadius: 6,
    lineHeight: 20,
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
  updateButton: {
    backgroundColor: '#2ab0e1',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
