import { Clock, MapPin, Calendar } from 'lucide-react';
import React, { useState } from 'react';
import { Evento } from '@/types/api';
import { useRouter } from 'next/router';
// Objeto con los textos para internacionalización
const content = {
    es: {
        buttonText: "Conocé más aquí",
        timeSuffix: "hs.",
        locale: 'es-ES',
        timeNotAvailable: "Hora no disp.",
        imageAlt: "Imagen del evento"
    },
    en: {
        buttonText: "Learn more here",
        timeSuffix: "", // En inglés no se suele usar 'hs.'
        locale: 'en-US',
        timeNotAvailable: "Time N/A",
        imageAlt: "Event Image"
    }
};

export default function CardEventoHome(
    { evento, handleOpenModal = null, isLoading = false }:
        { evento: Evento | null, isLoading: boolean, handleOpenModal: ((evento: Evento) => void) | null }
) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { lang } = router.query;
    const isEnglish = lang === 'EN';

    // Selecciona el conjunto de textos correcto según el idioma
    const currentContent = isEnglish ? content.en : content.es;

    if (isLoading || !evento || handleOpenModal === null) {
        return (
            <div className='embla__slide flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 lg:basis-1/3 pr-4 h-109.5'>
                <div className='flex flex-col h-full items-stretch overflow-hidden'>
                    <div className='relative h-65 mb-3'>
                        <div
                            className='object-cover object-center h-full w-full bg-gray-300 animate-pulse rounded'
                        />
                        <div className='rounded-b-md absolute top-0 left-8 shadow w-auto py-1 px-2 flex justify-center border-b-2 border-l-2 border-r-2 border-zinc-100 bg-gray-500 animate-pulse'>
                            <h4 className='font-bold text-[1.4em] flex items-center gap-1 text-zinc-50'>
                                <Calendar className='font-bold text-lg' size={23} />
                                <div className="w-10 h-4 bg-gray-100 rounded"></div>
                            </h4>
                        </div>
                    </div>
                    <div className='flex-col flex gap-2 mb-1 pt-1 px-1'>
                        <div className="w-7/8 h-6 bg-gray-300 rounded mb-3"></div>
                        <div className='flex items-center gap-2'>
                            <div>
                                <Clock className='font-bold text-lg' size={20} />
                            </div>
                            <div className="w-3/9 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div>
                                <MapPin className='font-bold text-lg' size={20} />
                            </div>
                            <div className="w-3/9 h-4 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                    {/* <div>
                    <div className='shadow-lg w-full bg-primary text-white py-2 text-center'>
                            {currentContent.buttonText}
                    </div>   
                </div> */}
                </div>
            </div>
        )
    }

    const {
        id, // Se asume que el objeto evento tiene un ID
        nombre,
        fechaInicio,
        fechaFin,
        horaInicio,
        imagen,
        direccion,
        nombreLocalidad
    } = evento;

    // Función para formatear la fecha que ahora usa el 'locale' dinámico
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        const day = date.getDate();
        const month = date.toLocaleString(currentContent.locale, { month: 'short' }).toUpperCase().replace('.', '');
        return `${day} ${month}`;
    };

    const formattedStartDate = formatDate(fechaInicio);
    const formattedEndDate = formatDate(fechaFin || '');

    let displayDate;
    if (formattedStartDate === formattedEndDate || !formattedEndDate) {
        displayDate = formattedStartDate;
    } else {
        displayDate = `${formattedStartDate} - ${formattedEndDate}`;
    }

    // Formatear la hora con texto dinámico
    const formattedTime = horaInicio ? `${horaInicio.substring(0, 5)} ${currentContent.timeSuffix}`.trim() : currentContent.timeNotAvailable;
    const handleCloseModal = () => {
        setIsOpen(false);
    };
    return (
        <>
            <div onClick={() => handleOpenModal(evento)} className='embla__slide flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 lg:basis-1/3 pr-4 h-109.5'>
                <div className='flex flex-col h-full items-stretch overflow-hidden'>
                    <div className='relative border h-65'>
                        <img
                            src={process.env.URL_IMG + imagen}
                            className='object-cover object-center h-full w-full'
                            alt={nombre || currentContent.imageAlt}
                        />
                        <div className='rounded-b-md absolute top-0 left-8 shadow bg-primary w-auto py-1 px-2 flex justify-center border-b-2 border-l-2 border-r-2 border-zinc-100'>
                            <h4 className='font-bold text-[1.4em] flex items-center gap-1 text-zinc-50'>
                                <Calendar className='font-bold text-lg' size={23} />
                                {displayDate}
                            </h4>
                        </div>
                    </div>
                    <div className='flex-col flex gap-2 mb-1 pt-1'>
                        <h3 className='font-bold text-left text-3xl line-clamp-2'>{nombre}</h3>
                        <div className='flex items-center gap-2'>
                            <div>
                                <Clock className='font-bold text-lg' size={20} />
                            </div>
                            <span className='font-bold text-[1.1em]'>{formattedTime}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div>
                                <MapPin className='font-bold text-lg' size={20} />
                            </div>
                            <span className='font-bold text-[1.1em]'>{direccion} - {nombreLocalidad}</span>
                        </div>
                    </div>
                    {/* <div>
                    <div className='shadow-lg w-full bg-primary text-white py-2 text-center'>
                            {currentContent.buttonText}
                    </div>   
                </div> */}
                </div>
            </div>
        </>
    );
}