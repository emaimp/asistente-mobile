export class ConfigApi {
  constructor(private baseUrl: string) {}

  // Método para enviar el modelo al backend
  async setModel(modelName: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

      const response = await fetch(`${this.baseUrl}/api/model/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelName }), // JSON con la clave 'model'
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Error al establecer el modelo: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json();
      console.log('Modelo establecido:', data);
      return true; // Indica éxito
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.error('Timeout al establecer el modelo');
      } else {
        console.error('Error de red al establecer el modelo:', error);
      }
      return false; // Indica fallo
    }
  }

  // Método para enviar la voz al backend
  async setVoice(voiceName: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

      const response = await fetch(`${this.baseUrl}/api/voice/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voice: voiceName }), // JSON con la clave 'voice'
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Error al establecer la voz: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json();
      console.log('Voz establecida:', data);
      return true; // Indica éxito
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.error('Timeout al establecer la voz');
      } else {
        console.error('Error de red al establecer la voz:', error);
      }
      return false; // Indica fallo
    }
  }

  // Método para enviar el idioma al backend
  async setLanguage(languageCode: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

      const response = await fetch(`${this.baseUrl}/api/language/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: languageCode }), // JSON con la clave 'language'
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Error al establecer el idioma: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json();
      console.log('Idioma establecido:', data);
      return true; // Indica éxito
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.error('Timeout al establecer el idioma');
      } else {
        console.error('Error de red al establecer el idioma:', error);
      }
      return false; // Indica fallo
    }
  }
}
