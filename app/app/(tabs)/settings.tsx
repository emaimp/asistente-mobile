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
  const textColor = useThemeColor({}, 'text');
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
              borderColor: textColor,
              opacity: isApplyingAll || isUpdatingLanguage || isUpdatingModel || isUpdatingVoice ? 0.5 : 1
            }
          ]}
          onPress={handleApplyAll}
          disabled={isApplyingAll || isUpdatingLanguage || isUpdatingModel || isUpdatingVoice}
        >
          <ThemedText
            style={[styles.applyButtonText, { color: textColor }]}
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
    width: '92%',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
