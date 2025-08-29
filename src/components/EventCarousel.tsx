// src/components/EventCarousel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Usamos iconos para los botones
import { useGetEventosDestacadosQuery } from '@/store/services/touchApi';
import { Evento } from '@/types/api';

// --- Componente de la Tarjeta de Evento (sin cambios) ---
const EventCard = ({ event }: { event: Evento }) => (
  <div className="embla__slide flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 lg:basis-1/3 pr-4">
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border h-full">
      <div className='w-full'>
        <img src={`https://www.tucumanturismo.gob.ar/public/img/${event.imagen}`} alt={event.nombre} className="w-full h-40 object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg">{event.nombre}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate">{event.direccion} - {event.nombreLocalidad}</p>
        <p className="text-sm text-gray-800 mt-2">
          {event.fechaInicio} al {event.fechaFin}
        </p>
        <p className="text-gray-700 mt-2 text-sm line-clamp-3 flex-grow">{event.descripcion}</p>
      </div>
    </div>
  </div>
);

// --- Componente Principal del Carrusel (con nuevas funcionalidades) ---
const EventCarousel = () => {
  const { data, error, isLoading } = useGetEventosDestacadosQuery();

  // Hook de Embla y el estado para los botones y puntos
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' } as EmblaOptionsType);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Funciones para mover el carrusel, envueltas en useCallback para optimización
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index : number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  // 3. Usamos useEffect para "escuchar" los eventos del carrusel y actualizar nuestro estado
  useEffect(() => {
    if (!emblaApi) return;

    // Esta función se ejecuta cada vez que el carrusel se asienta en un nuevo slide
    const onSelect = (emblaApi: any) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Esta función se ejecuta al inicio y cada vez que el carrusel se recalcula
    const onInit = (emblaApi: any) => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    onInit(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);


  // --- Lógica de renderizado (igual que antes) ---
  if (isLoading) {
    return <div className="text-center p-10">Cargando eventos...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">Error al cargar los eventos.</div>;
  }
  if (!data || data.result.length === 0) {
    return <div className="text-center p-10">No hay eventos para mostrar.</div>;
  }

  // --- JSX con los nuevos controles ---
  return (
    <section className="relative">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-xl font-bold">Eventos Destacados</h2>
        <a href="/eventos" className="text-sm font-semibold text-blue-600 hover:underline">Ver todos</a>
      </div>

      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex p-4">
          {data.result.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Botón Anterior */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
        aria-label="Evento anterior"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      {/* Botón Siguiente */}
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
        aria-label="Siguiente evento"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Puntos de Paginación */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            aria-label={`Ir al evento ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default EventCarousel;