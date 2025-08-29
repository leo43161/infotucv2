import React, { useState, useEffect } from 'react';
import { useGetLocalidadesQuery, useGetDestinosQuery } from '@/store/services/itinerarioApi'; // Ajusta la ruta si es necesario
import type { Localidad } from '@/types/itinerario';
import { useSelector } from 'react-redux';
import CardDestino from './CardDestino';
import { FaFileDownload } from "react-icons/fa";
import { cn } from '@/utils';

// Se agrega la prop onClick para manejar la interacción del usuario
const LocalidadPill = ({ destino, active, onClick, isLoading = false }: { destino: Localidad, active: boolean, onClick: () => void, isLoading?: boolean }) => {
    const Circuitos = useSelector((state: any) => state.itinerarios.value.circuitos);
    const Color = Circuitos.find((c: any) => c.id === parseInt(destino.idcircuitostur))?.color;
    return (
        <button
            onClick={onClick}
            className={cn(`text-white text-2xl px-4 py-2 transition-colors duration-300 font-bold w-full`, isLoading ? "animate-pulse" : "")}
            style={active ? { backgroundColor: Color } : { backgroundColor: '#888888' }}
        >
            {destino.nombre}
        </button>
    )
}
const DestinoSkeleton = () => {
    return (
        <div className="rounded-md shadow-md overflow-hidden bg-gray-400 relative animate-pulse">
            <div className="absolute w-full h-full bg-black opacity-7 z-10 "></div>
            <div className="relative">
                <button
                    className={`rounded-full bg-white p-1 text-[32px] absolute top-2 right-2 border shadow z-30 animate-pulse size-8`}
                >

                </button>
                <div
                    className="w-full h-38 object-cover"
                />
            </div>
            <div className="absolute bottom-0 z-20 w-full pb-4 px-4">
                <div className="h-3 mb-2 font-bold text-zinc-200 text-shadow-lg animate-pulse w-6/7 bg-gray-500 rounded-md"></div>
                <div className="h-3 font-bold text-zinc-200 text-shadow-lg animate-pulse w-5/7 bg-gray-500 rounded-md"></div>
            </div>
        </div>
    )
}

export default function Itinerario() {
    const Circuitos = useSelector((state: any) => state.itinerarios.value.circuitos);
    const { data: localidadesData, isLoading, isError, error } = useGetLocalidadesQuery({ idioma: "1" });
    const [activeLocalidadId, setActiveLocalidadId] = useState<string | null>(null);
    const [localidad, setLocalidad] = useState<Localidad | null | undefined>(null);
    const [colorCircuito, setColorCircuito] = useState<string | null>("#01415c");
    // Usamos 'skip' para evitar que se ejecute la consulta si no hay un ID seleccionado.
    const { data: destinosData, isLoading: isLoadingDestinos, isError: isErrorDestinos } = useGetDestinosQuery(
        { id: activeLocalidadId! }, // El '!' indica a TS que no será null aquí por la opción 'skip'
        { skip: !activeLocalidadId }
    );
    useEffect(() => {
        // Aseguramos que haya datos, que el array no esté vacío y que aún no se haya seleccionado un ID activo.
        if (localidadesData?.result && localidadesData.result.length > 0 && !activeLocalidadId) {
            setActiveLocalidadId(localidadesData.result[0].idSubseccion);
            setLocalidad(localidadesData.result[0]);
        }
        const localidadSelected = localidadesData?.result.find((l: Localidad) => l.idSubseccion === activeLocalidadId);
        setLocalidad(localidadSelected);
        const circuitoColor = Circuitos.find(
            (c: any) => c.id === parseInt(localidadSelected?.idcircuitostur ?? "")
        )?.color
        setColorCircuito(circuitoColor);
    }, [localidadesData, activeLocalidadId]); // Se ejecuta cuando los datos o el ID activo cambian

    if (isError) {
        console.error("Error al cargar las localidades:", error);
        return <div>Ocurrió un error al cargar la información.</div>;
    }

    // Obtenemos el array de localidades del objeto de respuesta o un array vacío si no hay datos
    const localidades = localidadesData?.result || [];
    const destinos = destinosData?.result?.articulos || [];
    return (
        <div className='h-133'>
            <div className="grid grid-cols-7 grid-rows-10 h-full overflow-hidden">
                <div className="col-span-2 col-start-1 row-start-1 relative overflow-hidden">
                    <img className='absolute w-full object-cover z-[2] opacity-20 object-center -top-6/12' src="/img/header/textura-tucuman.png" alt="" />
                    <div className='flex justify-center items-center h-full bg-secondary z-10'>
                        <p className="text-2xl font-bold text-white">Elegí tu destino y planifica tu viaje</p>
                    </div>
                </div>
                <div className="col-span-5 col-start-3 row-start-1" style={{ backgroundColor: colorCircuito || "#01415c" }}>
                    <div className='flex justify-center items-center h-full'>
                        <p className="text-3xl font-bold text-white">
                            {/* {localidad?.nombre || "Elegí tu destino y planifica tu viaje"} */}
                            Haz click para conocer mas informacion sobre tu destino
                        </p>
                    </div>
                </div>
                <div className="col-span-2 row-span-10 col-start-1 row-start-2 h-full">
                    <div className='flex flex-col overflow-y-auto h-full'>
                        {isLoading ?
                            Array.from({ length: 5 }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`text-white text-2xl px-4 py-2 transition-colors duration-300 font-bold w-full animate-pulse bg-[#888888] flex-1`}
                                >
                                </button>
                            ))
                            :
                            localidades.map((destino) => (
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
                </div>
                <div className="col-span-5 row-span-10 col-start-3 row-start-2 overflow-auto relative" /* style={{ backgroundAttachment: "fixed", background: "no-repeat url('/img/header/textura-tucuman.png')" }} */>
                    <div>
                        {(isLoadingDestinos || isLoading)  &&
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-3 py-3">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <DestinoSkeleton key={index} />
                                ))}
                            </div>
                        }

                        {isErrorDestinos &&
                            <div>
                                <p className="text-red-500">Error al cargar los destinos.</p>
                            </div>
                        }

                        {!isLoadingDestinos && !isErrorDestinos && (
                            <>
                                {destinos.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-3 py-3">
                                        {destinos.map((destino) => (
                                            <CardDestino key={destino.idArticulo} destino={destino} colorCircuito={colorCircuito} />
                                        ))}
                                    </div>
                                ) : (
                                    <p></p>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="col-span-7 col-start-1 row-start-12">
                    <div className='h-full w-full flex justify-between items-center text-white px-4 py-2 gap-3' style={{ backgroundColor: colorCircuito || "#01415c" }}>
                        <div className='text-xl font-semibold'>
                            Tu itinerario
                        </div>
                        <div className='flex-1 border-4 rounded-2xl h-full'>
                        </div>
                        <div className='font-semibold flex items-center gap-1.5'>
                            <div>
                                <FaFileDownload size={20}></FaFileDownload>
                            </div>
                            <p className='text-xl underline'>Descargar</p>
                        </div>
                    </div>
                </div>
            </div>





        </div>
    )
}