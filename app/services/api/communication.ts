import { Platform } from 'react-native';
import { ApiResponse } from './types';

export class CommunicationApi {
  constructor(private baseUrl: string) {}

  /**
   * Método unificado para enviar audio o texto al backend
   * @param options - Opciones para la consulta
   * @param options.audioUri - URI del archivo de audio (opcional)
   * @param options.text - Texto directo (opcional)
   * @param options.sessionId - ID de sesión (opcional)
   * @param options.model - Modelo a usar (opcional)
   * @returns Promise con la respuesta del API
   */
  async ask(options: {
    audioUri?: string;
    text?: string;
    sessionId?: string | null;
    model?: string;
  }): Promise<ApiResponse> {
    const { audioUri, text, sessionId, model } = options;

    // Crear FormData para enviar
    const formData = new FormData();

    // Determinar qué enviar: audio o texto
    if (audioUri) {
      // Enviar audio
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
    } else if (text) {
      // Enviar texto
      formData.append('text', text);
    } else {
      throw new Error('Debe proporcionar audioUri o text');
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

    // La API devuelve JSON con audio
    return await response.json() as ApiResponse;
  }
}
