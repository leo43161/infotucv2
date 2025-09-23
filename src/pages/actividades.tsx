import React, { useEffect, useMemo, useState } from 'react'
import { useGetActividadesQuery, useGetPrestadorQuery } from '@/store/services/touchApi';
import { clsx } from 'clsx';
import Paginado from '@/components/common/Paginado';
import CardPrestador from '@/components/actividades/CardPrestador';
import { useI18n } from '@/hooks/useI18n';

export default function actividades() {
  const [search, setSearch] = useState<string>('');
  const { t } = useI18n();
  console.log(search);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  // Calcular el offset basado en la página actual
  const offset = (currentPage - 1) * itemsPerPage;
  const { data: prestadores, isLoading } = useGetPrestadorQuery(
    { search, offset, limit: itemsPerPage },
    {
      refetchOnMountOrArgChange: true
    }
  );
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividadesQuery();
  console.log(prestadores);
  return (
    <div className='h-[1500px] flex justify-between flex-col'>
      <div className="p-5 text-center relative shadow-lg shrink-0 bg-acti">
        <h1 className="text-5xl font-bold text-white">{t('activities.title')}</h1>
      </div>

      <div
        className={clsx(`flex flex-col justify-center relative grow overflow-auto backdrop-brightness-120 pt-4`)}
      >
        <img className='absolute w-full h-full object-cover z-[0] opacity-30 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
        <div className='grow z-[1]'>
          <div className='flex flex-col h-full justify-start'>
            {/* Necesito una card horizontal para alojamientos */}
            <div className='flex flex-col gap-4 py-2 px-8'>
              {prestadores?.result?.map((prestador, index) => (
                <CardPrestador prestador={prestador} key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className='shrink-0 z-[1] pb-5'>
          <Paginado
            currentPage={currentPage}
            totalItems={prestadores?.total || 0}
            itemsPerPage={10}
            onPageChange={(page) => setCurrentPage(page)}
            className=''
            accentColor='var(--primary)'
          ></Paginado>
        </div>
      </div>

      <div className='overflow-hidden flex flex-col justify-end shrink-0'>
        <div className="bg-secondary p-5 text-center relative">
          <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
          <h1 className="text-5xl font-bold text-white">{t('activities.subtitle')}</h1>
        </div>
        <div className='flex flex-wrap '>
          <div
            className={`py-2 px-2 bg-zinc-500 border grow flex-1/4 shrink-0 flex justify-center items-center relative overflow-hidden gap-3`}
            style={{ backgroundColor: search === "" ? "var(--color-acti)" : 'var(--color-zinc-500)' }}
            onClick={() => setSearch("")}
          >
            {/* <img className='h-9 w-auto' src={(process.env.URL_IMG as string) + actividad.imagen} alt="" /> */}
            <h4 className={`font-bold text-zinc-100 z-10 text-3xl`}>{t('activities.all')}</h4>
          </div>
          {actividades?.actividades?.map((actividad, index) => (
            <div
              className={`py-2 px-2 bg-zinc-500 border grow flex-1/4 shrink-0 flex justify-center items-center relative overflow-hidden gap-3`}
              style={{ backgroundColor: search === actividad.nombre ? "var(--color-acti)" : 'var(--color-zinc-500)' }}
              key={index}
              onClick={() => setSearch(actividad.nombre)}
            >
              <img className='h-9 w-auto' src={(process.env.URL_IMG as string) + actividad.imagen} alt="" />
              <h4 className={`font-bold text-zinc-100 z-10 text-3xl`}>{actividad.nombre}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
