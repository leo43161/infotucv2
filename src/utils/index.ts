import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const languages = [
  { id: 1, code: 'ES', label: 'Español', flag: (process.env.URL_IMG_LOCAL || '') + '/svg/arg.svg', alt: 'Bandera Argentina' },
  { id: 2, code: 'EN', label: 'English', flag: (process.env.URL_IMG_LOCAL || '') + '/svg/eng.svg', alt: 'Bandera Reino Unido' } // Asumiendo ID 2 para inglés
];

export function cn(...inputs : string[]) {
  return twMerge(clsx(inputs));
}

/**
 * Obtiene el objeto de idioma actual basado en el query param 'lang' de la URL.
 * Si no se encuentra 'lang' o no coincide con ningún idioma, devuelve el idioma por defecto (Español).
 * @param {object} query - El objeto `router.query` de Next.js.
 * @returns {object} El objeto de idioma encontrado o el idioma por defecto.
 * Ejemplo de uso :
 * const router = useRouter();
 * useEffect(() => {
     if (router.isReady) {
       const currentLangObject = getCurrentLanguage(router.query);
       setSelectedLang(currentLangObject);
       setActiveTab(lenguageOptions[currentLangObject.code][0].id);
     }
   }, [router.isReady, router.query]);
 */
export function getCurrentLanguage(query : any) {
  const defaultLanguage = languages[0]; // Español como default
  if (query && query.lang) {
    const langCode = typeof query.lang === 'string' ? query.lang.toUpperCase() : '';
    const found = languages.find(l => l.code === langCode);
    return found || defaultLanguage;
  }
  return defaultLanguage;
}

/**
 * Verifica si el idioma actual (basado en el query param 'lang') es diferente al idioma por defecto (Español).
 * @param {object} query - El objeto `router.query` de Next.js.
 * @returns {boolean} True si el idioma es diferente al por defecto, false en caso contrario.
 */
export function isAlternateLanguage(query : any) {
  const currentLang = getCurrentLanguage(query);
  // Asumimos que el primer idioma en el array 'languages' (ID 1, código 'ES') es el principal/por defecto.
  return currentLang.id !== languages[0].id;
}

/**
 * Obtiene el código del idioma actual (ej. 'ES', 'EN').
 * @param {object} query - El objeto `router.query` de Next.js.
 * @returns {string} El código del idioma actual.
 */
export function getCurrentLanguageCode(query : any) {
  return getCurrentLanguage(query).code;
}

/*
 * Extrae un enlace de Google Maps de un string de HTML.
 *
 * @param {string} htmlString - El string de HTML que puede contener el enlace.
 * @returns {string|null} La URL completa de Google Maps si se encuentra, de lo contrario, null.
 */
export function extractGoogleMapsLink(htmlString : string) {
  // Si el string de entrada no es válido, retorna null inmediatamente.
  if (!htmlString || typeof htmlString !== 'string') {
    return null;
  }

  // Expresión regular para encontrar un atributo href que contenga una URL de Google Maps.
  // Busca específicamente los dominios:
  // - maps.app.goo.gl
  // - www.google.com/maps
  // - google.com/maps
  const regex = /href="(https?:\/\/(?:www\.)?(?:google\.com\/maps|maps\.app\.goo\.gl)[^"]*)"/;

  // Ejecuta la expresión regular sobre el string de HTML.
  const match = htmlString.match(regex);

  // Si se encuentra una coincidencia, match será un array.
  // La URL capturada estará en el índice 1 del array.
  if (match && match[1]) {
    return match[1];
  }

  // Si no se encuentra ninguna coincidencia, retorna null.
  return null;
}