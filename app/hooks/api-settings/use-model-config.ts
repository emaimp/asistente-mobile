import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const MODEL_KEY = 'model';

export function useModelConfig() {
  const [model, setModel] = useState<string>('gemma3:1b');

  // Cargar configuración al iniciar
  useEffect(() => {
    const loadModelConfig = async () => {
      try {
        const savedModel = await AsyncStorage.getItem(MODEL_KEY);
        if (savedModel) {
          setModel(savedModel);
        }
      } catch (error) {
        console.error('Error loading model config:', error);
      }
    };

    loadModelConfig();
  }, []);

  // Guardar nuevo modelo localmente
  const saveModel = async (newModel: string): Promise<{ success: boolean }> => {
    try {
      await AsyncStorage.setItem(MODEL_KEY, newModel);
      setModel(newModel);
      console.log(`Modelo guardado: ${newModel}`);
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

  return {
    model,
    saveModel,
    updateModel,
  };
}
