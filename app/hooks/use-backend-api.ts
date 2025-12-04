import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { apiService, ApiResponse } from '@/services/api';
import { useBackendConfig } from './use-backend-config';

export function useApi() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { backendUrl } = useBackendConfig();

  // Actualizar la URL del servicio cuando cambie la configuración
  useEffect(() => {
    apiService.setBaseUrl(backendUrl);
  }, [backendUrl]);

  const sendAudio = async (audioUri: string, sessionId?: string | null): Promise<{ data: ApiResponse; audioUri: string }> => {
    setIsProcessing(true);
    try {
      console.log('🚀 Enviando audio al servidor...');
      const data = await apiService.sendAudio(audioUri, sessionId);

      // Validar que la respuesta tenga los campos requeridos
      if (!data || typeof data.audio_url !== 'string' || !data.audio_format) {
        throw new Error('La API no devolvió audio válido');
      }

      // Construir URL completa del audio
      const fullAudioUrl = data.audio_url.startsWith('http')
        ? data.audio_url
        : `${apiService.baseUrl}${data.audio_url}`;
      let audioUriData: string;

      if (Platform.OS === 'web') {
        // En web, descargar el audio y crear blob URL
        try {
          const audioResponse = await fetch(fullAudioUrl);
          if (!audioResponse.ok) {
            throw new Error(`Error descargando audio: ${audioResponse.status} ${audioResponse.statusText}`);
          }

          const audioBlob = await audioResponse.blob();

          if (audioBlob.size === 0) {
            throw new Error('El archivo de audio descargado está vacío');
          }

          audioUriData = URL.createObjectURL(audioBlob);
        } catch (error) {
          throw new Error(`No se pudo descargar el audio: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      } else {
        // En nativo, usar la URL HTTP directamente (expo-av puede manejarla)
        try {
          // Verificar que la URL sea accesible
          const audioResponse = await fetch(fullAudioUrl, { method: 'HEAD' });
          if (!audioResponse.ok) {
            throw new Error(`Audio no disponible: ${audioResponse.status} ${audioResponse.statusText}`);
          }

          const contentLength = audioResponse.headers.get('content-length');

          if (contentLength === '0') {
            throw new Error('El archivo de audio está vacío');
          }

          audioUriData = fullAudioUrl;
        } catch (error) {
          throw new Error(`No se pudo acceder al audio: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      }
      return { data, audioUri: audioUriData };
    } catch (error) {
      // No relanzar el error para evitar que cierre la app
      throw error; // Mantener el comportamiento actual pero con mejor logging
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    sendAudio,
    isProcessing,
  };
}
