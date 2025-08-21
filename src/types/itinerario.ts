export interface DestinosQueryArgs {
  id?: string;
}
export interface LocalidadesQueryArgs {
  id?: string;
  idioma?: string;
}

export interface Destino {
  idArticulo: string;
  nombre: string;
  copete: string;
  cuerpo: string;
  imagen: string;
  imagenMovil: string | null;
  imagenTexto: string | null;
  pieImagen: string | null;
  video: string;
  idioma: string;
  tags: string;
  iframe: string | null;
  // Añadimos las propiedades que, aunque no las usemos, existen en la respuesta
  visible: string;
  activo: string;
  // ... y cualquier otra propiedad que consideres relevante
}

export interface Subseccion {
  idArticulo: string;
  idcircuitostur: string;
  nombre: string;
  copete: string;
  cuerpo: string;
  imagen: string;
  imagenMovil: string | null;
  imagenTexto: string | null;
  pieImagen: string | null;
  video: string;
  idioma: string;
  tags: string;
  iframe: string | null;
  // Añadimos las propiedades que, aunque no las usemos, existen en la respuesta
  visible: string;
  activo: string;
  // ... y cualquier otra propiedad que consideres relevante
}
export interface Localidad {
  idSubseccion: string;
  idcircuitostur: string;
  nombre: string;
  portada: string;
  portadaMovil: string;
  orden?: string;
  // Añadimos las propiedades que, aunque no las usemos, existen en la respuesta
  visible: string;
  activo: string;
  // ... y cualquier otra propiedad que consideres relevante
}



export interface DestinosApiResponse {
  status: number;
  result: {
    articulos: Destino[],
    subseccion: Subseccion
  };
  // El endpoint de hoteles no parece devolver 'total' en el nivel raíz,
  // sino dentro de cada objeto. Lo dejamos así para ser fieles a la API.
}

export interface LocalidadesApiResponse {
  status: number;
  result: Localidad[];
  // El endpoint de hoteles no parece devolver 'total' en el nivel raíz,
  // sino dentro de cada objeto. Lo dejamos así para ser fieles a la API.
}