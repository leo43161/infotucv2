import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { deleteData, getData, saveData } from '@/utils/indexedDB';
import { closeWaykiItinerario, openWaykiItinerario, openWaykiLayout } from '@/store/features/uiSlice';
import { useRouter } from 'next/router';
import { useI18n } from '@/hooks/useI18n';

export default function WaykiItinerarie() {
    const { t } = useI18n();
    const IT_WAYKI_DISMISSED_KEY = 'waykiItDismissed';
    const LAYOUT_WAYKI_DISMISSED_KEY = 'waykiDismissed';
    const showWaykiItinerario = useSelector((state: RootState) => state.ui.isWaykiOpenItinerario);
    const router = useRouter();
    const dispatch = useDispatch();
    const handleWaykiItDismiss = async () => {
        await saveData(IT_WAYKI_DISMISSED_KEY, 'true', 30 * 60 * 60);
        dispatch(closeWaykiItinerario());
        setInterval(async () => {
            dispatch(openWaykiItinerario());
        }, 180000)
    };
    const handleWaykiLayoutShow = async () => {
        dispatch(openWaykiLayout())
    };

    useEffect(() => {
        const checkWaykiDismissed = async () => {

            const dismissed = await getData(LAYOUT_WAYKI_DISMISSED_KEY);
            if (dismissed && router.pathname === '/') {
                dispatch(openWaykiItinerario());
            } else {
                dispatch(closeWaykiItinerario());
            }
        }
        checkWaykiDismissed();
    }, [router.pathname]);
    useEffect(() => {
        const showInterval = setInterval(async () => {
            dispatch(openWaykiItinerario());
        }, 120000);

        return () => clearInterval(showInterval);
    }, []);
    const waykiVariants = {
        hidden: {
            y: 300,
            filter: 'blur(5px)',
            transition: { duration: 0.7 }
        },
        visible: {
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 10,
                delay: 7
            }
        },
        exit: {
            opacity: [0.8, 0.4, 0],
            y: 300,
            filter: ['blur(0.4px)', 'blur(2px)', 'blur(3px)'],
            transition: {
                duration: .4,
                ease: "easeInOut"
            }
        },
    };
    const bubbleVariants = {
        hidden: {
            opacity: 0,
            scale: 0.7,
            transition: { duration: 0.2 }
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                delay: 7
            }
        },
        exit: {
            opacity: 0,
            scale: 0.7,
            transition: { duration: 0.2 }
        },
    };
    return (
        <AnimatePresence>
            {showWaykiItinerario ? (
                <motion.div
                    key={"wayki itinerario"}
                    className='w-5/10 relative top-14'
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.div
                        //@ts-ignore
                        variants={bubbleVariants}
                        className="relative md:w-105 w-[80vw] overflow-hidden rounded-md text-white shadow-xl right-2 -left-25 top-25"
                    >
                        <div>
                            <div className="px-4 py-3.5 bg-secondary">
                                <p className="mb-3 text-3xl font-bold px-1">{t('wayki_itinerary.message')}</p>
                                <div className='flex items-center gap-4'>
                                    <a
                                        className="inline-block rounded-md bg-primary px-3 py-1 font-bold text-white transition-transform hover:scale-105 cursor-pointer"
                                        onClick={handleWaykiLayoutShow}
                                    >
                                        Adelante!
                                    </a>
                                    <button
                                        className="inline-block rounded-md bg-transparent py-1 font-bold text-white transition-transform hover:scale-105 underline cursor-pointer"
                                        onClick={() => handleWaykiItDismiss()}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="wayki-imagen flex justify-end pointer-events-none"
                        //@ts-ignore
                        variants={waykiVariants} // Usa las variantes de Wayki
                        style={{
                            transformOrigin: 'bottom center'
                        }}
                    >
                        <div className='w-5/11'>
                            <img className="inset-0 ms-auto" src={process.env.URL_IMG_TOUCH + '/img/wayki/wayki.png'} alt="" />
                        </div>
                    </motion.div>
                </motion.div>
            ) : null
            }

        </AnimatePresence >
    )
}
