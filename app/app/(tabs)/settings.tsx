import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBackendUrlConfig } from '@/hooks/api-settings/use-backend-url-config';
import { useModelConfig } from '@/hooks/api-settings/use-model-config';
import { useVoiceConfig } from '@/hooks/api-settings/use-voice-config';
import { useLanguageConfig } from '@/hooks/api-settings/use-language-config';
import ServerConfigSection from '@/components/settings/sever-config';
import AIModelConfigSection from '@/components/settings/model-config';
import VoiceConfigSection from '@/components/settings/voice-config';
import LanguageConfigSection from '@/components/settings/language-config';
import { Colors } from '@/constants/theme';

const SNACKBAR_SUCCESS_COLOR = '#2eb733';
const SNACKBAR_ERROR_COLOR = '#e00023';

export default function SettingsScreen() {
  // Hooks para configuraciรณn de servidor
  const { backendUrl, saveBackendUrl, testConnection, isLoading } = useBackendUrlConfig();
  // Hook para configuraciรณn de modelo
  const { model, saveModel, updateModel } = useModelConfig();
  // Hook para configuraciรณn de voz
  const { voice: currentVoice, saveVoiceLocally, updateVoice } = useVoiceConfig();
  // Hook para configuraciรณn de idioma
  const { language: currentLanguage, saveLanguageLocally, updateLanguage } = useLanguageConfig();
  // Estado para el campo de entrada de URL del servidor
  const [inputUrl, setInputUrl] = useState(backendUrl);
  // Estado para el campo de entrada del modelo
  const [inputModel, setInputModel] = useState(model);
  // Estado de carga para probar conexiรณn
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

  // Funciรณn para guardar la URL del servidor
  const handleSave = async () => {
    if (!inputUrl.trim()) {
      showSnackbar('Por favor ingresa una URL válida', SNACKBAR_ERROR_COLOR);
      return;
    }

    // Validaciรณn bรกsica de URL
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

  // Funciรณn para guardar el modelo localmente
  const handleSaveModelLocally = async () => {
    if (!inputModel.trim()) {
      showSnackbar('Por favor ingresa un nombre de modelo válido', SNACKBAR_ERROR_COLOR);
      return;
    }

    const result = await saveModel(inputModel.trim());
    if (!result.success) {
      showSnackbar('No se pudo guardar el modelo localmente', SNACKBAR_ERROR_COLOR);
    }
  };

  // Funciรณn para actualizar el modelo en el servidor
  const handleUpdateModel = async () => {
    if (!inputModel.trim()) {
      showSnackbar('Por favor ingresa un nombre de modelo válido', SNACKBAR_ERROR_COLOR);
      return;
    }

    setIsUpdatingModel(true);
    try {
      const result = await updateModel(inputModel.trim());
      if (result.success) {
        showSnackbar('Modelo aplicado correctamente', SNACKBAR_SUCCESS_COLOR);
      } else {
        showSnackbar(result.message || 'No se pudo actualizar el modelo en el servidor', SNACKBAR_ERROR_COLOR);
      }
    } catch {
      showSnackbar('No se pudo actualizar el modelo', SNACKBAR_ERROR_COLOR);
    } finally {
      setIsUpdatingModel(false);
    }
  };

  // Funciรณn para probar la conexiรณn al servidor
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

  // Funciรณn para guardar la voz localmente
  const handleSaveVoiceLocally = async () => {
    if (!inputVoice.trim()) {
      showSnackbar('Por favor selecciona una voz válida', SNACKBAR_ERROR_COLOR);
      return;
    }

    const result = await saveVoiceLocally(inputVoice.trim());
    if (!result.success) {
      showSnackbar('No se pudo guardar la voz localmente', SNACKBAR_ERROR_COLOR);
    }
  };

  // Funciรณn para actualizar la voz en el servidor
  const handleUpdateVoice = async () => {
    if (!inputVoice.trim()) {
      showSnackbar('Por favor selecciona una voz válida', SNACKBAR_ERROR_COLOR);
      return;
    }

    setIsUpdatingVoice(true);
    try {
      const result = await updateVoice(inputVoice.trim());
      if (result.success) {
        showSnackbar('Voz aplicada correctamente', SNACKBAR_SUCCESS_COLOR);
      } else {
        showSnackbar(result.message || 'No se pudo actualizar la voz en el servidor', SNACKBAR_ERROR_COLOR);
      }
    } catch {
      showSnackbar('No se pudo actualizar la voz', SNACKBAR_ERROR_COLOR);
    } finally {
      setIsUpdatingVoice(false);
    }
  };

  // Funciรณn para guardar el idioma localmente
  const handleSaveLanguageLocally = async () => {
    if (!inputLanguage.trim()) {
      showSnackbar('Por favor selecciona un idioma válido', SNACKBAR_ERROR_COLOR);
      return;
    }

    const result = await saveLanguageLocally(inputLanguage.trim());
    if (!result.success) {
      showSnackbar('No se pudo guardar el idioma localmente', SNACKBAR_ERROR_COLOR);
    }
  };

  // Funciรณn para actualizar el idioma en el servidor
  const handleUpdateLanguage = async () => {
    if (!inputLanguage.trim()) {
      showSnackbar('Por favor selecciona un idioma válido', SNACKBAR_ERROR_COLOR);
      return;
    }

    setIsUpdatingLanguage(true);
    try {
      const result = await updateLanguage(inputLanguage.trim());
      if (result.success) {
        showSnackbar('Idioma aplicado correctamente', SNACKBAR_SUCCESS_COLOR);
      } else {
        showSnackbar(result.message || 'No se pudo actualizar el idioma en el servidor', SNACKBAR_ERROR_COLOR);
      }
    } catch {
      showSnackbar('No se pudo actualizar el idioma', SNACKBAR_ERROR_COLOR);
    } finally {
      setIsUpdatingLanguage(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={{flex: 1}} lightColor={Colors.light.tabBackground} darkColor={Colors.dark.tabBackground}>
        <ThemedView style={styles.container}>
          <ThemedText>Cargando configuraciรณn...</ThemedText>
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
          handleUpdateLanguage={handleUpdateLanguage}
          handleSaveLanguageLocally={handleSaveLanguageLocally}
          isUpdatingLanguage={isUpdatingLanguage}
        />

        <AIModelConfigSection
          inputModel={inputModel}
          setInputModel={setInputModel}
          model={model}
          handleUpdateModel={handleUpdateModel}
          handleSaveModelLocally={handleSaveModelLocally}
          isUpdatingModel={isUpdatingModel}
        />

        <VoiceConfigSection
          inputVoice={inputVoice}
          setInputVoice={setInputVoice}
          currentVoice={currentVoice}
          handleUpdateVoice={handleUpdateVoice}
          handleSaveVoiceLocally={handleSaveVoiceLocally}
          isUpdatingVoice={isUpdatingVoice}
        />

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
        {snackbarMessage}
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
