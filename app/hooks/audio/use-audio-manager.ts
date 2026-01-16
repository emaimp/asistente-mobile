/**
 * AudioManager - Sistema de Event Bus para controlar reproducción de audio único
 * Garantiza que solo un audio se reproduzca a la vez a nivel de interfaz
 */

type AudioListener = (audioId: string | null) => void;

export class AudioManager {
  private currentAudioId: string | null = null;
  private listeners: Set<AudioListener> = new Set();

  /**
   * Establece el audio actual que se está reproduciendo
   * Notifica a todos los listeners del cambio
   */
  setCurrentAudio(audioId: string | null) {
    this.currentAudioId = audioId;
    // Notificar a todos los componentes de audio del cambio
    this.listeners.forEach(listener => listener(audioId));
  }

  // Verifica si el audio especificado es el que se está reproduciendo actualmente
  isCurrentAudio(audioId: string): boolean {
    return this.currentAudioId === audioId;
  }

  /**
   * Agrega un listener para escuchar cambios en el audio actual
   * Retorna una función para desuscribirse
   */
  addListener(listener: AudioListener): () => void {
    this.listeners.add(listener);
    // Retornar función de cleanup para desuscribirse
    return () => this.listeners.delete(listener);
  }

  // Obtiene el ID del audio actualmente reproduciéndose
  getCurrentAudioId(): string | null {
    return this.currentAudioId;
  }

  // Limpia todos los listeners (útil para cleanup global)
  clearAllListeners() {
    this.listeners.clear();
    this.currentAudioId = null;
  }
}

// Instancia singleton global del AudioManager
export const audioManager = new AudioManager();
