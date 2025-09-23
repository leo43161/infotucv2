import { QrCode, LoaderCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { setCookie, getCookie, encriptar, desencriptar } from '@/utils/cookie';
import { useGetIdSessionMutation, useGuardarItinerarioMutation } from '@/store/services/itinerarioService';
import { useRouter } from 'next/router';
import { getCurrentLanguage } from '@/utils';
import { Favoritos } from '@/types/itinerarioState';
import { FaFileDownload } from 'react-icons/fa';
import { useI18n } from '@/hooks/useI18n';

export default function PDFGeneratorButton() {
  const { t } = useI18n();
  const router = useRouter();
  const lenguaje = getCurrentLanguage(router.query);

  const favoritos = useSelector((state: any) => state.itinerarios.value.favoritos);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [guardarItinerario, { isLoading, error, isError }] = useGuardarItinerarioMutation();
  const [getIdSession] = useGetIdSessionMutation();
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);

  const isFavoritosEmpty = (favs: Favoritos) => {
    if (!favs) return true;
    // Comprueba si todos los arrays dentro de cada circuito están vacíos.
    return Object.values(favs).every(circuito =>
      (circuito.destinos?.length || 0) === 0 &&
      (circuito.alojamientos?.length || 0) === 0 &&
      (circuito.prestadores?.length || 0) === 0 &&
      (circuito.guias?.length || 0) === 0
    );
  };
  const handleOpenModalClick = () => {
    if (isFavoritosEmpty(favoritos)) {
      setShowTooltip(true);
      // Oculta el tooltip después de 3 segundos
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setIsLoadingQr(true);
      handleCookieAndSave();
    } else {
      setIsLoadingQr(false);
      setPdfUrl(null);
    }
  }, [isModalOpen]);


  const handleCookieAndSave = async () => {
    let id_session;
    const cookie = getCookie('__cookieSesion');
    const idSession = await getIdSession(undefined).unwrap();
    if (!cookie) {
      id_session = idSession.result[0].id;
      const cookieData = { permiso: true, id: id_session };
      const encryptedValue = encriptar(JSON.stringify(cookieData));
      setCookie('__cookieSesion', encryptedValue, 60);
    } else {
      const cookieDecrypted = JSON.parse(desencriptar(cookie) ?? "");
      id_session = cookieDecrypted.id || idSession.result[0].id;
    }
    const payload = {
      id_session,
      destinos: Object.values(favoritos).flatMap((circuito: any) => circuito.destinos.map((d: any) => ({ id_dest: d.idArticulo }))),
      alojamientos: Object.values(favoritos).flatMap((circuito: any) => circuito.alojamientos.map((h: any) => ({ id_hotel: h.id }))),
      prestadores: Object.values(favoritos).flatMap((circuito: any) => circuito.prestadores.map((p: any) => ({ id_prestador: p.id }))),
      guias: Object.values(favoritos).flatMap((circuito: any) => circuito.guias.map((g: any) => ({ id_guia: g.id }))),
    };
    try {
      const response = await guardarItinerario(payload).unwrap();
      setPdfUrl(process.env.URL_WEB + "itinerario?id=" + response.id_itinerario + (lenguaje.code === 'ES' ? '' : '?lang=EN'));
    } catch (error) {
      console.error('Error al guardar el itinerario:', error);
    }
    setIsLoadingQr(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowQR(false);
    setPdfUrl(null);
  };

  return (
    // --- Contenedor relativo para posicionar el tooltip ---
    <div className="relative h-full">
      <button
        onClick={handleOpenModalClick}
        disabled={isLoading}
        className="flex items-center text-white cursor-pointer h-full hover:bg-secondary transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed gap-2  px-4"
      >
        <QrCode size={26} />
        <p className="text-xl underline">
          {isLoading && !isModalOpen ? lenguaje.code === 'ES' ? 'Generando...' : 'Generating...' : lenguaje.code === 'ES' ? 'Descargar' : 'Download'}
        </p>
      </button>

      {/* --- Tooltip de advertencia --- */}
      {showTooltip && (
        <div className="absolute -top-12 right-1 mt-2 w-max bg-primary text-white text-sm font-semibold rounded-md shadow-lg px-3 py-2 z-50 flex items-center">
          <AlertCircle className="mr-1.5" size={20} />
          <span>{lenguaje.code === 'ES' ? "Debes agregar items a tu itinerario." : "You must add items to your itinerary."}</span>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Descargar Itinerario"
        backgroundColor={'#206C60'}
        classNameHeader='text-white'
      >
        <div className="p-1 text-center flex flex-col justify-between h-full">

          <div className="flex flex-col items-center justify-center min-h-[250px] mb-5 transition-all duration-300 text-white">
            {isLoadingQr || isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <LoaderCircle className="animate-spin mb-4" size={48} />
                <p className="font-semibold">{lenguaje.code === 'ES' ? 'Generando tu itinerario...' : 'Generating your itinerary...'}</p>
                <p className="text-sm"> {lenguaje.code === 'ES' ? 'Esto puede tardar unos segundos.' : 'This may take a few seconds.'}</p>
              </div>
            ) : isError ? (
              <p className="font-semibold text-red-500"> {lenguaje.code === 'ES' ? 'Error al generar tu itinerario' : 'Error generating your itinerary'}</p>
            ) : pdfUrl && (
              <>
                <h3 className="text-2xl font-bold mb-2"> {lenguaje.code === 'ES' ? '¡Tu QR está listo!' : 'Your QR is ready!'}</h3>
                <p className='text-base mb-4'>{lenguaje.code === 'ES' ? 'Escanea el código QR para ver tu itinerario' : 'Scan the codeQR to view your itinerary'}</p>
                <QRCodeSVG value={pdfUrl} size={180} includeMargin={true} />
              </>
            )}
          </div>

          {lenguaje.code === 'ES' ? <p className="text-base text-white my-auto">
            Escanea el código QR para ver tu itinerario y disfrutar de los destinos de San Miguel de Tucuman
          </p> : <p className="text-base text-white my-auto">Scan the codeQR to view your itinerary and enjoy the destinations of San Miguel de Tucuman.
          </p>}

        </div>
      </Modal>
    </div>
  );
}