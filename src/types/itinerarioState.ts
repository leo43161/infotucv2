// src/types/itinerarioState.ts

// Describe la forma de un único objeto de circuito
export interface Circuito {
  id: number;
  name: string;
  nombre: string;
  logo: string;
  img: string;
  color: string;
  bg: string;
  mb: string;
}

// Describe la estructura de los favoritos, usando 'key' dinámicas
export interface Favoritos {
  [key: string]: {
    destinos: any[]; // Puedes reemplazar 'any' por un tipo más específico si lo tienes
    alojamientos: any[];
    prestadores: any[];
    guias: any[];
  };
}

// Describe la forma completa del estado de este slice
export interface ItinerariosState {
  circuitos: Circuito[];
  circuitosEN: Circuito[];
  circuitosEN_ES: { [key: number]: number };
  circuitoSelected: Circuito;
  activeComponent: 'destinos' | 'alojamientos' | 'prestadores' | 'guias';
  favoritos: Favoritos;
  total: number;
  progress: number;
}