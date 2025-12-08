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

  async sendAudio(audioUri: string, sessionId?: string | null): Promise<ApiResponse> {
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

  async sendText(text: string, sessionId?: string | null): Promise<ApiResponse> {
    // Crear el body JSON
    const body: any = { text };

    // Agregar session_id si existe
    if (sessionId) {
      body.session_id = sessionId;
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
}

// Instancia singleton del servicio
export const apiService = new ApiService();
