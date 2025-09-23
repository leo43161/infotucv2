import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Prestador } from '@/types/api';
import { FaHiking, FaInstagram, FaFacebook } from 'react-icons/fa';
import Modal from '../common/Modal';
import { useI18n } from '@/hooks/useI18n';

interface PrestadorCardProps {
  prestador: Prestador;
  className?: string;
}

const CardPrestador: React.FC<PrestadorCardProps> = ({ prestador, className = '' }) => {
  const { t } = useI18n();

  const [showQR, setShowQR] = useState({ titulo: "", url: "", modal: false });
  const handleShowQR = (titulo: string, url: string) => setShowQR({ titulo, url, modal: true });

  return (
    <>
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ${className}`}>
        <div className="flex flex-row h-58">
          {/* Imagen principal */}
          <div className="w-2/18 relative flex items-center shrink-0">
            {/* Fallback cuando no hay imagen */}
            <div className={`w-full h-full bg-primary flex items-center justify-center`}>
              <FaHiking className="size-20 text-zinc-50" />
            </div>
          </div>

          {/* Información principal */}
          <div className="grow px-7 flex justify-between gap-4 py-4 items-center">
            <div className='flex flex-col justify-around grow h-full'>
              <div>
                {/* Nombre */}
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {prestador.titulo}
                  </h3>
                </div>

                {/* Ubicación */}
                <div className="flex items-center gap-2 mb-0">
                  <MapPin className="size-6 text-secondary flex-shrink-0 mt-0.5" />
                  <div className='flex items-center gap-2'>
                    <p className="text-gray-800 text-2xl font-semibold">{prestador.responsable}</p>
                    <span>-</span>
                    <div className='flex items-center gap-2 bg-primary text-zinc-50 px-2 py-0.5 rounded-xl'>
                      <p className="text-2xl font-bold">{prestador.localidad_nombre}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-2 gap-2">
                {prestador.telefono_final && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-6 text-secondary" />
                    <span className="text-xl text-gray-700 font-semibold">{prestador.telefono_final}</span>
                  </div>
                )}

                {prestador.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-6 text-secondary" />
                    <span className="text-xl text-gray-700 font-semibold text-pretty break-all">{prestador.email}</span>
                  </div>
                )}

                {prestador.web && (
                  <div className="flex items-center" onClick={() => handleShowQR(t("accommodations.website"), prestador.web || '')}>
                    <div className='flex items-center gap-2 bg-secondary text-zinc-50 px-2 py-1 rounded-xl'>
                      <Globe className="size-6" />
                      <span className="text-xl font-semibold">
                        {t("accommodations.website")}
                      </span>
                    </div>
                  </div>
                )}

                {prestador.facebook && (
                  <div className="flex items-center" onClick={() => handleShowQR("Facebook", prestador.facebook || '')}>
                    <div className='flex items-center gap-2 bg-secondary text-zinc-50 px-2 py-1 rounded-xl'>
                      <FaFacebook className="size-6" />
                      <span className="text-xl font-semibold">
                        Facebook
                      </span>
                    </div>
                  </div>
                )}

                {prestador.instagram && (
                  <div className="flex items-center" onClick={() => handleShowQR("Instagram", prestador.instagram || '')}>
                    <div className='flex items-center gap-2 bg-secondary text-zinc-50 px-2 py-1 rounded-xl'>
                      <FaInstagram className="size-6" />
                      <span className="text-xl font-semibold">
                        Instagram
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actividades */}
            <div className="h-fit min-w-3/14 max-w-5/13">
              <div className='flex flex-wrap justify-center gap-2'>
                {prestador.actividades_texto_original?.split(',').map((actividad, index) => (
                  <div key={index} className='flex items-center gap-2 bg-primary text-zinc-50 px-2 py-1 rounded-xl'>
                    <img src="https://www.tucumanturismo.gob.ar/public/img/altamontana_0g9toa6f_27-08-2024.png" className='size-6' alt="" />
                    <p className="text-white font-semibold">
                      {actividad}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR */}
      <Modal
        isOpen={showQR.modal}
        onClose={() => setShowQR({ ...showQR, modal: false })}
        size="md"
        className='flex flex-col justify-center items-center gap-4 '
        backgroundColor='#A73413'
        header={false}
      >
        <div className='flex flex-col justify-center items-center gap-4 pt-5'>
          <QRCodeSVG value={showQR.url} bgColor='#ffffff00' fgColor='#fff' size={200} />
          <p className='text-center font-bold text-2xl text-zinc-50'>{showQR.titulo}</p>
        </div>
      </Modal>
    </>
  );
};

export default CardPrestador;
