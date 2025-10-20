// src/components/EventCarousel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import { ChevronLeft, ChevronRight, } from 'lucide-react'; // Usamos iconos para los botones
import { useGetEventosDestacadosQuery } from '@/store/services/touchApi';
import EventCard from './EventCard';
import { Evento } from '@/types/api';
import ModalEvent from './ModalEvent';
import Autoplay from 'embla-carousel-autoplay';
import AutoScroll from 'embla-carousel-auto-scroll'
import { useOfflineQuery } from '@/hooks/useOfflineQuery';

// --- Componente Principal del Carrusel (con nuevas funcionalidades) ---
const EventCarousel = () => {
  const { data, error, isLoading } = useOfflineQuery(
    useGetEventosDestacadosQuery,
    null,
    'getEventosDestacados?'
  );
  const [isOpen, setIsOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);


  // Hook de Embla y el estado para los botones y puntos
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' } as EmblaOptionsType , [AutoScroll({stopOnInteraction: false, startDelay: 1500, speed: 1})]);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Funciones para mover el carrusel, envueltas en useCallback para optimización
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  // 3. Usamos useEffect para "escuchar" los eventos del carrusel y actualizar nuestro estado
  useEffect(() => {
    if (!emblaApi) return;

    // Esta función se ejecuta cada vez que el carrusel se asienta en un nuevo slide
    const onSelect = (api: EmblaCarouselType) => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    // Esta función se ejecuta al inicio y cada vez que el carrusel se recalcula
    const onInit = (api: EmblaCarouselType) => {
      setScrollSnaps(api.scrollSnapList());
    };

    onInit(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal = (evento: Evento) => {
    setIsOpen(true);
    setEventoSeleccionado(evento);
  };

  // --- JSX con los nuevos controles ---
  return (
    <>
      <section className="relative">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex px-4 py-2">
            {
              isLoading ? (Array(5).fill(null).map((_, index) => <EventCard key={index} isLoading={true} evento={null} handleOpenModal={null} />))
                :
                (error) ?
                  <div className="text-center p-10 text-red-500">Error al cargar los eventos.</div>
                  :
                  (!data || !data.result || data.result.length === 0) ?
                    <div className="text-center p-10">No hay eventos para mostrar.</div>
                    :
                    data.result.map((evento: Evento) => (
                      <EventCard
                        key={evento.id}
                        evento={evento}
                        handleOpenModal={handleOpenModal}
                        isLoading={isLoading}
                      />
                    ))
            }
          </div>
        </div>

        {/* Botón Anterior */}
        <button
          onClick={scrollPrev}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
          aria-label="Evento anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Botón Siguiente */}
        <button
          onClick={scrollNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
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
              className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              aria-label={`Ir al evento ${index + 1}`}
            />
          ))}
        </div>
      </section>
      {eventoSeleccionado && isOpen && (
        <ModalEvent
          event={eventoSeleccionado}
          isOpen={true}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default EventCarousel;