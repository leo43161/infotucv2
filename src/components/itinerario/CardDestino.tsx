import React from 'react'
import type { Destino } from '@/types/itinerario';

export default function CardDestino({ destino }: { destino: Destino }) {
  // La URL base para las imágenes, ya que la API devuelve rutas relativas.
  const imageBaseUrl = 'https://www.tucumanturismo.gob.ar/public/img/';

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      <img
        src={`${imageBaseUrl}${destino.imagen}`}
        alt={`Imagen de ${destino.nombre}`}
        className="w-full h-35 object-cover"
      />
      <div className="px-3 py-2">
        <h3 className="text-xl font-bold mb-2">{destino.nombre}</h3>
      </div>
    </div>
  );
}
