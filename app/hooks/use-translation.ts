import { useState, useEffect, useCallback } from 'react';

// Import all translation files
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';
import jaTranslations from '@/locales/ja.json';
import zhTranslations from '@/locales/zh.json';

// Translation files map
const translations = {
  a: enTranslations,
  e: esTranslations,
  j: jaTranslations,
  z: zhTranslations,
};

export function useTranslation(language: string) {
  const [currentTranslations, setCurrentTranslations] = useState(enTranslations);

  // Update translations when language changes
  useEffect(() => {
    const langTranslations = translations[language as keyof typeof translations] || enTranslations;
    setCurrentTranslations(langTranslations);
  }, [language]);

  // Translation function
  const t = useCallback((key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = currentTranslations;

    // Navigate through nested object
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return fallback || key;
      }
    }

    return typeof value === 'string' ? value : fallback || key;
  }, [currentTranslations]);

  return { t };
}
