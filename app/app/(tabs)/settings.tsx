import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useModelConfig } from '@/hooks/api-settings/use-model-config';
import { useVoiceConfig } from '@/hooks/api-settings/use-voice-config';
import { useLanguageConfig } from '@/hooks/api-settings/use-language-config';
import { useLanguage } from '@/contexts/language-context';
import AIModelConfigSection from '@/components/settings/model-config';
import VoiceConfigSection from '@/components/settings/voice-config';
import LanguageConfigSection from '@/components/settings/language-config';

export default function SettingsScreen() {
  // Colores dinámicos basados en género
  const tintColor = useThemeColor({}, 'tint');
  const tabIconSelected = useThemeColor({}, 'tabIconSelected');
  const successPrimary = useThemeColor({}, 'successPrimary');
  const errorPrimary = useThemeColor({}, 'errorPrimary');

  // Hook para configuración de modelo
  const { model, saveModel, updateModel } = useModelConfig();
  // Hook para configuración de voz
  const { voice: currentVoice, saveVoiceLocally, updateVoice } = useVoiceConfig();
  // Hook para configuración de idioma
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
    const result = await saveLanguageLocally(inputLanguage.trim());
    if (!result.success) {
      throw new Error('Error saving language locally');
    }
  };

  // Función para actualizar el idioma en el servidor
  const handleUpdateLanguage = async () => {
    setIsUpdatingLanguage(true);
    try {
      const result = await updateLanguage(inputLanguage.trim());
      if (!result.success) {
        throw new Error(result.message || 'Error updating language');
      }
    } finally {
      setIsUpdatingLanguage(false);
    }
  };

  // Función para guardar el modelo localmente
  const handleSaveModelLocally = async () => {
    const result = await saveModel(inputModel.trim());
    if (!result.success) {
      throw new Error('Error saving model locally');
    }
  };

  // Función para actualizar el modelo en el servidor
  const handleUpdateModel = async () => {
    setIsUpdatingModel(true);
    try {
      const result = await updateModel(inputModel.trim());
      if (!result.success) {
        throw new Error(result.message || 'Error updating model');
      }
    } finally {
      setIsUpdatingModel(false);
    }
  };

  // Función para guardar la voz localmente
  const handleSaveVoiceLocally = async () => {
    const result = await saveVoiceLocally(inputVoice.trim());
    if (!result.success) {
      throw new Error('Error saving voice locally');
    }
  };

  // Función para actualizar la voz en el servidor
  const handleUpdateVoice = async () => {
    setIsUpdatingVoice(true);
    try {
      const result = await updateVoice(inputVoice.trim());
      if (!result.success) {
        throw new Error(result.message || 'Error updating voice');
      }
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

      // Mensaje final de éxito
      showSnackbar(t('settings.applyAllSuccess'), successPrimary);
    } catch {
      // En caso de error general
      showSnackbar(t('settings.applyAllError'), errorPrimary);
    } finally {
      setIsApplyingAll(false);
    }
  };

  return (
    <ThemedView style={{flex: 1}}>
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

        {/* Botón para aplicar todas las configuraciones */}
        <TouchableOpacity
          style={[
            styles.applyButton,
            {
              backgroundColor: tintColor,
              shadowColor: tabIconSelected,
              opacity: isApplyingAll || isUpdatingLanguage || isUpdatingModel || isUpdatingVoice ? 0.5 : 1
            }
          ]}
          onPress={handleApplyAll}
          disabled={isApplyingAll || isUpdatingLanguage || isUpdatingModel || isUpdatingVoice}
        >
          <ThemedText
            style={[styles.applyButtonText, { color: 'white' }]}
          >
            {t('settings.applyAll')}
          </ThemedText>
        </TouchableOpacity>

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
  applyButton: {
    width: '90%',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 0,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
