import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Phone, Mail, Globe, Plane } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import Modal from '../common/Modal';
import { useI18n } from '@/hooks/useI18n';
import { Agencia } from '@/types/api';

interface AgenciaCardProps {
  agencia: Agencia;
  className?: string;
}

const CardAgencias: React.FC<AgenciaCardProps> = ({ agencia, className = '' }) => {
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
              <Plane className="size-20 text-zinc-50" />
            </div>
          </div>

          {/* Información principal */}
          <div className="grow px-7 flex justify-between gap-4 py-4 items-center">
            <div className='flex flex-col justify-around grow h-full'>
              <div>
                {/* Nombre */}
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {agencia.nombre}
                  </h3>
                </div>

                {/* Ubicación */}
                <div className="flex items-center gap-2 mb-0">
                  <MapPin className="size-6 text-secondary flex-shrink-0 mt-0.5" />
                  <div className='flex items-center gap-2  flex-wrap'>
                    <p className="text-gray-800 text-2xl font-semibold">{agencia.direccion}</p>
                    <span>-</span>
                    <div className='flex items-center gap-2 bg-primary text-zinc-50 px-2 py-0.5 rounded-xl'>
                      <p className="text-2xl font-bold text-nowrap">{agencia.localidad_nombre}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-2 gap-2">
                {agencia.telefonos && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-6 text-secondary" />
                    <span className="text-xl text-gray-700 font-semibold">{agencia.telefonos}</span>
                  </div>
                )}

                {agencia.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-6 text-secondary" />
                    <span className="text-xl text-gray-700 font-semibold text-pretty break-all">{agencia.email}</span>
                  </div>
                )}

                {agencia.web && (
                  <div className="flex items-center" onClick={() => handleShowQR(t("accommodations.website"), agencia.web || '')}>
                    <div className='flex items-center gap-2 bg-secondary text-zinc-50 px-2 py-1 rounded-xl'>
                      <Globe className="size-6" />
                      <span className="text-xl font-semibold">
                        {t("accommodations.website")}
                      </span>
                    </div>
                  </div>
                )}

                {agencia.facebook && (
                  <div className="flex items-center" onClick={() => handleShowQR("Facebook", agencia.facebook || '')}>
                    <div className='flex items-center gap-2 bg-secondary text-zinc-50 px-2 py-1 rounded-xl'>
                      <FaFacebook className="size-6" />
                      <span className="text-xl font-semibold">
                        Facebook
                      </span>
                    </div>
                  </div>
                )}

                {agencia.instagram && (
                  <div className="flex items-center" onClick={() => handleShowQR("Instagram", agencia.instagram || '')}>
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

            {/* Actividades (reemplazado por Legajo) */}
            <div className="h-fit min-w-3/14 max-w-5/13">
              <div className='flex flex-wrap justify-center gap-2'>
                {agencia.legajo && (
                  <div className='flex items-center gap-2 bg-primary text-zinc-50 px-2 py-1 rounded-xl'>
                    <Plane className='size-6' />
                    <p className="text-white font-semibold">
                      Legajo: {agencia.legajo}
                    </p>
                  </div>
                )}
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
        className='flex flex-col justify-center items-center gap-4'
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

export default CardAgencias;