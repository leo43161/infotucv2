import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/utils';
import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { Download, FileText } from 'lucide-react';

const maps = [
  {
    id: 1,
    nombre: 'Ciudad Histórica',
    img: ['historica-2025.jpg'],
    url: 'historica-2025.pdf',
    color: '#007A6B'
  },
  {
    id: 2,
    nombre: 'Circuitos Turisticos',
    img: ['circuitos-2025.jpg'],
    url: 'circuitos-2025.pdf',
    color: '#093843'
  },
  {
    id: 3,
    nombre: 'Circuito Yungas',
    img: ['yungas-2025.jpg'],
    url: 'yungas-2025.pdf',
    color: '#A3B143'
  },
  {
    id: 4,
    nombre: 'Circuito Calchaquies',
    img: ['calchaqui-2025.jpg'],
    url: 'calchaqui-2025.pdf',
    color: '#DC3227'
  },
  {
    id: 5,
    nombre: 'Circuito Choromoro',
    img: ['choromoro-2025.jpg'],
    url: 'choromoro-2025.pdf',
    color: '#F68E33'
  },
  {
    id: 6,
    nombre: 'Circuito Sur',
    img: ['sur-2025.jpg'],
    url: 'sur-2025.pdf',
    color: '#A92183'
  },
  {
    id: 7,
    nombre: 'Circuito Jesuitas',
    img: ['jesuita.jpg'],
    url: 'jesuita.pdf',
    color: '#E45A5B'
  },
  {
    id: 8,
    nombre: 'Ruta del Azucar',
    img: ['azucar-2025.jpg'],
    url: 'azucar-2025.pdf',
    color: '#A63413'
  },
  {
    id: 9,
    nombre: 'Turismo Rural',
    img: ['rural1.jpg', 'rural2.jpg'],
    url: 'rural-comunitario-2025.pdf',
    color: '#64050D'
  },
  /* {
    id: 10,
    nombre: 'Circuito Este',
    img: ['este-2025.jpg'],
    url: 'este-2025.pdf',
    color: '#00A26F'
  }, */
]

export default function mapas() {
  const { t } = useI18n();
  const [destinoActivo, setDestinoActivo] = useState(maps[0]);

  // Construir la URL completa del PDF
  const pdfUrl = process.env.URL_WEB + `public/pdf/${destinoActivo.url}`;

  return (
    <div className='container-height flex justify-between flex-col '>
      <div
        className={cn("p-5 text-center relative shadow-lg shrink-0")}
        style={{ backgroundColor: destinoActivo?.color || 'var(--color-zinc-500)' }}
      >
        <h1 className="text-5xl font-bold text-white">{destinoActivo.nombre}</h1>
      </div>

      <div
        className={cn(
          `flex justify-start flex-nowrap relative grow overflow-auto p-7 gap-4 backdrop-brightness-120 bg-fixed bg-cover`,
        )}
        style={{ backgroundImage: `url(${process.env.URL_IMG_TOUCH}/img/header/textura-tucuman.png)` }}
      >

        {/* Contenedor principal con imagen y QR */}
        <div className='w-6/9 z-[1] flex gap-6 pe-2'>
          {/* Área de imágenes */}
          <div className='flex-1 flex flex-col justify-start items-center'>
            {destinoActivo.img?.map((img, index) => {
              return (
                <img
                  key={index}
                  src={process.env.URL_TOUCH + `img/mapas/${img}`}
                  className='h-auto w-full'
                  alt={destinoActivo.nombre + index}
                />
              )
            })}
          </div>
        </div>
      </div>
      <div className='absolute bottom-80 right-10 z-10 h-[1070px]'>
        {/* Panel lateral con QR */}
        <div className='w-80 flex flex-col items-center justify-center bg-white/95 backdrop-blur rounded-xl px-4 py-6 shadow-lg border-2 h-full' style={{ borderColor: destinoActivo.color }}>
          <div className='flex items-center gap-3 mb-4'>
            <FileText className="size-8" style={{ color: destinoActivo.color }} />
            <h3 className="text-2xl font-bold text-gray-800">
              {t('maps.downloadPdf') || 'Descargar PDF'}
            </h3>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <QRCodeSVG
              value={pdfUrl}
              size={170}
              level="L"
              includeMargin={false}
              bgColor='#ffffff'
              fgColor={destinoActivo.color}
            />

            <p className='text-center text-gray-700 text-lg font-medium'>
              {t('maps.scanToDownload') || 'Escanea para descargar el mapa'}
            </p>

            <div className='flex items-center gap-2 px-4 py-2 rounded-lg'
              style={{ backgroundColor: destinoActivo.color + '15', color: destinoActivo.color }}>
              <Download className="size-5" />
              <span className="font-semibold text-sm">
                {destinoActivo.nombre}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='overflow-hidden flex flex-col justify-end shrink-0'>
        <div className="bg-secondary p-5 text-center relative">
          <img
            className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0'
            src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"}
            alt=""
          />
          <h1 className="text-5xl font-bold text-white">{t('maps.title') || 'Selecciona el mapa que necesitas'}</h1>
        </div>
        <div className='flex flex-wrap'>
          {maps.map((mapa, index) => {
            return (
              <div
                key={index}
                className={`py-2 px-2 bg-zinc-500 border grow flex-1/4 shrink-0 flex justify-center items-center relative overflow-hidden cursor-pointer transition-all duration-200 hover:brightness-110`}
                style={{ backgroundColor: destinoActivo.id === mapa.id ? destinoActivo.color : 'var(--color-zinc-500)' }}
                onClick={() => setDestinoActivo(mapa)}
              >
                <h4 className={`font-bold text-zinc-100 text-[2.1em] z-10 text-center`}>
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
