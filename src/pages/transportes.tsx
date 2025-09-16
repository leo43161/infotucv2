import { circuitos } from '@/data/circuitos'
import React, { useEffect, useMemo, useState } from 'react'
import { DESTINOS } from '@/data/transportes';
import { useGetColectivosQuery } from '@/store/services/touchApi';
import { Colectivo } from '@/types/api';
import { clsx } from 'clsx';
import Colectivos from '@/components/transportes/Colectivos';

export default function transportes() {
    const [circuitoActivo, setCircuitoActivo] = useState(circuitos[4] ?? null);
    const [destinos, setDestinos] = useState(DESTINOS.sur);
    const [destinoActivo, setDestinoActivo] = useState(destinos[0]);
    const [verMas, setVerMas] = useState(false);
    const [infoDestino, setInfoDestino] = useState<Colectivo[] | null>(null);
    const { data: colectivosData, isLoading, isError } = useGetColectivosQuery();

    const groupedColectivos = useMemo(() => {
        if (!destinoActivo || !colectivosData) return null;

        const colectivosFiltrados = colectivosData.result.filter(
            (c): any => parseInt(c.tiene_Idlugares) === destinoActivo.id
        );

        if (colectivosFiltrados.length === 0) return null;

        const groups = colectivosFiltrados.reduce((acc: any, colectivo: Colectivo) => {
            const key = colectivo.IdAutobus;
            if (!acc[key]) {
                acc[key] = {
                    ...colectivo, // Copia la info base del primer colectivo que encuentra
                    horarios: [],
                };
            }
            // Acumula los horarios de todos los registros para ese IdAutobus
            acc[key].horarios.push({
                Idtiene: colectivo.Idtiene,
                dia: colectivo.dia,
                ida: colectivo.ida,
                vuelta: colectivo.vuelta,
            });
            // Ordena los horarios por el campo 'orden'
            acc[key].horarios.sort((a: any, b: any) => a.orden - b.orden);
            return acc;
        }, {});

        return Object.values(groups) as Colectivo[];
    }, [destinoActivo, colectivosData]);

    useEffect(() => {
        if (groupedColectivos) {
            setInfoDestino(groupedColectivos);
            console.log(groupedColectivos);
        } else {
            setInfoDestino(null);
        }
    }, [groupedColectivos]);
    useEffect(() => {
        if (circuitoActivo) {
            verMas && setVerMas(false);
            const destinosSelected = DESTINOS[circuitoActivo.name as keyof typeof DESTINOS]; //HACK PARA TS
            setDestinos(destinosSelected);
            setDestinoActivo(destinosSelected[0]);
        }
    }, [circuitoActivo])
    useEffect(() => {
        if (verMas) {
            setDestinos(Object.values(DESTINOS).flat());
            setDestinoActivo(Object.values(DESTINOS).flat()[0]);
        } else {
            const destinosSelected = DESTINOS[circuitoActivo.name as keyof typeof DESTINOS];
            setDestinos(destinosSelected);
            setDestinoActivo(destinosSelected[0]);
        }
    }, [verMas])
    return (
        <div className='h-[1500px] flex justify-between flex-col'>
            <div className="bg-secondary p-5 text-center relative shadow-lg shrink-0" style={{ backgroundColor: circuitoActivo?.color || 'var(--color-zinc-500)' }}>
                <h1 className="text-5xl font-bold text-white">{destinoActivo.nombre}</h1>
            </div>
            <div
                className={clsx(`flex justify-start flex-nowrap relative grow overflow-auto p-7 gap-4 backdrop-brightness-120`)}
                style={{ backgroundColor: circuitoActivo?.color || 'var(--color-zinc-500)' }}
            >
                <img className='absolute w-full h-full object-cover z-[0] opacity-30 object-center top-0 left-0' src="/img/header/textura-tucuman.png" alt="" />
                {infoDestino && infoDestino?.length > 0 && (
                    infoDestino.map((colectivo: Colectivo) => (
                        <div className={clsx('z-10 h-full shrink-0 overflow-hidden rounded-xl mx-auto', infoDestino?.length > 3 ? 'w-4/12' : infoDestino?.length === 1 ? 'w-8/12' : 'flex-1')}>
                            <Colectivos data={colectivo} color={circuitoActivo?.color}></Colectivos>
                        </div>
                    ))
                )}
            </div>
            <div className='overflow-hidden flex flex-col justify-end shrink-0'>
                <div className='flex flex-wrap '>
                    {destinos.map((destino, index) => {
                        const color = verMas ? 'var(--primary)' : circuitoActivo?.color || 'var(--color-zinc-500)';
                        return (
                            <div
                                className={`py-2 px-2 bg-zinc-500 border grow flex-1/5 shrink-0 flex justify-center items-center relative overflow-hidden`}
                                style={{ backgroundColor: destinoActivo.id === destino.id ? color : 'var(--color-zinc-500)' }}
                                key={index}
                                onClick={() => setDestinoActivo(destino)}
                            >
                                {/* {destinoActivo.id === destino.id && <img className='absolute w-full h-full object-cover z-[0] opacity-20 transform scale-150 object-center top-0 left-0' src="/img/header/textura-tucuman.png" alt="" />} */}
                                <h4 className={`font-bold text-zinc-100 ${verMas ? 'text-3xl' : 'text-[2.1em]'} z-10`}>{destino.nombre}</h4>
                            </div>
                        )
                    })}
                    <div className='bg-primary py-2 px-5 border grow flex-1/5 shrink-0 flex justify-center items-center' onClick={() => setVerMas(!verMas)}>
                        <h4 className='font-bold text-zinc-100 text-4xl underline'>{verMas ? "Ver menos" : "Ver más"}</h4>
                    </div>
                </div>
                <div className="bg-secondary p-5 text-center relative">
                    <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src="/img/header/textura-tucuman.png" alt="" />
                    <h1 className="text-5xl font-bold text-white">Encuentra tu colectivo en nuestros diferentes circuitos</h1>
                </div>
                <div className="flex flex-wrap justify-between border overflow-hidden">
                    {circuitos.filter((_, index) => index !== 0).map((circuito) => (
                        <div
                            key={circuito.name}
                            className='flex-1 relative'
                        >
                            <button
                                key={circuito.name}
                                className={`p-4 relative text-white font-medium w-full text-4xl shadow flex items-center justify-center transition-transform duration-300 ${circuitoActivo.name === circuito.name ? 'transform scale-102 z-10' : 'opacity-75 hover:opacity-100'
                                    }`}
                                style={{
                                    backgroundColor: circuitoActivo.name === circuito.name ? circuito.color : circuito.color + "b7",
                                    color: circuitoActivo.name === circuito.name ? "#fff" : "#fafafa"
                                }}
                                onClick={() => circuito === circuitoActivo && verMas ? setVerMas(false) : setCircuitoActivo(circuito)}
                            >
                                <img src={"/icons/rutas/" + circuito.logo} className='h-18 w-auto opacity-100 z-10' alt={circuito.nombre} />
                                {/* {circuito.nombre} */}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
