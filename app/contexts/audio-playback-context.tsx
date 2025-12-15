import React, { createContext, useContext, useState } from 'react';

/*
 * Contexto para gestionar el estado global de reproducción de audio en la app.
 * Mantiene un contador de audios reproduciendo para coordinar múltiples dispositivos
 * de audio y prevenir ecos/conflictos entre diferentes reproductores.
*/
interface AudioPlaybackContextType {
  /** Indica si hay algún audio reproduciendo actualmente en cualquier parte de la app */
  isAnyAudioPlaying: boolean;
  /** Incrementa el contador cuando inicia un nuevo audio. Llamado por hooks de audio. */
  incrementPlayback: () => void;
  /** Decrementa el contador cuando termina un audio. Llamado por hooks de audio. */
  decrementPlayback: () => void;
}

const AudioPlaybackContext = createContext<AudioPlaybackContextType | undefined>(undefined);

/*
 * Hook personalizado para acceder al contexto de reproducción de audio.
 * Debe usarse solo dentro de componentes envueltos por AudioPlaybackProvider.
 * Proporciona acceso a estado global de audio y funciones de control.
*/
export const useAudioPlaybackContext = () => {
  const context = useContext(AudioPlaybackContext);
  if (!context) {
    throw new Error('useAudioPlaybackContext must be used within AudioPlaybackProvider');
  }
  return context;
};

/*
 * Provider de contexto que envuelve componentes que necesitan controlar el estado global de reproducción de audio.
 * Uso principal: Envolverse alrededor de todo el árbol de componentes para coordinar múltiples reproductores de audio.
*/
export const AudioPlaybackProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Contador interno, cuenta cuántos audios se están reproduciendo (no se exporta, solo se usa para calcular isAnyAudioPlaying)
  const [playbackCount, setPlaybackCount] = useState(0);

  // Flag derivado, 'true' cuando hay al menos un audio reproduciendo
  const isAnyAudioPlaying = playbackCount > 0;

  // Incrementa contador cuando inicia reproducción de audio (usado por useAudioPlayback hook)
  const incrementPlayback = () => setPlaybackCount(prev => Math.max(0, prev + 1));

  // Decrementa contador cuando termina reproducción de audio (usado por useAudioPlayback hook)
  const decrementPlayback = () => setPlaybackCount(prev => Math.max(0, prev - 1));

  return (
    // Provee el contexto a todos los componentes hijos
    <AudioPlaybackContext.Provider value={{ isAnyAudioPlaying, incrementPlayback, decrementPlayback }}>
      {children}
    </AudioPlaybackContext.Provider>
  );
};
