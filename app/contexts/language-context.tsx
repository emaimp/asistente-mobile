import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '@/hooks/use-translation';

const LANGUAGE_KEY = 'language';

// Interfaz del contexto de idioma
interface LanguageContextType {
  t: (key: string, fallback?: string) => string;
  currentLanguage: string;
  setLanguage: (language: string) => Promise<void>;
}

// Crear el contexto, inicialmente undefined
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Props del proveedor de idioma
interface LanguageProviderProps {
  children: ReactNode;
}

// Proveedor del contexto de idioma
export function LanguageProvider({ children }: LanguageProviderProps) {
  // Estado del idioma actual, por defecto 'a' (inglés)
  const [currentLanguage, setCurrentLanguageState] = useState<string>('a');
  // Función de traducción basada en el idioma actual
  const { t } = useTranslation(currentLanguage);

  // Cargar idioma desde AsyncStorage al montar el componente
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage) {
          setCurrentLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error('Error al cargar el idioma:', error);
      }
    };

    loadLanguage();
  }, []);

  // Función para cambiar el idioma y guardarlo en AsyncStorage
  const setLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      setCurrentLanguageState(language);
    } catch (error) {
      console.error('Error al guardar el idioma:', error);
    }
  };

  // Proporcionar el contexto a los hijos
  return (
    <LanguageContext.Provider value={{ t, currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook para usar el contexto de idioma
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider');
  }
  return context;
}
