import React, { useEffect } from 'react'
import WaykiQuestionnaire from './WaykiQuestionnaire'
import LanguageSwitcher from '../LanguageSwitcher'
import { useI18n } from '@/hooks/useI18n';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LayoutWayki({ show = false }: { show: boolean }) {
    const { t } = useI18n();
    const [viewLayout, setViewLayout] = useState(true);
    const variants = {
        enter: {
            x: 1100,
        },
        center: {
            zIndex: 100,
            x: 0,
            opacity: 1,
        },
        exit: {
            x: -1100,
        },
    };
    useEffect(() => {
        if (show) {
            setViewLayout(true);
        } else {
            setViewLayout(false);
        }
    }, [show]);
    return (
        <AnimatePresence mode="wait">
            {viewLayout ?
                <motion.div
                    key={"layoutWayki"}
                    className='h-full w-full bg-secondary z-40 absolute overflow-hidden'
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 400, damping: 30 },
                    }}
                >
                    <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
                    <div className='flex justify-center items-center absolute top-15 left-1/2 -translate-x-1/2 w-full'>
                        <h1 className='text-8xl text-white font-bold'>{t('wayki_layout.welcome')}</h1>
                    </div>
                    <WaykiQuestionnaire />
                    <div className='flex justify-around items-center absolute bottom-15 left-1/2 -translate-x-1/2 w-full'>
                        <div>
                            <LanguageSwitcher classNameLabel='text-2xl font-bold' buttonClassName='bg-primary text-zinc-50 h-full text-2xl' className='h-full w-42' direction='up' />
                        </div>
                        <div onClick={() => setViewLayout(false)}>
                            <h4 className='text-2xl font-bold text-white underline'>{t('wayki_layout.skip')}</h4>
                        </div>
                    </div>
                </motion.div>
                : (<div></div>)
            }
        </AnimatePresence>
    )
}
