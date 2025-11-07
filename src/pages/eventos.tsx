import React, { useState } from 'react'
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/utils';
import { getNameCacheKeyWithArgs } from '@/utils/indexedDB';
import { useGetEventosQuery } from '@/store/services/touchApi';
import { useOfflineQuery } from '@/hooks/useOfflineQuery';
import { Evento } from '@/types/api';
import CardEvento from '@/components/eventos/EventCard';
import Paginado from '@/components/common/Paginado';
import ModalEvent from '@/components/ModalEvent';

export default function eventos() {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const itemsPerPage = 9;

  const offset = (currentPage - 1) * itemsPerPage;
  const diaOptions = [
    { value: "todos", label: t('events.all_events') },
    { value: "hoy", label: t('events.today_event') },
    { value: "manana", label: t('events.tomorrow_event') }
  ];
  const [dia, setDia] = useState("");
  const cacheKey = 'getEventos?' + getNameCacheKeyWithArgs({ Dia: dia, offset, limit: itemsPerPage });
  const { data: eventos, isLoading } = useOfflineQuery(
    useGetEventosQuery,
    { Dia: dia, offset, limit: itemsPerPage },
    cacheKey,
    { refetchOnMountOrArgChange: true }
  );

  
  console.log(eventos);
  const handleOpenModal = (evento: Evento) => {
    setIsOpen(true);
    setEventoSeleccionado(evento);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className='container-height flex justify-between flex-col overflow-hidden'>
        <div className="bg-events p-5 text-center relative shrink-0">
          <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
          <h1 className="text-5xl font-bold text-white">{t('events.title')}</h1>
        </div>
        <div
          className={`flex flex-col justify-between relative grow backdrop-brightness-120`}
        >
          <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
          <div className='grow z-[1]'>
            {/* Necesito una card horizontal para alojamientos */}
            <div className='grid grid-cols-3 gap-4 py-6 px-8'>
              {eventos?.result?.map((evento: Evento) => (
                <CardEvento key={evento.id} handleOpenModal={handleOpenModal} evento={evento} />
              ))}
            </div>
          </div>
          <div className='shrink-0 flex flex-col'>
            <div className='z-[1] w-10/12 mx-auto'>
              <div className='flex flex-row justify-center gap-5'>
                {/* Categorías */}
                {diaOptions.map((option, index) => (
                  <div key={index} className='flex flex-col w-80'>
                    <button
                      className={cn("w-full px-6 py-4 bg-secondary border text-center text-3xl font-medium text-zinc-50 flex justify-between items-center min-h-[70px] hover:bg-secondary/90 active:bg-secondary/90 transition-colors shadow-sm", dia === option.value ? 'bg-primary' : '')}
                      onClick={() => setDia(dia === option.value ? '' : option.value)}
                    >
                      <span className={dia === option.value ? 'text-zinc-50 font-bold' : 'text-zinc-50'}>
                        {option.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className='shrink-0 z-[1]'>
              <Paginado
                currentPage={currentPage}
                totalItems={eventos?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                className='my-10'
                accentColor='var(--primary)'
              ></Paginado>
            </div>
          </div>
        </div>
      </div>
      {eventoSeleccionado && isOpen && (
        <ModalEvent
          event={eventoSeleccionado}
          isOpen={true}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  )
}
