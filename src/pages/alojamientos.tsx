import React, { useEffect, useRef, useState } from 'react'
import Paginado from '../components/common/Paginado'
import { ChevronDown, ChevronUp } from 'lucide-react';
import CardAlojamientos from '../components/alojamientos/CardAlojamiento';
import TouchSelect from '../components/common/Select';
import { useGetHotelesFiltersQuery, useGetHotelesQuery } from '@/store/services/touchApi';
import { useI18n } from '@/hooks/useI18n';


export default function alojamientos() {
    const { t } = useI18n();
    const [categoria, setCategoria] = useState<string>('');
    const [estrellas, setEstrellas] = useState<string>('');
    const [localidad, setLocalidad] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 4;

    // Calcular el offset basado en la página actual
    const offset = (currentPage - 1) * itemsPerPage;
    const { data: hoteles, isLoading } = useGetHotelesQuery(
        { categoria, estrellas, localidad, offset, limit: itemsPerPage },
        {
            refetchOnMountOrArgChange: true
        }
    );
    const { data: hotelesFilter, isLoading: isLoadingFilter } = useGetHotelesFiltersQuery();


    const categorias = hotelesFilter?.categorias ? hotelesFilter?.categorias.map((cat) => ({ value: cat.id, label: cat.nombre })) : [];

    const estrellasOptions = [
        { value: '5', label: '5 Estrellas' },
        { value: '4', label: '4 Estrellas' },
        { value: '3', label: '3 Estrellas' },
        { value: '2', label: '2 Estrellas' },
        { value: '1', label: '1 Estrella' },
    ];

    const localidades = hotelesFilter?.categorias ? hotelesFilter?.localidades.map((localidad) => ({ value: localidad.id, label: localidad.nombre })) : [];
    return (
        <div className='container-height flex justify-between flex-col'>
            <div className="bg-aloj p-5 text-center relative shrink-0">
                <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
                <h1 className="text-5xl font-bold text-white">{t('accommodations.title')}</h1>
            </div>
            <div
                className={`flex flex-col justify-between relative grow backdrop-brightness-120`}
            >
                <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
                <div className='grow z-[1]'>
                    <div className='flex flex-col h-full justify-center'>
                        {/* Necesito una card horizontal para alojamientos */}
                        <div className='flex flex-col gap-4 py-6 px-8'>
                            {hoteles?.result?.map((alojamiento) => (<CardAlojamientos key={alojamiento.id} hotel={alojamiento} />))}
                        </div>
                    </div>
                </div>
                <div className='shrink-0 flex flex-col'>
                    <div className='z-[1] w-10/12 mx-auto'>
                        <div className='flex flex-row justify-center gap-5'>
                            {/* Categorías */}
                            <div className='flex flex-col w-80'>
                                <TouchSelect
                                    label={t('accommodations.categories')}
                                    options={categorias}
                                    value={categoria}
                                    onChange={setCategoria}
                                    placeholder={t('accommodations.category')}
                                />
                            </div>

                            {/* Estrellas */}
                            <div className='flex flex-col w-80'>
                                <TouchSelect
                                    label={t('accommodations.stars')}
                                    options={estrellasOptions}
                                    value={estrellas}
                                    onChange={setEstrellas}
                                    placeholder={t('accommodations.stars')}
                                />
                            </div>

                            {/* Localidades */}
                            <div className='flex flex-col w-80'>
                                <TouchSelect
                                    label={t('accommodations.locations')}
                                    options={localidades}
                                    value={localidad}
                                    onChange={setLocalidad}
                                    placeholder={t('accommodations.location')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='shrink-0 z-[1]'>
                        <Paginado
                            currentPage={currentPage}
                            totalItems={hoteles?.total || 0}
                            itemsPerPage={10}
                            onPageChange={(page) => setCurrentPage(page)}
                            className='my-10'
                            accentColor='var(--primary)'
                        ></Paginado>
                    </div>
                </div>
            </div>
        </div>
    )
}
