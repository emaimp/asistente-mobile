export class ConfigApi {
  constructor(private baseUrl: string) {}

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

  // Método para enviar la voz al backend
  async setVoice(voiceName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/voice/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voice: voiceName }), // JSON con la clave 'voice'
      });

      if (!response.ok) {
        console.error(`Error al establecer la voz: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json();
      console.log('Voz establecida:', data);
      return true; // Indica éxito
    } catch (error) {
      console.error('Error de red al establecer la voz:', error);
      return false; // Indica fallo
    }
  }

  // Método para enviar el idioma al backend
  async setLanguage(languageCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/language/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: languageCode }), // JSON con la clave 'language'
      });

      if (!response.ok) {
        console.error(`Error al establecer el idioma: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json();
      console.log('Idioma establecido:', data);
      return true; // Indica éxito
    } catch (error) {
      console.error('Error de red al establecer el idioma:', error);
      return false; // Indica fallo
    }
  }
}
