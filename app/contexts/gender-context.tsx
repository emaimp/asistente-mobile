import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GENDER_KEY = 'gender';

// Interfaz del contexto de género
interface GenderContextType {
  currentGender: 'Man' | 'Woman';
  setGender: (gender: 'Man' | 'Woman') => Promise<void>;
}

// Crear el contexto, inicialmente undefined
const GenderContext = createContext<GenderContextType | undefined>(undefined);

// Props del proveedor de género
interface GenderProviderProps {
  children: ReactNode;
}

// Proveedor del contexto de género
export function GenderProvider({ children }: GenderProviderProps) {
  // Estado del género actual, por defecto 'Man'
  const [currentGender, setCurrentGenderState] = useState<'Man' | 'Woman'>('Man');

  // Cargar género desde AsyncStorage al montar el componente
  useEffect(() => {
    const loadGender = async () => {
      try {
        const savedGender = await AsyncStorage.getItem(GENDER_KEY);
        if (savedGender === 'Man' || savedGender === 'Woman') {
          setCurrentGenderState(savedGender);
        }
      } catch (error) {
        console.error('Error al cargar el género:', error);
      }
    };

    loadGender();
  }, []);

  // Función para cambiar el género y guardarlo en AsyncStorage
  const setGender = async (gender: 'Man' | 'Woman') => {
    try {
      await AsyncStorage.setItem(GENDER_KEY, gender);
      setCurrentGenderState(gender);
    } catch (error) {
      console.error('Error al guardar el género:', error);
    }
  };

  // Proporcionar el contexto a los hijos
  return (
    <GenderContext.Provider value={{ currentGender, setGender }}>
      {children}
    </GenderContext.Provider>
  );
}

// Hook para usar el contexto de género
export function useGender() {
  const context = useContext(GenderContext);
  if (context === undefined) {
    throw new Error('useGender debe usarse dentro de un GenderProvider');
  }
  return context;
}
