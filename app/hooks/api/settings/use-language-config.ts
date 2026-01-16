import { useLanguage } from '@/contexts/language-context';
import { apiService } from '@/services/api';

export function useLanguageConfig() {
  const { currentLanguage, setLanguage } = useLanguage();

  // Guardar nuevo idioma localmente
  const saveLanguageLocally = async (newLanguage: string): Promise<{ success: boolean }> => {
    try {
      await setLanguage(newLanguage);
      return { success: true };
    } catch (error) {
      console.error('Error saving language locally:', error);
      return { success: false };
    }
  };

  // Actualizar idioma en el backend
  const updateLanguage = async (newLanguage: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const backendSuccess = await apiService.setLanguage(newLanguage);

      if (backendSuccess) {
        // También actualizar localmente después de actualizar en el servidor
        await setLanguage(newLanguage);
        return { success: true, message: 'Idioma actualizado correctamente' };
      } else {
        console.warn(`No se pudo actualizar el idioma: ${newLanguage}`);
        return { success: false, message: 'No se pudo actualizar el idioma' };
      }
    } catch (error) {
      console.error('Error updating language:', error);
      return { success: false, message: 'Error de conexión al actualizar el idioma' };
    }
  };

  return {
    language: currentLanguage,
    saveLanguageLocally,
    updateLanguage,
  };
}
