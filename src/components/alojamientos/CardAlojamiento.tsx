import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Star, Phone, Mail, Globe, Image as ImageIcon, LocateIcon } from 'lucide-react';
import { Hotel } from '@/types/api';
import { FaLocationCrosshairs, FaLocationDot } from 'react-icons/fa6';
import { useI18n } from '@/hooks/useI18n';

interface HotelCardProps {
    hotel: Hotel;
    className?: string;
}

const CardAlojamientos: React.FC<HotelCardProps> = ({ hotel, className = '' }) => {
    const { t } = useI18n();
    // Generar URL de Google Maps
    const googleMapsUrl = `https://www.google.com/maps?q=${hotel.latitud},${hotel.longitud}`;

    // Renderizar estrellas
    const renderStars = (estrellas: string) => {
        const numEstrellas = parseInt(estrellas) || 0;
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`size-6 ${i < numEstrellas
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                    }`}
            />
        ));
    };
    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ${className}`}>
            <div className="flex flex-row h-64">
                {/* Imagen principal */}
                <div className="w-2/7 relative flex items-center">
                    {hotel.logo ? (
                        <img
                            src={process.env.URL_IMG + "alojamientos/" + hotel.logo}
                            alt={`${hotel.nombre} - Imagen principal`}
                            className="w-full h-auto"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}

                    {/* Fallback cuando no hay imagen */}
                    <div className={`${hotel.logo ? 'hidden' : ''} w-full h-full bg-gray-100 flex items-center justify-center`}>
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className='absolute bottom-3 right-3 px-3 py-1 bg-primary text-zinc-50 font-bold text-lg rounded-md'>
                        {hotel.localidad}
                    </div>
                </div>

                {/* Información principal */}
                <div className="grow px-7 flex justify-between items-center">
                    <div className='flex flex-col justify-between'>
                        <div>
                            {/* Nombre y estrellas */}
                            <div className="mb-3 flex items-center gap-3">
                                <h3 className="text-3xl font-bold text-gray-900 line-clamp-2">
                                    {hotel.nombre}
                                </h3>
                                <div className="flex items-center gap-1">
                                    {renderStars(hotel.estrellas)}
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="size-6 text-secondary flex-shrink-0 mt-0.5" />
                                <div className='flex items-center gap-2'>
                                    <p className="text-gray-800 text-2xl font-semibold">{hotel.domicilio}</p>
                                    <span>-</span>
                                    <p className="text-gray-700 text-xl font-medium">{hotel.localidad}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="space-y-2">
                            {hotel.telefono_final && (
                                <div className="flex items-center gap-2">
                                    <Phone className="size-6 text-secondary" />
                                    <span className="text-xl text-gray-700 font-semibold">{hotel.telefono_final}</span>
                                </div>
                            )}

                            {hotel.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="size-6 text-secondary" />
                                    <span className="text-xl text-gray-700 font-semibold">{hotel.email}</span>
                                </div>
                            )}

                            {hotel.web && (
                                <div className="flex items-center gap-2">
                                    <Globe className="size-6 text-secondary" />
                                    <span className="text-xl text-gray-700 font-semibold">
                                        {hotel.web}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-primary rounded-xl h-fit py-3 px-4 gap-2">
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-zinc-50 flex items-center gap-1">
                                <span><FaLocationCrosshairs className="size-5 text-zinc-50" /></span>
                                {t('accommodations.location_maps')}
                            </h4>
                        </div>

                        <div className="mb-2.5">
                            <QRCodeSVG
                                value={googleMapsUrl}
                                size={115}
                                level="L"
                                includeMargin={false}
                                bgColor='#ffffff00'
                                fgColor='#fff'
                            />
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default CardAlojamientos;