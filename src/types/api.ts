// src/types/api.ts

/**
 * =================================================================
 * TIPOS PARA LOS ARGUMENTOS DE CONSULTA DE LOS ENDPOINTS
 * =================================================================
 *
 * Definimos la forma de los parámetros que podemos enviar a la API.
 * Hacemos opcionales todos los campos con '?' porque mencionaste
 * que la API funciona con valores por defecto si no se envían.
 */
export type DayQueryOption = "hoy" | "mañana" | "";
export interface EventosQueryArgs {
  Busqueda?: string;
  Dia?: DayQueryOption;
  FechaIni?: string;
  FechaFin?: string;
  offset?: number;
  limit?: number;
}
export interface HotelesQueryArgs {
  search?: string;
  categoria?: number | string;
  estrellas?: number | string;
  localidad?: number | string;
  offset?: number;
  limit?: number;
}

export interface RestaurantesQueryArgs {
  search?: string;
  localidad?: number | string;
  categoria?: number | string;
  offset?: number;
  limit?: number;
}


/**
 * =================================================================
 * TIPOS PARA LAS ENTIDADES PRINCIPALES (Hotel, Restaurante, etc.)
 * =================================================================
 *
 * Estos son los "contratos" que describen cada objeto individual
 * que recibimos de la API.
 */

export interface Evento {
  id: string;
  nombre: string;
  fechaFin: string| null;
  fechaInicio: string;
  horaInicio: string;
  descripcion: string| null;
  url: string | null;
  imagen: string;
  direccion: string | null;
  idLocalidad: string;
  latitud: string | null;
  longitud: string | null;
  nombreLocalidad: string;
  nombreCategoria: string;
  idCategoria: string;
  idSubcat: string;
  subCategoriaNombre: string;
  // Añadimos las propiedades que, aunque no las usemos, existen en la respuesta
  // ... y cualquier otra propiedad que consideres relevante
}
export interface Hotel {
  id: string;
  nombre: string;
  estrellas: string;
  domicilio: string;
  logo: string;
  portada: string | null;
  descripcion: string;
  web: string | null;
  latitud: string;
  longitud: string;
  localidad: string;
  email: string | null;
  telefono_final: string | null;
  // Añadimos las propiedades que, aunque no las usemos, existen en la respuesta
  visible: string;
  activo: string;
  // ... y cualquier otra propiedad que consideres relevante
}

export interface Restaurante {
  idGastronomia: string;
  nombre: string;
  direccion: string;
  imagen: string;
  horarios: string;
  servicios: string;
  telefono: string;
  latitud: string;
  longitud: string;
  nombreLocalidad: string;
  nombreCategoria: string;
  // ...
}

export interface Category {
  id: string;
  nombre: string;
  name: string; // La API devuelve tanto 'nombre' como 'name'
  fcreacion: string;
}


/**
 * =================================================================
 * TIPOS PARA LAS RESPUESTAS COMPLETAS DE LA API
 * =================================================================
 *
 * Describen la estructura completa del JSON que devuelve cada endpoint.
 */

export interface HotelesApiResponse {
  status: number;
  result: Hotel[];
  // El endpoint de hoteles no parece devolver 'total' en el nivel raíz,
  // sino dentro de cada objeto. Lo dejamos así para ser fieles a la API.
}

export interface EventosApiResponse {
  status: number;
  result: Evento[];
  total: string;
}

export interface EventosDestacadosApiResponse {
  status: number;
  result: Evento[];
}

export interface RestaurantesApiResponse {
  status: number;
  result: Restaurante[];
  total: string;
  categorias: Category[];
}