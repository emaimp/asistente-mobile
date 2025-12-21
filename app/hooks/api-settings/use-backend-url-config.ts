import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { apiService } from '@/services/api';

const BACKEND_URL_KEY = 'backend_url';

export function useBackendUrlConfig() {
  const [backendUrl, setBackendUrl] = useState<string>('');
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

  // Cargar configuración al iniciar
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
      } catch (error) {
        console.error('Error loading backend URL config:', error);
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

  // Probar conexión al backend
  const testConnection = async (url?: string): Promise<{ success: boolean; message: string }> => {
    const testUrl = url || backendUrl;
    return await apiService.testConnection(testUrl);
  };

  return {
    backendUrl,
    isLoading,
    saveBackendUrl,
    testConnection,
  };
}
