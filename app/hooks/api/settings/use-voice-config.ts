import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const VOICE_KEY = 'voice';

export function useVoiceConfig() {
  const [voice, setVoice] = useState<string>('em_alex');

  // Cargar configuración de voz al iniciar
  useEffect(() => {
    const loadVoiceConfig = async () => {
      try {
        const savedVoice = await AsyncStorage.getItem(VOICE_KEY);
        if (savedVoice) {
          setVoice(savedVoice);
        }
      } catch (error) {
        console.error('Error loading voice config:', error);
      }
    };

    loadVoiceConfig();
  }, []);

  // Guardar nueva voz localmente
  const saveVoiceLocally = async (newVoice: string): Promise<{ success: boolean }> => {
    try {
      await AsyncStorage.setItem(VOICE_KEY, newVoice);
      setVoice(newVoice);
      console.log(`Voz guardada: ${newVoice}`);
      return { success: true };
    } catch (error) {
      console.error('Error saving voice locally:', error);
      return { success: false };
    }
  };

  // Actualizar voz en el backend
  const updateVoice = async (newVoice: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const backendSuccess = await apiService.setVoice(newVoice);

      if (backendSuccess) {
        return { success: true, message: 'Voz actualizada correctamente en el servidor' };
      } else {
        console.warn(`No se pudo actualizar la voz en el backend: ${newVoice}`);
        return { success: false, message: 'No se pudo actualizar la voz en el servidor' };
      }
    } catch (error) {
      console.error('Error updating voice in backend:', error);
      return { success: false, message: 'Error de conexión al actualizar la voz' };
    }
  };

  return {
    voice,
    saveVoiceLocally,
    updateVoice,
  };
}
