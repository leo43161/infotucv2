// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// La lista de imágenes no cambia
const headerImages = [
    "/img/header/casahistorica-inicio.svg",
    "/img/header/pozoindio-inicio.svg",
    "/img/header/quetupi-inicio.svg",
    "/img/header/azucenaempanada-inicio.svg",
    "/img/header/menhires-inicio.svg"
];

const cycleInterval = 5000; // 3 minutos

export default function Header() {
    const [index, setIndex] = useState(0);

    // El useEffect se simplifica. Solo necesitamos cambiar el índice.
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % headerImages.length);
        }, cycleInterval);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-[#D6E9CF] flex-shrink-0 h-[400px] relative overflow-hidden">
            <img className='absolute w-full object-cover z-[2] opacity-60' src="/img/header/textura-tucuman.png" alt="" />
            <img className='absolute w-full object-cover z-[3] top-30' src="/img/header/montana.png" alt="" />
            <div className='z-[30] flex justify-start items-end relative h-full'>
                <div className='w-7/13 h-full flex items-end justify-center relative'>
                    {/* AnimatePresence gestiona la animación de entrada y salida de los componentes hijos */}
                    <AnimatePresence mode='wait'>
                        <motion.img
                            // La 'key' es crucial. Le dice a AnimatePresence que este es un nuevo elemento.
                            key={index}
                            src={headerImages[index]}
                            alt="Imagen principal del header"
                            className="absolute bottom-0 w-full object-cover"
                            // Estado inicial de la animación (antes de entrar)
                            initial={{ opacity: 1, transform: "translateY(100%)" }}
                            // Estado final de la animación (una vez que entra)
                            animate={{ opacity: 1, transform: "translateY(5%)" }}
                            // Estado de salida de la animación (cuando se va)
                            exit={{ opacity: 1, transform: "translateY(100%)" }}
                            // Duración y tipo de transición
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                    </AnimatePresence>
                </div>
                <div className='w-6/13 flex flex-col items-center justify-center h-full gap-5 relative z-10'>
                    <div className='w-9/12'>
                        <img src="/img/header/tuctur-logo.svg" alt="Tucumán Turismo" className="p-2 w-full" />
                    </div>
                    <hr className='border-1 border-white w-10/12' />
                    <div className='w-12/12'>
                        <p className='text-4xl font-bold italic text-white text-center'>Aplicación Informativa Tucumán Turismo</p>
                    </div>
                </div>
            </div>
        </header>
    );
}