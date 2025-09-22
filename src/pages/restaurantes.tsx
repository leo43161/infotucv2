// Tu página de restaurantes (ej: app/restaurantes/page.tsx)

'use client';

import { useState } from 'react';
import { Restaurante } from '@/types/api';
import { useGetLocalidadesQuery, useGetRestaurantesQuery } from '@/store/services/touchApi';

// Importa los nuevos componentes
import CardRestaurante from '@/components/restaurantes/CardRestaurantes';
import CardRestauranteSkeleton from '@/components/restaurantes/CardRestauranteSkeleton';
import FeedbackMessage from '../components/common/FeedbackMessage';
import Paginado from '../components/common/Paginado';
import TouchSelect from '../components/common/Select';

// Importa íconos para los mensajes
import { SearchX, AlertTriangle } from 'lucide-react';

export default function restaurantes() {
    const [categoria, setCategoria] = useState<string>('');
    const [localidad, setLocalidad] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 4;

    const offset = (currentPage - 1) * itemsPerPage;

    // Obtenemos isError del hook de RTK Query
    const { data: restaurantes, isLoading, isError } = useGetRestaurantesQuery(
        { categoria, localidad, offset, limit: itemsPerPage },
        { refetchOnMountOrArgChange: true }
    );

    const { data: localidadesFilter } = useGetLocalidadesQuery();

    const categorias = restaurantes?.categorias?.map((cat) => ({ value: cat.id, label: cat.nombre })) || [];
    const localidades = localidadesFilter?.localidades?.map((loc) => ({ value: loc.id, label: loc.nombre })) || [];

    // Lógica central para renderizar el contenido
    const renderContent = () => {
        // 1. Estado de Carga
        if (isLoading) {
            return Array.from({ length: itemsPerPage }).map((_, index) => (
                <CardRestauranteSkeleton key={index} />
            ));
        }

        // 2. Estado de Error
        if (isError) {
            return (
                <FeedbackMessage
                    icon={<AlertTriangle size={64} />}
                    title="¡Oops! Algo salió mal"
                    message="No pudimos cargar la información. Por favor, intenta de nuevo más tarde."
                />
            );
        }

        // 3. Estado Vacío (no hay resultados)
        if (!restaurantes?.result || restaurantes.result.length === 0) {
            return (
                <FeedbackMessage
                    icon={<SearchX size={64} />}
                    title="No se encontraron resultados"
                    message="Prueba cambiando los filtros o ampliando tu búsqueda para encontrar lo que necesitas."
                />
            );
        }

        // 4. Estado con Datos (Éxito)
        return restaurantes.result.map((restaurante: Restaurante) => (
            <CardRestaurante key={restaurante.idGastronomia} restaurante={restaurante} />
        ));
    };

    return (
        // Se ajustó la altura para que sea dinámica
        <div className='h-[1500px] flex flex-col justify-between'>
            <div className="bg-aloj p-5 text-center relative shrink-0">
                <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src="/img/header/textura-tucuman.png" alt="" />
                <h1 className="text-5xl font-bold text-white">Buscá aquí donde comer</h1>
            </div>

            <div className="flex flex-col justify-between relative grow backdrop-brightness-120">
                <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src="/img/header/textura-tucuman.png" alt="" />

                <div className='grow z-[1] flex flex-col'>
                    {/* Filtros en la parte superior para mejor UX */}

                    {/* Contenido dinámico */}
                    <div className='flex flex-col gap-4 py-6 px-8 h-full justify-center'>
                        {renderContent()}
                    </div>
                    <div className='py-4 z-[1] w-10/12 mx-auto'>
                        <div className='flex flex-col md:flex-row justify-center gap-5'>
                            <div className='flex-1 max-w-sm'>
                                <TouchSelect
                                    label="Categorías"
                                    options={categorias}
                                    value={categoria}
                                    onChange={(val) => { setCategoria(val); setCurrentPage(1); }}
                                    placeholder="Todas las categorías"
                                />
                            </div>
                            <div className='flex-1 max-w-sm'>
                                <TouchSelect
                                    label="Localidades"
                                    options={localidades}
                                    value={localidad}
                                    onChange={(val) => { setLocalidad(val); setCurrentPage(1); }}
                                    placeholder="Todas las localidades"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='shrink-0 z-[1]'>
                    <Paginado
                        currentPage={currentPage}
                        totalItems={parseInt(restaurantes?.total || '0')}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        className='my-4'
                        accentColor='var(--primary)'
                    />
                </div>
            </div>
        </div>
    );
}