// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/hooks/useI18n';

// La lista de imágenes no cambia
const headerImages = [
    "/img/header/casahistorica-inicio.svg",
    "/img/header/pozoindio-inicio.svg",
    "/img/header/quetupi-inicio.svg",
    "/img/header/azucenaempanada-inicio.svg",
    "/img/header/menhires-inicio.svg"
];

const cycleInterval = 10000; // 10 segundos

export default function Header() {
    const [index, setIndex] = useState(0);
    const { t } = useI18n();

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % headerImages.length);
        }, cycleInterval);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-[#D6E9CF] flex-shrink-0 h-[340px] relative overflow-hidden">
            <img className='absolute w-full object-cover z-[2] opacity-60' src="/img/header/textura-tucuman.png" alt="" />
            <img className='absolute w-full object-cover z-[3] top-30' src="/img/header/montana.png" alt="" />
            
            {/* Selector de idioma en la esquina superior derecha */}
            {/* <div className="absolute top-4 right-4 z-[40]">
                <LanguageSwitcher />
            </div> */}
            
            <div className='z-[30] flex justify-between items-end relative h-full'>
                <div className='w-6/13 h-full flex items-end justify-center relative'>
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={index}
                            src={headerImages[index]}
                            alt="Imagen principal del header"
                            className="absolute bottom-0 w-full object-cover"
                            initial={{ opacity: 1, transform: "translateY(100%)" }}
                            animate={{ opacity: 1, transform: "translateY(5%)" }}
                            exit={{ opacity: 1, transform: "translateY(100%)" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                    </AnimatePresence>
                </div>
                <div className='w-6/13 flex flex-col items-center justify-center h-full gap-4 relative z-10'>
                    <div className='w-9/13'>
                        <img src="/img/header/tuctur-logo.svg" alt="Tucumán Turismo" className="p-2 w-full" />
                    </div>
                    <hr className='border-1 border-white w-10/12' />
                    <div className='w-10/12'>
                        <p className='text-5xl font-bold italic text-white text-center'>
                            {t('header.title')}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}