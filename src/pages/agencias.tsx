import React, { useEffect, useMemo, useState } from 'react'
import { useGetActividadesQuery, useGetAgenciasQuery, useGetPrestadorQuery } from '@/store/services/touchApi';
import { clsx } from 'clsx';
import Paginado from '@/components/common/Paginado';
import CardPrestador from '@/components/actividades/CardPrestador';
import { useI18n } from '@/hooks/useI18n';
import CardAgencias from '@/components/agencias/CardAgencias';
import { useOfflineQuery } from '@/hooks/useOfflineQuery';
import { getNameCacheKeyWithArgs } from '@/utils/indexedDB';
import { Agencia, Prestador } from '@/types/api';

export default function agencias() {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Calcular el offset basado en la página actual
  const offset = (currentPage - 1) * itemsPerPage;
  const cacheKey = 'getAgencias?' + getNameCacheKeyWithArgs({ offset, limit: itemsPerPage });
  const { data: agencias, isLoading } = useOfflineQuery(
    useGetAgenciasQuery,
    { offset, limit: itemsPerPage },
    cacheKey,
    { refetchOnMountOrArgChange: true }
  );
  return (
    <div className='container-height flex justify-between flex-col'>
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
              {agencias?.result?.map((prestador : Agencia, index : number) => (
                <CardAgencias agencia={prestador} key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className='shrink-0 z-[1] pb-5'>
          <Paginado
            currentPage={currentPage}
            totalItems={agencias?.total || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            className=''
            accentColor='var(--primary)'
          ></Paginado>
        </div>
      </div>
    </div>
  )
}
