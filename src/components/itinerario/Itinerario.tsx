import React, { useState, useEffect } from 'react';
import { useGetLocalidadesQuery } from '@/store/services/itinerarioApi'; // Ajusta la ruta si es necesario
import type { Localidad } from '@/types/itinerario';

// Se agrega la prop onClick para manejar la interacción del usuario
const LocalidadPill = ({ destino, active, onClick }: { destino: Localidad, active: boolean, onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`text-white text-2xl w-fit px-4 rounded-xl py-2 transition-colors duration-300 font-bold whitespace-nowrap`}
            style={active ? { backgroundColor: 'var(--secondary)' } : { backgroundColor: '#888888' }}
        >
            {destino.nombre}
        </button>
    )
}

export default function Itinerario() {
    const { data: localidadesData, isLoading, isError, error } = useGetLocalidadesQuery({ idioma: "1" });
    
    const [activeLocalidadId, setActiveLocalidadId] = useState<string | null>(null);

    useEffect(() => {
        // Aseguramos que haya datos, que el array no esté vacío y que aún no se haya seleccionado un ID activo.
        if (localidadesData?.result && localidadesData.result.length > 0 && !activeLocalidadId) {
            setActiveLocalidadId(localidadesData.result[0].idSubseccion);
        }
    }, [localidadesData, activeLocalidadId]); // Se ejecuta cuando los datos o el ID activo cambian

    // 4. Manejo de los estados de carga y error
    if (isLoading) {
        return <div>Cargando localidades...</div>;
    }

    if (isError) {
        console.error("Error al cargar las localidades:", error);
        return <div>Ocurrió un error al cargar la información.</div>;
    }
    
    // Obtenemos el array de localidades del objeto de respuesta o un array vacío si no hay datos
    const localidades = localidadesData?.result || [];
    console.log(localidades);
    return (
        <div>
            {/* Contenedor con scroll horizontal para las "píldoras" */}
            <div className='flex gap-3 px-4 overflow-x-auto py-2'>
                {localidades.map((destino) => (
                    <LocalidadPill
                        destino={destino}
                        key={destino.idSubseccion}
                        // La píldora está activa si su ID coincide con el del estado
                        active={destino.idSubseccion === activeLocalidadId}
                        // Al hacer clic, actualizamos el estado con el nuevo ID
                        onClick={() => setActiveLocalidadId(destino.idSubseccion)}
                    />
                ))}
            </div>
            
            <div className='flex mt-4'>
                {/* Aquí puedes mostrar el contenido relacionado con la localidad activa. */}
                {/* Por ejemplo, podrías buscar en el array la localidad cuyo ID coincida con `activeLocalidadId` */}
                {/* y mostrar su información detallada. */}
                <p className='px-4'>Contenido para la localidad con ID: {activeLocalidadId}</p>
            </div>
        </div>
    )
}