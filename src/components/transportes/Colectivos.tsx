// components/Colectivos.js
"use client";
import { useEffect, useState } from 'react';
import { Bus, Ticket, User, Phone, MapPin, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Colectivo } from '@/types/api';
import { FaBus } from 'react-icons/fa';

const Colectivos = ({ data, color }: { data: any, color: string }) => {
    console.log(data);
    const [activeTab, setActiveTab] = useState(data.horarios[0].dia);
    const activeHorario = data.horarios.find((h: any) => h.dia === activeTab);

    const formatTimes = (times: string) => {
        if (!times) return [];
        return times.split(',').map(t => t.trim());
    };

    useEffect(() => {
        setActiveTab(data.horarios[0].dia);
    }, [data]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full mx-auto border border-gray-100 z-10 overflow-auto h-full">
            {/* Encabezado con Destino y Empresa */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center text-gray-800 gap-3">
                        <FaBus className="size-12" />
                        <span className="text-5xl font-bold text-gray-800">{data.Empresa}</span>
                    </div>
                </div>
            </div>

            {/* Información Clave */}
            <div className="flex flex-col gap-4 mb-8 text-sm">
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <MapPin className="size-7 mr-3 text-gray-500" />
                    <div className='z-[1]'>
                        <p className="font-bold text-gray-700 text-2xl">Plataforma</p>
                        <p className="text-gray-600">{data.Plataforma}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <Ticket className="size-7 mr-3 text-gray-500" />
                    <div>
                        <p className="font-bold text-gray-700 text-2xl">Precios</p>
                        <p className="text-gray-600">{data.Precio}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <Phone className="size-7 mr-3 text-gray-500" />
                    <div>
                        <p className="font-bold text-gray-700 text-2xl">Contacto</p>
                        <p className="text-gray-600">{data.telefono}</p>
                    </div>
                </div>
            </div>

            {/* Pestañas de Días */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-4 overflow-x-auto">
                    {data.horarios.map((horario: any) => (
                        <button
                            key={horario.Idtiene}
                            onClick={() => setActiveTab(horario.dia)}
                            className={clsx(
                                "py-3 px-1 whitespace-nowrap border-b-3 font-bold text focus:outline-none text-xl",
                                activeTab === horario.dia
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            )}
                        >
                            {horario.dia}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenido de Horarios */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeHorario && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Horarios de Ida */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <ArrowRight className="size-7 text-primary mr-2" />
                                    <h3 className="font-bold text-lg text-gray-700">Horarios de Ida</h3>
                                </div>
                                {formatTimes(activeHorario.ida).length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {formatTimes(activeHorario.ida).map((time, index) => (
                                            <span key={index} className="bg-primary/10 text-primary font-mono text-sm px-3 py-1.5 rounded gap-1 flex items-center font-bold">
                                                <Clock className="inline w-4 h-4" />{time}
                                            </span>
                                        ))}
                                    </div>
                                ) : <p className="text-gray-500 italic text-sm">No hay salidas para este día.</p>}
                            </div>

                            {/* Horarios de Vuelta */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <ArrowLeft className="size-7 text-secondary mr-2" />
                                    <h3 className="font-bold text-lg text-gray-700">Horarios de Vuelta</h3>
                                </div>
                                {formatTimes(activeHorario.vuelta).length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {formatTimes(activeHorario.vuelta).map((time, index) => (
                                            <span key={index} className="bg-secondary/10 text-secondary font-mono text-sm px-3 py-1.5 rounded gap-1 flex items-center font-bold">
                                                <Clock className="inline w-4 h-4" />{time}
                                            </span>
                                        ))}
                                    </div>
                                ) : <p className="text-gray-500 italic text-sm">No hay regresos para este día.</p>}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Colectivos;