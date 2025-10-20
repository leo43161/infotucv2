// RUTA: src/components/InitialLoader.tsx

import { useEffect, useState } from 'react';
import { getData, saveData } from '@/utils/indexedDB';

const INITIAL_LOAD_KEY = 'app-initial-load-complete';
const URL_BASE = 'https://www.tucumanturismo.gob.ar/api/v1/api';

// ✅ LISTA COMPLETA DE ENDPOINTS CRÍTICOS
const criticalEndpoints = [
  { key: "app-initial-load-complete", url: `${URL_BASE}/eventos_destacados`, description: "Carga inicial completada" },
  { key: "getActividades", url: `${URL_BASE}/actividades`, description: "Obtener lista de actividades" },
  { key: "getPrestador?search=&offset=&limit=4", url: `${URL_BASE}/prestadores?search=&offset=8&limit=4`, description: "Buscar actividades con paginación" },
  { key: "getAgencias?offset=&limit=5", url: `${URL_BASE}/agencias?offset=&limit=5`, description: "Obtener lista de agencias" },
  { key: "getAutos?offset=&limit=6", url: `${URL_BASE}/autos?offset=&limit=6`, description: "Obtener lista de autos" },
  { key: "getColectivos?", url: `${URL_BASE}/colectivos`, description: "Obtener lista de colectivos" },
  { key: "getDestinos?id=108", url: `${URL_BASE}/subseccion/108`, description: "Obtener información del destino con ID 108" },
  { key: "getDestinos?id=110", url: `${URL_BASE}/subseccion/110`, description: "Obtener información del destino con ID 110" },
  { key: "getEventosDestacados?", url: `${URL_BASE}/eventos_destacados`, description: "Obtener eventos destacados" },
  { key: "getGalleryDestino?id=507", url: `${URL_BASE}/galeria_art/507/galeria`, description: "Obtener galería del destino con ID 507" },
  { key: "getGalleryDestino?id=514", url: `${URL_BASE}/galeria_art/514/galeria`, description: "Obtener galería del destino con ID 514" },
  { key: "getHoteles?categoria=&estrellas=&localidad=&offset=&limit=4", url: `${URL_BASE}/hoteles?categoria=&estrellas=&localidad=&offset=&limit=4`, description: "Obtener hoteles con filtros y paginación" },
  { key: "getHoteles?categoria=&estrellas=&localidad=&offset=4&limit=4", url: `${URL_BASE}/hoteles?categoria=&estrellas=&localidad=&offset=4&limit=4`, description: "Obtener más hoteles (siguiente página)" },
  { key: "getHotelesFilters?", url: `${URL_BASE}/alojamientos_filters`, description: "Obtener filtros disponibles para hoteles" },
  { key: "getLocalidades?", url: `${URL_BASE}/localidades`, description: "Obtener lista de localidades" },
  { key: "getPrestador?search=&offset=&limit=4", url: `${URL_BASE}/prestadores?search=&offset=&limit=4`, description: "Buscar prestadores con paginación" },
  { key: "getRestaurantes?categoria=&localidad=&offset=&limit=4", url: `${URL_BASE}/restaurantes?categoria=&localidad=&offset=&limit=4`, description: "Obtener lista de restaurantes con filtros" }
];

export default function InitialLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Iniciando carga...');

  useEffect(() => {
    async function checkAndLoad() {
      // La verificación en localStorage/IndexedDB previene que se vuelva a ejecutar innecesariamente.
      const hasLoaded = await getData(INITIAL_LOAD_KEY);
      if (hasLoaded) {
        onComplete();
        return;
      }

      for (let i = 0; i < criticalEndpoints.length; i++) {
        const endpoint = criticalEndpoints[i];
        setCurrentTask(`Cargando ${endpoint.description}...`); // Actualiza el mensaje para el usuario

        try {
          const response = await fetch(endpoint.url);
          if (response.ok) {
            const data = await response.json();
            // Guardar explícitamente en IndexedDB
            await saveData(endpoint.key, data);
          }
        } catch (error) {
          console.error(`Error inicializando ${endpoint.key}:`, error);
          // Opcional: Podrías implementar una lógica de reintento o simplemente continuar
        }
        setProgress(((i + 1) / criticalEndpoints.length) * 100);
      }
      await saveData(INITIAL_LOAD_KEY, true);
      onComplete();
    }
    checkAndLoad();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-end justify-end z-50 text-white border-2 border-black pe-8 pb-25">
      <div className='p-4 rounded-2xl bg-secondary'>
        <div className="w-80 h-4 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-lg">{currentTask}</p>
        <p className="text-2xl font-bold mt-1">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}