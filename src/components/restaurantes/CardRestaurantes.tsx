import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
// Se agrega el ícono 'Clock' para los horarios
import { MapPin, Phone, Mail, Globe, Image as ImageIcon, Clock } from 'lucide-react';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { Restaurante } from '@/types/api';
import { FaMapMarked } from 'react-icons/fa';

// Definimos el tipo para el objeto Restaurante para mayor seguridad y autocompletado

interface RestauranteCardProps {
    restaurante: Restaurante;
    className?: string;
}

const CardRestaurante: React.FC<RestauranteCardProps> = ({ restaurante, className = '' }) => {
    // Generar URL de Google Maps (Formato corregido y estándar)
    const googleMapsUrl = `https://www.google.com/maps?q=${restaurante.latitud},${restaurante.longitud}`;

    // URL base para las imágenes (debe estar en tus variables de entorno como NEXT_PUBLIC_)
    const image_url = process.env.URL_IMG || "URL_POR_DEFECTO/";

    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ${className}`}>
            <div className="flex flex-row h-69">
                {/* --- SECCIÓN DE IMAGEN --- */}
                <div className="w-2/7 relative flex-shrink-0">
                    {restaurante.imagen ? (
                        <img
                            // Se asume que la carpeta para gastronomía es 'gastronomia'
                            src={`${image_url}${restaurante.imagen}`}
                            alt={`Imagen de ${restaurante.nombre}`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Previene bucles de error
                                const fallback = target.parentElement?.querySelector('.fallback-image');
                                fallback?.classList.remove('hidden');
                                target.style.display = 'none';
                            }}
                        />
                    ) : null}
                    {/* Fallback si no hay imagen */}
                    <div className={`${restaurante.imagen ? 'hidden' : ''} fallback-image w-full h-48 bg-gray-100 flex items-center justify-center`}>
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                    {/* Etiqueta con la categoría */}
                    <div className='absolute bottom-3 right-3 px-3 py-1.5 bg-primary text-zinc-50 font-bold text-base rounded-md shadow-md'>
                        {restaurante.nombreCategoria}
                    </div>
                </div>

                {/* --- SECCIÓN DE INFORMACIÓN --- */}
                <div className="grow p-5 flex justify-between gap-4 items-center">
                    <div className='flex flex-col justify-between h-full'>
                        <div>
                            <h3 className="text-4xl font-bold text-gray-900 line-clamp-2">
                                {restaurante.nombre}
                            </h3>

                            {/* Horarios */}
                            {restaurante.horarios && (
                                <div className="flex items-center gap-2.5 mt-3 text-gray-700">
                                    <Clock className="size-5 text-secondary flex-shrink-0" />
                                    <p className="font-medium">{restaurante.horarios}</p>
                                </div>
                            )}

                            {/* Ubicación */}
                            <div className="flex items-start gap-2.5 mt-4">
                                <MapPin className="size-6 text-secondary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-xl font-semibold text-gray-800">{restaurante.direccion}</p>
                                    <p className="text-lg text-gray-600">{restaurante.nombreLocalidad}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="mt-4 space-y-2">
                            {restaurante.telefono && (
                                <div className="flex items-center gap-2.5">
                                    <Phone className="size-5 text-secondary" />
                                    <span className="text-lg font-semibold text-gray-700">{restaurante.telefono}</span>
                                </div>
                            )}
                            {restaurante.email && (
                                <div className="flex items-center gap-2.5">
                                    <Mail className="size-5 text-secondary" />
                                    <span className="text-lg font-semibold text-gray-700">{restaurante.email}</span>
                                </div>
                            )}
                            {/* {restaurante.web && (
                                <div className="flex items-center gap-2.5">
                                    <Globe className="size-5 text-secondary" />
                                    <a href={restaurante.web.startsWith('http') ? restaurante.web : `https://${restaurante.web}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 hover:underline">
                                        Visitar sitio web
                                    </a>
                                </div>
                            )} */}
                        </div>
                    </div>

                    {/* --- SECCIÓN CÓDIGO QR --- */}
                    <div className="flex flex-col items-center justify-center bg-primary rounded-xl h-fit mt-0 p-3 gap-1 flex-shrink-0">
                        <h4 className="text-lg font-bold text-zinc-50 flex items-center gap-1.5 text-center">
                            <FaMapMarked className="size-6" />
                            Ubicación en Maps
                        </h4>
                        <div className=" p-1.5 rounded-md">
                            <QRCodeSVG
                                value={googleMapsUrl}
                                size={125}
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

export default CardRestaurante;