import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useModelConfig } from '@/hooks/api-settings/use-model-config';
import { useVoiceConfig } from '@/hooks/api-settings/use-voice-config';
import { useLanguageConfig } from '@/hooks/api-settings/use-language-config';
import { useLanguage } from '@/contexts/language-context';
import AIModelConfigSection from '@/components/settings/model-config';
import VoiceConfigSection from '@/components/settings/voice-config';
import LanguageConfigSection from '@/components/settings/language-config';
import { Colors } from '@/constants/theme';

const SNACKBAR_SUCCESS_COLOR = '#2eb733';
const SNACKBAR_ERROR_COLOR = '#e00023';

export default function SettingsScreen() {
  // Hook para configuraciรณn de modelo
  const { model, saveModel, updateModel } = useModelConfig();
  // Hook para configuraciรณn de voz
  const { voice: currentVoice, saveVoiceLocally, updateVoice } = useVoiceConfig();
  // Hook para configuraciรณn de idioma
  const { language: currentLanguage, saveLanguageLocally, updateLanguage } = useLanguageConfig();
  // Estado para el campo de entrada del modelo
  const [inputModel, setInputModel] = useState(model);
  // Estado de carga para actualizar modelo
  const [isUpdatingModel, setIsUpdatingModel] = useState(false);
  // Estado para el campo de entrada de voz
  const [inputVoice, setInputVoice] = useState(currentVoice);
  // Estado de carga para actualizar voz
  const [isUpdatingVoice, setIsUpdatingVoice] = useState(false);
  // Estado para el campo de entrada de idioma
  const [inputLanguage, setInputLanguage] = useState(currentLanguage);
  // Estado de carga para actualizar idioma
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);
  // Estado para Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('green');
  // Estado para aplicar todas las configuraciones
  const [isApplyingAll, setIsApplyingAll] = useState(false);
  // Hook para traducciones
  const { t } = useLanguage();

  // Función para mostrar Snackbar
  const showSnackbar = (message: string, color: string = 'green') => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  // Actualizar los inputs cuando cambien las configuraciones
  React.useEffect(() => {
    setInputModel(model);
  }, [model]);

  React.useEffect(() => {
    setInputVoice(currentVoice);
  }, [currentVoice]);

  React.useEffect(() => {
    setInputLanguage(currentLanguage);
  }, [currentLanguage]);

  // Función para guardar el idioma localmente
  const handleSaveLanguageLocally = async () => {
    await saveLanguageLocally(inputLanguage.trim());
  };

  // Función para actualizar el idioma en el servidor
  const handleUpdateLanguage = async () => {
    setIsUpdatingLanguage(true);
    try {
      await updateLanguage(inputLanguage.trim());
    } finally {
      setIsUpdatingLanguage(false);
    }
  };

  // Función para guardar el modelo localmente
  const handleSaveModelLocally = async () => {
    await saveModel(inputModel.trim());
  };

  // Función para actualizar el modelo en el servidor
  const handleUpdateModel = async () => {
    setIsUpdatingModel(true);
    try {
      await updateModel(inputModel.trim());
    } finally {
      setIsUpdatingModel(false);
    }
  };

  // Función para guardar la voz localmente
  const handleSaveVoiceLocally = async () => {
    await saveVoiceLocally(inputVoice.trim());
  };

  // Función para actualizar la voz en el servidor
  const handleUpdateVoice = async () => {
    setIsUpdatingVoice(true);
    try {
      await updateVoice(inputVoice.trim());
    } finally {
      setIsUpdatingVoice(false);
    }
  };

  // Función para aplicar todas las configuraciones (Idioma, Modelo, Voz)
  const handleApplyAll = async () => {
    setIsApplyingAll(true);
    try {
      // Aplicar idioma
      await handleSaveLanguageLocally();
      await handleUpdateLanguage();

      // Aplicar modelo
      await handleSaveModelLocally();
      await handleUpdateModel();

      // Aplicar voz
      await handleSaveVoiceLocally();
      await handleUpdateVoice();

      // Mensaje final de รฉxito
      showSnackbar(t('settings.applyAllSuccess'), SNACKBAR_SUCCESS_COLOR);
    } catch {
      // En caso de error general
      showSnackbar(t('settings.applyAllError'), SNACKBAR_ERROR_COLOR);
    } finally {
      setIsApplyingAll(false);
    }
  };

  return (
    <ThemedView style={{flex: 1}} lightColor={Colors.light.tabBackground} darkColor={Colors.dark.tabBackground}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <LanguageConfigSection
          inputLanguage={inputLanguage}
          setInputLanguage={setInputLanguage}
          currentLanguage={currentLanguage}
        />

        <VoiceConfigSection
          inputVoice={inputVoice}
          setInputVoice={setInputVoice}
          currentVoice={currentVoice}
        />

        <AIModelConfigSection
          inputModel={inputModel}
          setInputModel={setInputModel}
          model={model}
        />

        {/* Botรณn para aplicar todas las configuraciones */}
        <Pressable
          style={({ pressed }) => [styles.applyAllButton, { opacity: isApplyingAll || isUpdatingLanguage || isUpdatingModel || isUpdatingVoice ? 0.5 : 1 }, pressed && styles.pressedApply]}
          onPress={handleApplyAll}
          disabled={isApplyingAll || isUpdatingLanguage || isUpdatingModel || isUpdatingVoice}
        >
          <ThemedText
            style={styles.applyAllButtonText}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            {t('settings.applyAll')}
          </ThemedText>
        </Pressable>


      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={{ backgroundColor: snackbarColor }}
      >
        <Text style={{ textAlign: 'center', color: 'white' }}>{snackbarMessage}</Text>
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 35,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  applyAllButton: {
    width: '92%',
    padding: 14,
    borderRadius: 6,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#2ab0e1',
    marginTop: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#105293',
  },
  pressedApply: {
    transform: [{ scale: 0.95 }],
    borderBottomWidth: 2,
    borderBottomColor: '#105293',
  },
  applyAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
