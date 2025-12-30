"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Circle } from "lucide-react";
import NavButtons from "@/components/NavButtons";
import EventCarousel from "@/components/EventCarousel";
import Itinerario from "@/components/itinerario/Itinerario";
import { useI18n } from "@/hooks/useI18n";
import TwitchPlayer from "@/components/stream/TwitchPlayer";
import StreamInfoBar from "@/components/stream/StreamInfoBar";

export default function HomePage() {
  const [showLive, setShowLive] = useState(false);
  const { t } = useI18n();

  return (
    <div className="relative bg-gray-100 overflow-x-hidden">
      {/* Header */}
      <div className="bg-secondary p-5 text-center relative shadow-lg z-10">
        <img
          className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0'
          src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"}
          alt=""
        />
        <h1 className="text-5xl font-bold text-white relative z-10">{t('home.welcome')}</h1>
      </div>

      <div className="p-4">
        <NavButtons />
      </div>

      <div className="bg-gray-200">
        <Itinerario />
      </div>

      {/* ZONA DINÁMICA: O Eventos O Stream */}
      <div className="relative w-full bg-white">
        <AnimatePresence mode="wait">
          {!showLive ? (
            <motion.div
              key="events"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="p-4"
            >
              <EventCarousel />
            </motion.div>
          ) : (
            <motion.div
              key="stream"
              initial={{ opacity: 0, x: 100 }} // Entra desde la derecha
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }} // Sale hacia la derecha
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-121.5 flex-col flex" // Altura fija para estabilidad del video
            >
              {/* Pasamos la función para cerrar */}
              <div className="grow">
              <TwitchPlayer channel="tucumanturismo02" />
              </div>
              {/* QUIERO QUE ME CREES UN COMPONENTE CON BOTON DE VOLVER Y CLIMA DE EL CADILLAL, TITULO ETC... */}
              <div className="flex-none">
                 <StreamInfoBar onBack={() => setShowLive(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTÓN FLOTANTE (Solo visible si NO estamos viendo el live) */}
      <AnimatePresence>
        {!showLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-5 right-5 z-20 cursor-pointer"
            onClick={() => setShowLive(true)}
          >
            <div className="py-2 px-3 flex items-center bg-red-600 shadow-2xl hover:bg-red-700 transition-colors">
              <div className="relative flex mr-1.5">
                <Circle fill="#fff" stroke="transparent" className="animate-ping absolute opacity-75" size={19} />
                <Circle fill="#fff" stroke="transparent" className="relative" size={19} />
              </div>
              <span className="font-bold text-xl text-white tracking-wide">MIRA EL CADILLAL EN VIVO</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}