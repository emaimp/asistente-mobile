import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { apiService } from '@/services/api';

const BACKEND_URL_KEY = 'backend_url';
const MODEL_KEY = 'model';

export function useBackendConfig() {
  const [backendUrl, setBackendUrl] = useState<string>('');
  const [model, setModel] = useState<string>('gemma3:4b');
  const [isLoading, setIsLoading] = useState(true);

  // URL por defecto según plataforma
  const getDefaultUrl = () => {
    if (Platform.OS === 'web') {
      return 'http://localhost:8000';
    } else {
      // URL por defecto que el usuario cambiará
      return 'http://10.0.2.2:8000';
    }
  };

  // Cargar configuraciones al iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Cargar URL
        const savedUrl = await AsyncStorage.getItem(BACKEND_URL_KEY);
        if (savedUrl) {
          setBackendUrl(savedUrl);
        } else {
          setBackendUrl(getDefaultUrl());
        }
        // Cargar modelo
        const savedModel = await AsyncStorage.getItem(MODEL_KEY);
        if (savedModel) {
          setModel(savedModel);
        }
      } catch (error) {
        console.error('Error loading config:', error);
        setBackendUrl(getDefaultUrl());
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Guardar nueva URL
  const saveBackendUrl = async (url: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(BACKEND_URL_KEY, url);
      setBackendUrl(url);
      return true;
    } catch (error) {
      console.error('Error saving backend URL:', error);
      return false;
    }
  };

  // Guardar nuevo modelo localmente
  const saveModel = async (newModel: string): Promise<{ success: boolean }> => {
    try {
      await AsyncStorage.setItem(MODEL_KEY, newModel);
      setModel(newModel);
      console.log(`Modelo guardado localmente: ${newModel}`);
      return { success: true };
    } catch (error) {
      console.error('Error saving model locally:', error);
      return { success: false };
    }
  };

  // Actualizar modelo en el backend
  const updateModel = async (newModel: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const backendSuccess = await apiService.setModel(newModel);
      
      if (backendSuccess) {
        console.log(`Modelo actualizado en el backend: ${newModel}`);
        return { success: true, message: 'Modelo actualizado correctamente en el servidor' };
      } else {
        console.warn(`No se pudo actualizar el modelo en el backend: ${newModel}`);
        return { success: false, message: 'No se pudo actualizar el modelo en el servidor' };
      }
    } catch (error) {
      console.error('Error updating model in backend:', error);
      return { success: false, message: 'Error de conexión al actualizar el modelo' };
    }
  };

  // Probar conexión al backend
  const testConnection = async (url?: string): Promise<{ success: boolean; message: string }> => {
    const testUrl = url || backendUrl;
    return await apiService.testConnection(testUrl);
  };

  return {
    backendUrl,
    model,
    isLoading,
    saveBackendUrl,
    saveModel,
    updateModel,
    testConnection,
  };
}
