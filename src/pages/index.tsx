// src/pages/index.tsx
import NavButtons from "@/components/NavButtons";
import EventCarousel from "@/components/EventCarousel";
import Itinerario from "@/components/itinerario/Itinerario";
import { useI18n } from "@/hooks/useI18n";
import { Circle } from "lucide-react";
import { useState } from "react";
import ModalVivo from "@/components/stream/ModalVivo";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  return (
    <div>
      <div className="bg-secondary p-5 text-center relative">
        <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
        <h1 className="text-5xl font-bold text-white">{t('home.welcome')}</h1>
      </div>
      <div className="p-4">
        <NavButtons />
      </div>
      <div className="bg-gray-200">
        <div className="">
          <Itinerario />
        </div>
      </div>
      <div className="p-4">
        <EventCarousel />
      </div>
      <div className="py-2 px-3  border-1 rounded-2xl absolute bottom-5 right-5 flex items-center bg-secondary shadow" onClick={handleOpenModal}>
        <Circle fill="oklch(57.7% 0.245 27.325)" stroke="#00000000" className="mr-2 animate-ping duration-150 opacity-75" />
        <Circle fill="oklch(57.7% 0.245 27.325)" stroke="#00000000" className="mr-2 absolute" />
        <span className="font-bold text-xl text-white">Mira el Cadillal en VIVO</span>
      </div>
      {isOpen && (
        <ModalVivo
          isOpen={true}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}