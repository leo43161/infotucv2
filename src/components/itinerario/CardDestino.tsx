import React, { useEffect, useState } from 'react'
import type { Destino } from '@/types/itinerario';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { LuCheck, LuPlus } from 'react-icons/lu';
import { setFavorito } from '@/store/features/itinerarioSlice';
import Modal from '../common/Modal';
import Image from 'next/image';
import { Check, Plus } from 'lucide-react';
import { useGetGaleryDestinoQuery } from '@/store/services/itinerarioApi';
import ImageGallery from './ImageGallery';

export default function CardDestino({ destino, colorCircuito }: { destino: Destino, colorCircuito: string | null }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [isModalFavorite, setIsModalFavorite] = useState(false);

  const [destinoSeleccionado, setDestinoSeleccionado] = useState<Destino | null>(null);
  const { circuitos, favoritos } = useSelector((state: any) => state.itinerarios.value);
  const imageBaseUrl = 'https://www.tucumanturismo.gob.ar/public/img/';

  const { data: galery, error: errorGalery, isLoading: isLoadingGalery, isFetching: isFetchingGalery } = useGetGaleryDestinoQuery({
    id: destinoSeleccionado?.idArticulo
  }, {
    skip: !destinoSeleccionado,
    refetchOnMountOrArgChange: true
  });

  const circuitoSelected = circuitos.find((c: any) => c.id === parseInt(destino.idcircuitostur ?? "5"));
  const isFavorite = favoritos[circuitoSelected.name]?.destinos.find((item: any) => item.id === destino.idArticulo);

  useEffect(() => {
    if (destinoSeleccionado && favoritos && circuitoSelected?.name) {
      const isFav = !!favoritos[circuitoSelected.name]?.destinos.find(
        (item: Destino) => item.id === destinoSeleccionado.idArticulo
      );
      setIsModalFavorite(isFav);
    }
  }, [destinoSeleccionado, favoritos, circuitoSelected]);
  const actualizarFavoritos = (item: Destino) => {
    dispatch(setFavorito({ type: 'destinos', item, idCircuito: circuitoSelected.id }));
  };
  const handleOpenModal = (destino: Destino) => {
    setDestinoSeleccionado(destino);
    setIsOpen(true);
    window.history.pushState({ modal: true }, '');
  };
  const handleCloseModal = () => {
    setDestinoSeleccionado(null)
    setIsOpen(false);
  };
  return (
    <>
      <div className="rounded-md shadow-md overflow-hidden bg-white relative">
        <div className="absolute w-full h-full bg-black opacity-7 z-10 "  onClick={() => handleOpenModal(destino)}></div>
        <div className="relative">
          <button
            className={`rounded-full bg-white p-1 text-[32px] absolute top-2 right-2 border shadow z-30`}
            onClick={() => actualizarFavoritos({ ...destino, id: destino.idArticulo })}
          >
            {!!isFavorite ? (
              <LuCheck style={{ color: colorCircuito || "#01415c" }} className="size-7 md:size-6" />
            ) : (
              <LuPlus style={{ color: colorCircuito || "#01415c" }} className="size-7 md:size-6" />
            )}
          </button>
          <img
            src={`${imageBaseUrl}${destino.imagen}`}
            alt={`Imagen de ${destino.nombre}`}
            className="w-full h-38 object-cover"
          />
        </div>
        <div onClick={() => handleOpenModal(destino)} className="absolute bottom-0 z-20 bg-gradient-to-t from-black/60 via-black/30 via-70% to-transparent w-full pb-2
       px-3">
          <h3 className="text-3xl font-bold text-zinc-200 text-shadow-lg">{destino.nombre}</h3>
        </div>
      </div>
      {destinoSeleccionado && isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          title="Detalle del Destino"
          size="full"
          header={false}
        >
          {destinoSeleccionado && (
            <div>
              {/* HEADER DEL MODAL */}
              <div className="relative rounded-md overflow-hidden">
                <div className="absolute w-full h-full bg-black opacity-7"></div>
                <Image
                  src={window.innerWidth < 1024 ?
                    imageBaseUrl + destinoSeleccionado.imagenMovil
                    ||
                    imageBaseUrl + destinoSeleccionado.imagen :
                    imageBaseUrl + destinoSeleccionado.imagen}
                  alt={destinoSeleccionado.nombre}
                  width={250}
                  height={400}
                  className="w-full rounded-md h-[400px] object-cover"
                />
                <div className="absolute bottom-0 z-20 bg-gradient-to-t from-black/50 via-black/30 via-70% to-transparent w-full rounded-b-md pb-3 px-3">
                  <div className="flex items-center mb-4 gap-4 w-12/15">
                    <h4 className="md:text-[43px] font-bold uppercase text-white text-shadow-lg md:leading-tight text-[32px]/8">
                      {destinoSeleccionado.nombre}
                    </h4>
                  </div>
                  <div className="flex flex-row gap-2 mb-3 flex-wrap">
                    {destinoSeleccionado.tags.split(",").map((categoria, index) => (
                      <p key={index} className="rounded-md px-2 py-1 text-white text-[16px] font-semibold" style={{ backgroundColor: circuitoSelected.color }}>
                        {categoria}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              {/* FIN HEADER DEL MODAL */}
              <div className="grid grid-cols-8 gap-8 md:py-6 py-4">
                {/* COLUMNA IZQUIERDA */}
                <div className={`col-span-8 order-2 md:order-1 px-3 ${galery?.result && galery?.result?.length > 0 ||
                  destinoSeleccionado.iframe ||
                  destinoSeleccionado.video ||
                  destinoSeleccionado.url
                  ?
                  'md:col-span-3' :
                  'md:col-span-8'}`}>
                  <div className="sticky top-4">
                    <div className="flex items-start mb-3 gap-3">
                      <p className="text-[30px] font-bold leading-[32px] uppercase text-neutral-700 flex-1">
                        {destinoSeleccionado.nombre}
                      </p>
                      <button
                        className={`rounded-full bg-white p-1 text-[32px] border shadow`}
                        onClick={() => actualizarFavoritos({ ...destinoSeleccionado, id: destinoSeleccionado.idArticulo })}
                      >
                        {isModalFavorite ? (
                          <Check size={30} className="text-[#206c60]" />
                        ) : (
                          <Plus size={30} className="text-[#206c60]" />
                        )}
                      </button>
                    </div>
                    <p className="font-medium text-neutral-500 text-[18px] mb-3">
                      {destinoSeleccionado.copete}
                    </p>
                    <div className="text-[11px] font-medium text-neutral-400 break-words pointer-events-none" dangerouslySetInnerHTML={{ __html: destinoSeleccionado.cuerpo }}></div>
                  </div>
                </div>
                {/* COLUMNA IZQUIERDA FIN */}
                {/* ////////////////////////// */}
                {/* COLUMNA DERECHA */}
                <div className="col-span-5 order-2 md:order-1 px-2">
                  {isLoadingGalery ? (
                    <div className='md:p-0 md:mb-4 mb-0 md:h-[350px] px-0 animate-pulse'>
                      <div className='flex md:gap-3 gap-2 h-full'>
                        <div className='hidden md:flex flex-col gap-2 w-2/10'>
                          {Array(4).fill(0).map((_, i) => (
                            <div key={i} className='bg-gray-200 rounded-md flex-1'></div>
                          ))}
                        </div>
                        <div className='bg-gray-200 rounded-lg flex-1'></div>
                      </div>
                    </div>
                  ) : galery && galery?.result?.length > 0 ? (
                    <ImageGallery
                      items={galery?.result?.length > 0 ? galery.result.map(item => ({
                        img: imageBaseUrl + item.archivo,
                        text: item.texto
                      })) : []}
                      className='md:p-0 md:mb-4 mb-0 md:h-[350px] px-0'
                      classContain='md:gap-3 gap-2'
                      classThumbnails={`md:w-2/10 ${galery?.result?.length === 1 ? 'hidden' : ''}`}
                    />
                  ) : null}
                </div>
                {/* COLUMNA DERECHA FIN */}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
