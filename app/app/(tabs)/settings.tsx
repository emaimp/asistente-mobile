import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBackendConfig } from '@/hooks/use-api-settings';
import ServerConfigSection from '@/components/settings/sever-config';
import AIModelConfigSection from '@/components/settings/model-config';
import { Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const { backendUrl, model, saveBackendUrl, saveModel, updateModel, testConnection, isLoading } = useBackendConfig();
  const [inputUrl, setInputUrl] = useState(backendUrl);
  const [inputModel, setInputModel] = useState(model);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isUpdatingModel, setIsUpdatingModel] = useState(false);

  // Actualizar los inputs cuando cambien las configuraciones
  React.useEffect(() => {
    setInputUrl(backendUrl);
  }, [backendUrl]);

  React.useEffect(() => {
    setInputModel(model);
  }, [model]);

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
        <ServerConfigSection
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          backendUrl={backendUrl}
          handleSave={handleSave}
          handleTestConnection={handleTestConnection}
          isTestingConnection={isTestingConnection}
        />

        <AIModelConfigSection
          inputModel={inputModel}
          setInputModel={setInputModel}
          model={model}
          handleUpdateModel={handleUpdateModel}
          handleSaveModelLocally={handleSaveModelLocally}
          isUpdatingModel={isUpdatingModel}
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
