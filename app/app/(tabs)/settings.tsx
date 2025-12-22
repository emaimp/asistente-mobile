import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBackendUrlConfig } from '@/hooks/api-settings/use-backend-url-config';
import { useModelConfig } from '@/hooks/api-settings/use-model-config';
import { useVoiceConfig } from '@/hooks/api-settings/use-voice-config';
import { useLanguageConfig } from '@/hooks/api-settings/use-language-config';
import { useLanguage } from '@/contexts/language-context';
import ServerConfigSection from '@/components/settings/sever-config';
import AIModelConfigSection from '@/components/settings/model-config';
import VoiceConfigSection from '@/components/settings/voice-config';
import LanguageConfigSection from '@/components/settings/language-config';
import { Colors } from '@/constants/theme';

const SNACKBAR_SUCCESS_COLOR = '#2eb733';
const SNACKBAR_ERROR_COLOR = '#e00023';

export default function SettingsScreen() {
  // Hooks para configuración de servidor
  const { backendUrl, saveBackendUrl, testConnection, isLoading } = useBackendUrlConfig();
  // Hook para configuración de modelo
  const { model, saveModel, updateModel } = useModelConfig();
  // Hook para configuración de voz
  const { voice: currentVoice, saveVoiceLocally, updateVoice } = useVoiceConfig();
  // Hook para configuración de idioma
  const { language: currentLanguage, saveLanguageLocally, updateLanguage } = useLanguageConfig();
  // Estado para el campo de entrada de URL del servidor
  const [inputUrl, setInputUrl] = useState(backendUrl);
  // Estado para el campo de entrada del modelo
  const [inputModel, setInputModel] = useState(model);
  // Estado de carga para probar conexión
  const [isTestingConnection, setIsTestingConnection] = useState(false);
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
    setInputUrl(backendUrl);
  }, [backendUrl]);

  React.useEffect(() => {
    setInputModel(model);
  }, [model]);

  React.useEffect(() => {
    setInputVoice(currentVoice);
  }, [currentVoice]);

  React.useEffect(() => {
    setInputLanguage(currentLanguage);
  }, [currentLanguage]);

  // Función para guardar la URL del servidor
  const handleSave = async () => {
    if (!inputUrl.trim()) {
      showSnackbar('Por favor ingresa una URL válida', SNACKBAR_ERROR_COLOR);
      return;
    }

    // Validación básica de URL
    try {
      new URL(inputUrl);
    } catch {
      showSnackbar('La URL no tiene un formato válido', SNACKBAR_ERROR_COLOR);
      return;
    }

    const success = await saveBackendUrl(inputUrl.trim());
    if (success) {
      showSnackbar('URL aplicada correctamente', SNACKBAR_SUCCESS_COLOR);
    } else {
      showSnackbar('No se pudo guardar la URL', SNACKBAR_ERROR_COLOR);
    }
  };

  // Función para probar la conexión al servidor
  const handleTestConnection = async (): Promise<boolean> => {
    setIsTestingConnection(true);
    try {
      const result = await testConnection(inputUrl.trim());
      if (!result.success) {
        showSnackbar(result.message, SNACKBAR_ERROR_COLOR);
      }
      return result.success;
    } catch {
      showSnackbar('No se pudo probar la conexión', SNACKBAR_ERROR_COLOR);
      return false;
    } finally {
      setIsTestingConnection(false);
    }
  };

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
      showSnackbar(t('settings.applyAllSuccess'), SNACKBAR_SUCCESS_COLOR);
    } catch {
      // En caso de error general
      showSnackbar(t('settings.applyAllError'), SNACKBAR_ERROR_COLOR);
    } finally {
      setIsApplyingAll(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={{flex: 1}} lightColor={Colors.light.tabBackground} darkColor={Colors.dark.tabBackground}>
        <ThemedView style={styles.container}>
          <ThemedText>Cargando configuración...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{flex: 1}} lightColor={Colors.light.tabBackground} darkColor={Colors.dark.tabBackground}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <LanguageConfigSection
          inputLanguage={inputLanguage}
          setInputLanguage={setInputLanguage}
          currentLanguage={currentLanguage}
        />

        <AIModelConfigSection
          inputModel={inputModel}
          setInputModel={setInputModel}
          model={model}
        />

        <VoiceConfigSection
          inputVoice={inputVoice}
          setInputVoice={setInputVoice}
          currentVoice={currentVoice}
        />

        {/* Botón para aplicar todas las configuraciones */}
        <TouchableOpacity
          style={[styles.applyAllButton, { opacity: isApplyingAll || isUpdatingLanguage || isUpdatingModel || isUpdatingVoice ? 0.5 : 1 }]}
          onPress={handleApplyAll}
          disabled={isApplyingAll || isUpdatingLanguage || isUpdatingModel || isUpdatingVoice}
        >
          <ThemedText
            style={styles.applyAllButtonText}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            {isApplyingAll ? t('settings.applyingAll') : t('settings.applyAll')}
          </ThemedText>
        </TouchableOpacity>

        <ServerConfigSection
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          backendUrl={backendUrl}
          handleSave={handleSave}
          handleTestConnection={handleTestConnection}
          isTestingConnection={isTestingConnection}
        />
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
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#2ab0e1',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  applyAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
