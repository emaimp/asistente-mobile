import { Platform } from 'react-native';

export interface ApiResponse {
  question: string;
  answer: string;
  audio_url: string;
  audio_format: string;
  session_id: string;
}

export class ApiService {
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

  // Método para enviar el modelo al backend
  async setModel(modelName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/model/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelName }), // JSON con la clave 'model'
      });

      if (!response.ok) {
        console.error(`Error al establecer el modelo: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json();
      console.log('Modelo establecido:', data);
      return true; // Indica éxito
    } catch (error) {
      console.error('Error de red al establecer el modelo:', error);
      return false; // Indica fallo
    }
  }

  async sendAudio(audioUri: string, sessionId?: string | null, model?: string): Promise<ApiResponse> {
    // Crear FormData para enviar
    const formData = new FormData();

    if (Platform.OS === 'web') {
      // En web, convertir el URI a Blob
      const response = await fetch(audioUri);
      const blob = await response.blob();
      formData.append('file', blob, 'recording.m4a');
    } else {
      // En nativo, usar el objeto con uri
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
    }

    // Agregar session_id si existe
    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    // Agregar model (obligatorio)
    if (model) {
      formData.append('model', model);
    }

    // Enviar a API
    const response = await fetch(`${this.baseUrl}/api/ask/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    // La API devuelve JSON con audio en base64
    return await response.json() as ApiResponse;
  }

  async sendText(text: string, sessionId?: string | null, model?: string): Promise<ApiResponse> {
    // Crear el body JSON
    const body: any = { text };

    // Agregar session_id si existe
    if (sessionId) {
      body.session_id = sessionId;
    }

    // Agregar model (obligatorio)
    if (model) {
      body.model = model;
    }

    // Enviar a API
    const response = await fetch(`${this.baseUrl}/api/tts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    // La API devuelve JSON con audio
    return await response.json() as ApiResponse;
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

// Instancia singleton del servicio
export const apiService = new ApiService();
