import React from 'react'
import Modal from './common/Modal'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react';
import type { Evento } from '@/types/api';

export default function ModalEvent(
    {
        handleCloseModal,
        event,
        isOpen
    }: {
        handleCloseModal: () => void,
        event: Evento,
        isOpen: boolean
    }
) {
    const [isVerMas, setIsVerMas] = React.useState(false);
    // Función para formatear la fecha
    const formatearFecha = (fechaInicio: string, fechaFin: string) => {
    const crearFechaLocal = (fechaStr: string) => {
        const [year, month, day] = fechaStr.split('-').map(Number);
        // Mes - 1 porque los meses en JS van de 0 a 11
        return new Date(year, month - 1, day);
    };

    const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const fechaInicioObj = crearFechaLocal(fechaInicio);
    const fechaFinObj = crearFechaLocal(fechaFin);

    const fechaInicioFormateada = fechaInicioObj.toLocaleDateString('es-ES', opciones);
    const fechaFinFormateada = fechaFinObj.toLocaleDateString('es-ES', opciones);

    // Si las fechas son diferentes, mostrar rango
    if (fechaInicio !== fechaFin) {
        return `${fechaInicioFormateada} - ${fechaFinFormateada}`;
    }

    return fechaInicioFormateada;
};

    // Función para formatear la hora
    const formatearHora = (horaInicio: string) => {
        return horaInicio.substring(0, 5); // Obtiene HH:MM
    };
    const handleVerMas = () => {
        setIsVerMas(!isVerMas);
    };

    const abrirEnMaps = () => {
        if (!event.latitud || !event.longitud) return null;
        const url = `https://www.google.com/maps?q=${event.latitud},${event.longitud}`;
        return <QRCodeSVG value={url} size={150} bgColor='#ffffff00' fgColor='#fff' />
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            title={event.nombre}
            size="full"
            header={false}
        >
            <div className='w-full'>
                <div className='w-full flex gap-2'>
                    <div className='w-8/14'>
                        <img
                            src={`https://www.tucumanturismo.gob.ar/public/img/${event.imagen}`}
                            className='rounded-xl w-full h-auto object-cover drop-shadow-md'
                            alt={event.nombre}
                        />
                    </div>
                    <div className='w-6/14 px-3 py-1'>
                        <div className='bg-primary rounded-t-xl text-white py-3 px-4 shadow-xl'>
                            <h3 className='font-bold text-3xl'>{event.nombre}</h3>
                        </div>
                        <div className='py-3 px-4 bg-secondary rounded-b-xl text-white flex flex-col gap-3 mb-3 shadow-xl'>
                            <div className='flex items-center gap-2'>
                                <div>
                                    <Calendar className='font-bold text-lg' size={24} />
                                </div>
                                <span className='font-bold text-[1.1em]'>
                                    {formatearFecha(event.fechaInicio, event.fechaFin || '')}
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div>
                                    <Clock className='font-bold text-lg' size={24} />
                                </div>
                                <span className='font-bold text-[1.1em]'>
                                    {formatearHora(event.horaInicio)}
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div>
                                    <MapPin className='font-bold text-lg' size={24} />
                                </div>
                                <span className='font-bold text-[1.1em]'>
                                    {event.direccion}, {event.nombreLocalidad}
                                </span>
                            </div>
                        </div>
                        {event.descripcion && (
                            <div className='mb-4 py-3 px-4 bg-zinc-500 rounded-xl text-white shadow-xl'>
                                <p className='font-bold text-xl text-pretty'>
                                    {isVerMas ? event.descripcion : event.descripcion?.slice(0, 300)}
                                    {event.descripcion?.length > 300 && <span className='text-primary cursor-pointer ps-1 underline' onClick={() => handleVerMas()}>{isVerMas ? 'Ver menos' : 'Ver mas'}</span>}
                                </p>
                            </div>
                        )}
                        <div className='mb-4 py-3 px-4 flex justify-between items-center bg-secondary rounded-xl text-white shadow-xl'>
                            <h3 className='text-xl font-bold'>Ver en Google Maps</h3>
                            <div>{abrirEnMaps()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}