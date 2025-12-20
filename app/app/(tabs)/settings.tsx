import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBackendConfig, useVoiceConfig, useLanguageConfig } from '@/hooks/use-api-settings';
import ServerConfigSection from '@/components/settings/sever-config';
import AIModelConfigSection from '@/components/settings/model-config';
import VoiceConfigSection from '@/components/settings/voice-config';
import LanguageConfigSection from '@/components/settings/language-config';
import { Colors } from '@/constants/theme';

export default function SettingsScreen() {
  // Hook para configuración de servidor y modelo
  const { backendUrl, model, saveBackendUrl, saveModel, updateModel, testConnection, isLoading } = useBackendConfig();
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
      Alert.alert('Error', 'Por favor ingresa una URL válida');
      return;
    }

    // Validación básica de URL
    try {
      new URL(inputUrl);
    } catch {
      Alert.alert('Error', 'La URL no tiene un formato válido');
      return;
    }

    const success = await saveBackendUrl(inputUrl.trim());
    if (success) {
      Alert.alert('Éxito', 'URL guardada correctamente');
    } else {
      Alert.alert('Error', 'No se pudo guardar la URL');
    }
  };

  // Función para guardar el modelo localmente
  const handleSaveModelLocally = async () => {
    if (!inputModel.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de modelo válido');
      return;
    }

    const result = await saveModel(inputModel.trim());
    if (result.success) {
      Alert.alert('Éxito', 'Modelo guardado localmente');
    } else {
      Alert.alert('Error', 'No se pudo guardar el modelo');
    }
  };

  // Función para actualizar el modelo en el servidor
  const handleUpdateModel = async () => {
    if (!inputModel.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de modelo válido');
      return;
    }

    setIsUpdatingModel(true);
    try {
      const result = await updateModel(inputModel.trim());
      if (result.success) {
        Alert.alert('Éxito', 'Modelo actualizado en el servidor');
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar el modelo en el servidor');
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el modelo');
    } finally {
      setIsUpdatingModel(false);
    }
  };

  // Función para probar la conexión al servidor
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await testConnection(inputUrl.trim());
      Alert.alert(
        result.success ? 'Conexión Exitosa' : 'Error de Conexión',
        result.message
      );
    } catch {
      Alert.alert('Error', 'No se pudo probar la conexión');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Función para guardar la voz localmente
  const handleSaveVoiceLocally = async () => {
    if (!inputVoice.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de voz válido');
      return;
    }

    const result = await saveVoiceLocally(inputVoice.trim());
    if (result.success) {
      Alert.alert('Éxito', 'Voz guardada localmente');
    } else {
      Alert.alert('Error', 'No se pudo guardar la voz localmente');
    }
  };

  // Función para actualizar la voz en el servidor
  const handleUpdateVoice = async () => {
    if (!inputVoice.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de voz válido');
      return;
    }

    setIsUpdatingVoice(true);
    try {
      const result = await updateVoice(inputVoice.trim());
      if (result.success) {
        Alert.alert('Éxito', 'Voz actualizada en el servidor');
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar la voz en el servidor');
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la voz');
    } finally {
      setIsUpdatingVoice(false);
    }
  };

  // Función para guardar el idioma localmente
  const handleSaveLanguageLocally = async () => {
    if (!inputLanguage.trim()) {
      Alert.alert('Error', 'Por favor selecciona un idioma válido');
      return;
    }

    const result = await saveLanguageLocally(inputLanguage.trim());
    if (result.success) {
      Alert.alert('Éxito', 'Idioma guardado localmente');
    } else {
      Alert.alert('Error', 'No se pudo guardar el idioma localmente');
    }
  };

  // Función para actualizar el idioma en el servidor
  const handleUpdateLanguage = async () => {
    if (!inputLanguage.trim()) {
      Alert.alert('Error', 'Por favor selecciona un idioma válido');
      return;
    }

    setIsUpdatingLanguage(true);
    try {
      const result = await updateLanguage(inputLanguage.trim());
      if (result.success) {
        Alert.alert('Éxito', 'Idioma actualizado en el servidor');
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar el idioma en el servidor');
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el idioma');
    } finally {
      setIsUpdatingLanguage(false);
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
