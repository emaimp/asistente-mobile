import { Platform } from 'react-native';

export class BaseApi {
  public baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || this.getDefaultUrl();
  }

  private getDefaultUrl(): string {
    // Configurar URL base según la plataforma (fallback si no hay configuración guardada)
    if (Platform.OS === 'web') {
      return 'http://localhost:8000';
    } else {
      // Para Android emulator y iOS simulator
      return 'http://10.0.2.2:8000';
    }
  }

  // Método para actualizar la URL base
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  // Método para configurar headers si es necesario (ej. autenticación)
  setAuthToken(token: string) {
    // Implementar si la API requiere autenticación
    // this.headers.Authorization = `Bearer ${token}`;
  }

  // Probar conexión al backend
  async testConnection(url: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${url}/api/status`, {
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
  }
}
