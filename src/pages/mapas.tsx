import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/utils';
import React, { useState } from 'react'

const maps = [
  {
    id: 1,
    nombre: 'Ciudad Histórica',
    url: 'c-historica.jpg',
    color: '#006B94'
  },
  {
    id: 2,
    nombre: 'Circuito Yungas',
    url: 'c-yungas.jpg',
    color: '#8CA631'
  },
  {
    id: 3,
    nombre: 'Circuito Sur',
    url: 'c-sur.jpg',
    color: '#800077'
  },
  {
    id: 4,
    nombre: 'Circuito Calchaquies',
    url: 'c-calchaqui.jpg',
    color: '#A63413'
  },
  {
    id: 5,
    nombre: 'Circuito Choromoro',
    url: 'c-choromoro.jpg',
    color: '#C88035'
  },
]
export default function mapas() {
  const { t } = useI18n();
  const [destinoActivo, setDestinoActivo] = useState(maps[0]);
  return (
    <div className='h-[1500px] flex justify-between flex-col'>
      <div
        className={cn("p-5 text-center relative shadow-lg shrink-0")}
        style={{ backgroundColor: destinoActivo?.color || 'var(--color-zinc-500)' }}
      >
        <h1 className="text-5xl font-bold text-white">{destinoActivo.nombre}</h1>
      </div>
      <div
        className={cn(
          `flex justify-start flex-nowrap relative grow overflow-auto p-7 gap-4 backdrop-brightness-120`
        )}
      >
        <img
          className='absolute w-full h-full object-cover z-[0] opacity-30 object-center top-0 left-0'
          src="/img/header/textura-tucuman.png"
          alt=""
        />
        <div className='grow z-[1] flex justify-center items-center'>
          <img src={`/img/mapas/${destinoActivo.url}`} className='h-full w-auto' alt={destinoActivo.nombre} />
        </div>
      </div>

      <div className='overflow-hidden flex flex-col justify-end shrink-0'>
        <div className="bg-secondary p-5 text-center relative">
          <img
            className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0'
            src="/img/header/textura-tucuman.png"
            alt=""
          />
          <h1 className="text-5xl font-bold text-white">{t('maps.title')}</h1>
        </div>
        <div className='flex flex-wrap '>
          {[...maps, ...maps].map((mapa, index) => {
            return (
              <div
                key={index}
                className={`py-2 px-2 bg-zinc-500 border grow flex-1/5 shrink-0 flex justify-center items-center relative overflow-hidden`}
                style={{ backgroundColor: destinoActivo.id === mapa.id ? destinoActivo.color : 'var(--color-zinc-500)' }}
                onClick={() => setDestinoActivo(mapa)}
              >
                <h4 className={`font-bold text-zinc-100 text-[2.1em] z-10`}>
                  {mapa.nombre}
                </h4>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
