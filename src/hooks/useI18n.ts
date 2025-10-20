// src/hooks/useI18n.ts
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCurrentLanguage } from '@/utils';

// Tipos para las traducciones
export interface Translations {
  [key: string]: string | Translations;
}

// Función para obtener valor anidado con notación de punto
function getNestedTranslation(obj: Translations, path: string): string {
  return path.split('.').reduce((current: any, key: string) => {
    return current && current[key] !== undefined ? current[key] : path;
  }, obj) as string;
}

export function useI18n() {
  const router = useRouter();
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Obtener el idioma actual
  const currentLanguage = getCurrentLanguage(router.query);
  const locale = currentLanguage.code.toLowerCase(); // 'es' o 'en'

  // Cargar traducciones cuando cambie el idioma
  useEffect(() => {
    if (router.isReady) {
      loadTranslations(locale);
    }
  }, [router.isReady, locale]);

  const loadTranslations = async (lang: string) => {
    setIsLoading(true);
    try {
      // Importar dinámicamente el archivo de traducción
      const translations = await import(`@/locales/${lang}.json`);
      setTranslations(translations.default || translations);
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      // Fallback a español si falla
      if (lang !== 'es') {
        try {
          const fallbackTranslations = await import(`@/locales/es.json`);
          setTranslations(fallbackTranslations.default || fallbackTranslations);
        } catch (fallbackError) {
          console.error('Error loading fallback translations:', fallbackError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para traducir
  const t = (key: string, fallback?: string): string => {
    if (isLoading) return fallback || '---------';
    
    const translation = getNestedTranslation(translations, key);
    return typeof translation === 'string' ? translation : (fallback || key);
  };

  // Función para cambiar idioma
  const changeLanguage = (newLocale: string) => {
    const langCode = newLocale.toUpperCase();
    const currentPath = router.asPath.split('?')[0]; // Remover query params existentes
    // Construir nueva URL con parámetro lang
    const newQuery = { ...router.query, lang: langCode };
    
    router.push({
      pathname: currentPath,
      query: newQuery
    });
  };

  return {
    t,
    locale,
    currentLanguage,
    isLoading,
    changeLanguage,
    translations
  };
}