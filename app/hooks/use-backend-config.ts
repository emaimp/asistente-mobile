import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

const BACKEND_URL_KEY = 'backend_url';

export function useBackendConfig() {
  const [backendUrl, setBackendUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // URL por defecto según plataforma
  const getDefaultUrl = () => {
    if (Platform.OS === 'web') {
      return 'http://localhost:8000';
    } else {
      // Para dispositivos físicos, usar una URL por defecto que el usuario cambiará
      return 'http://10.0.2.2:8000';
    }
  };

  // Cargar URL guardada al iniciar
  useEffect(() => {
    const loadBackendUrl = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem(BACKEND_URL_KEY);
        if (savedUrl) {
          setBackendUrl(savedUrl);
        } else {
          setBackendUrl(getDefaultUrl());
        }
      } catch (error) {
        console.error('Error loading backend URL:', error);
        setBackendUrl(getDefaultUrl());
      } finally {
        setIsLoading(false);
      }
    };

    loadBackendUrl();
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

    try {
      const response = await fetch(`${testUrl}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          return { success: true, message: 'Conexión exitosa' };
        } else {
          return { success: false, message: 'El servidor respondió pero el status no es válido' };
        }
      } else {
        return { success: false, message: `Error del servidor: ${response.status} ${response.statusText}` };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, message: `No se pudo conectar: ${errorMessage}` };
    }
  };

  return {
    backendUrl,
    isLoading,
    saveBackendUrl,
    testConnection,
  };
}
