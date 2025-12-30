import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { FaFacebook, FaInstagram, FaCar } from 'react-icons/fa';
import Modal from '../common/Modal';
import { useI18n } from '@/hooks/useI18n';
import { Auto } from '@/types/api';


interface AutoCardProps {
  auto: Auto;
  className?: string;
}

const CardAuto: React.FC<AutoCardProps> = ({ auto, className = '' }) => {
  const { t } = useI18n();

  const [showQR, setShowQR] = useState({ titulo: "", url: "", modal: false });
  const handleShowQR = (titulo: string, url: string) => setShowQR({ titulo, url, modal: true });

  return (
    <>
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ${className}`}>
        <div className="flex flex-row h-50">
          {/* Main Image */}
          <div className="w-2/18 relative flex items-center shrink-0">
            {/* Fallback when there is no image */}
            <div className={`w-full h-full bg-primary flex items-center justify-center`}>
              <FaCar className="size-20 text-zinc-50" />
            </div>
          </div>

          {/* Main Information */}
          <div className="grow px-7 flex justify-between gap-4 py-4 items-center">
            <div className='flex flex-col justify-around grow h-full'>
              <div>
                {/* Name */}
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {auto.nombre}
                  </h3>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-0">
                  <MapPin className="size-6 text-secondary flex-shrink-0 mt-0.5" />
                  <div className='flex items-center gap-2'>
                    <p className="text-gray-800 text-2xl font-semibold">{auto.direccion}</p>
                    <span>-</span>
                    <div className='flex items-center gap-2 bg-primary text-zinc-50 px-2 py-0.5 rounded-xl'>
                      <p className="text-2xl font-bold">{auto.localidad_nombre}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-2">
                {auto.telefonos && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-6 text-secondary" />
                    <span className="text-xl text-gray-700 font-semibold">{auto.telefonos}</span>
                  </div>
                )}

                {auto.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-6 text-secondary" />
                    <span className="text-xl text-gray-700 font-semibold text-pretty break-all">{auto.email}</span>
                  </div>
                )}

                {auto.web && (
                  <div className="flex items-center" onClick={() => handleShowQR(t("accommodations.website"), auto.web || '')}>
                    <div className='flex items-center gap-2 bg-secondary text-zinc-50 px-2 py-1 rounded-xl'>
                      <Globe className="size-6" />
                      <span className="text-xl font-semibold">
                        {t("accommodations.website")}
                      </span>
                    </div>
                  </div>
                )}

                {auto.facebook && (
                  <div className="flex items-center" onClick={() => handleShowQR("Facebook", auto.facebook || '')}>
                    <div className='flex items-center gap-2 bg-secondary text-zinc-50 px-2 py-1 rounded-xl'>
                      <FaFacebook className="size-6" />
                      <span className="text-xl font-semibold">
                        Facebook
                      </span>
                    </div>
                  </div>
                )}

                {auto.instagram && (
                  <div className="flex items-center" onClick={() => handleShowQR("Instagram", auto.instagram || '')}>
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
          </div>
        </div>
      </div>

      {/* QR Modal */}
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

export default CardAuto;