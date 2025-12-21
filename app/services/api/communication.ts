import { Platform } from 'react-native';
import { ApiResponse } from './types';

export class CommunicationApi {
  constructor(private baseUrl: string) {}

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
}
