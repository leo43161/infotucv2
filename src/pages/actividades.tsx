import { circuitos } from '@/data/circuitos'
import React, { useEffect, useMemo, useState } from 'react'
import { DESTINOS } from '@/data/transportes';
import { useGetColectivosQuery } from '@/store/services/touchApi';
import { Colectivo } from '@/types/api';
import { clsx } from 'clsx';
import Colectivos from '@/components/transportes/Colectivos';

export default function actividades() {
  return (
    <div className='h-[1500px] flex justify-between flex-col'>
      <div className="p-5 text-center relative shadow-lg shrink-0 bg-acti">
        <h1 className="text-5xl font-bold text-white">Selecciona un prestador que mas se adeque a tus necesidades</h1>
      </div>

      <div
        className={clsx(`flex justify-start flex-nowrap relative grow overflow-auto p-7 gap-4 backdrop-brightness-120`)}
      >
        <img className='absolute w-full h-full object-cover z-[0] opacity-30 object-center top-0 left-0' src="/img/header/textura-tucuman.png" alt="" />
      </div>

      <div className='overflow-hidden flex flex-col justify-end shrink-0'>
        <div className="bg-secondary p-5 text-center relative">
          <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src="/img/header/textura-tucuman.png" alt="" />
          <h1 className="text-5xl font-bold text-white">Selecciona la actividad que te gustaria realizar</h1>
        </div>
        <div className='flex flex-wrap '>
          {Array.from({ length: 15 }, (_, index) => (
            <div
              className={`py-2 px-2 bg-zinc-500 border grow flex-1/5 shrink-0 flex justify-center items-center relative overflow-hidden gap-2`}
              style={{ backgroundColor: index === 0 ? "var(--color-acti)" : 'var(--color-zinc-500)' }}
              /* key={index} */
              onClick={() => console.log("destino")}
            >
              <div className='w-2/14'>
                <img className='w-full' src={process.env.URL_IMG + "altamontana.png"} alt="" />
              </div>
              <h4 className={`font-bold text-zinc-100 z-10 text-2xl`}>Alta Montaña</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
