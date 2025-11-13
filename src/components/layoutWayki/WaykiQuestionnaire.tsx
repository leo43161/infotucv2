// src/components/WaykiQuestionnaire.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/utils'; // Importamos tu 'cn' de utils
import { useI18n } from '@/hooks/useI18n';

const questions = [
    {
        key: 'edad',
        text: '¿Qué edad tienes?',
        select: 'single',
        options: [
            { label: '18-25', value: '18-25' },
            { label: '26-35', value: '26-35' },
            { label: '36-50', value: '36-50' },
            { label: '51+', value: '51+' },
        ],
    },
    {
        key: 'origen',
        text: '¿De dónde nos visitas?',
        select: 'single',
        options: [
            { label: 'Tucumán', value: 'tucuman' },
            { label: 'Buenos Aires', value: 'buenos_aires' },
            { label: 'Córdoba', value: 'cordoba' },
            { label: 'Otra Pcia.', value: 'otra_provincia' },
            { label: 'Extranjero', value: 'extranjero' },
        ],
    },
    {
        key: 'estadia',
        text: '¿Cuántos días piensas quedarte?',
        select: 'single',
        options: [
            { label: '1-2 días', value: '1-2' },
            { label: '3-5 días', value: '3-5' },
            { label: 'Una semana', value: '7' },
            { label: 'Más...', value: 'mas' },
        ],
    },
    {
        key: 'cantidad',
        text: '¿Cuántas personas viajan?',
        select: 'single',
        options: [
            { label: 'Solo/a', value: '1' },
            { label: '2 personas', value: '2' },
            { label: '3-5', value: '3-5' },
            { label: 'Grupo (+5)', value: '6+' },
        ],
    },
    {
        key: 'actividades',
        text: '¿Qué actividades te gustan más? (Elige una o varias)',
        select: 'single',
        options: [
            { label: 'Montañismo', value: 'montanismo' },
            { label: 'Historia', value: 'historia' },
            { label: 'Naturaleza', value: 'naturaleza' },
            { label: 'Compras', value: 'compras' },
            { label: 'Cultura', value: 'cultura' },
            { label: 'Gastronomía', value: 'gastronomia' },
        ],
    },
];
type Question = {
    key: string;
    text: string;
    select: 'single' | 'multiple';
    options: { label: string; value: string }[];
};

// --- Variantes de animación (sin cambios) ---
const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

export default function WaykiQuestionnaire() {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [showQR, setShowQR] = useState(false);
    const { t } = useI18n();


    const currentQuestion = questions[step] as Question;

    const nextStep = () => {
        if (step < questions.length - 1) {
            setDirection(1);
            setStep(step + 1);
        } else {
            setShowQR(true);
        }
    };

    const prevStep = () => {
        if (showQR) {
            setShowQR(false);
            return;
        }
        if (step > 0) {
            setDirection(-1);
            setStep(step - 1);
        }
    };

    const handleOptionClick = (option: { label: string; value: string }) => {
        const { key, select } = currentQuestion;

        if (select === 'multiple') {
            // Lógica para 'actividades' (multiselect)
            const currentValues = answers[key] || [];
            let newValues;
            if (currentValues.includes(option.value)) {
                newValues = currentValues.filter((item: string) => item !== option.value);
            } else {
                newValues = [...currentValues, option.value];
            }
            setAnswers({ ...answers, [key]: newValues });
        } else {
            setAnswers({ ...answers, [key]: option.value });
            setTimeout(() => {
                nextStep();
            }, 300);
        }
    };

    const renderInput = () => {
        if (showQR) return null;

        const { key, select, options } = currentQuestion;

        return (
            <div className="grid grid-cols-2 gap-3 auto-rows-[80px]">
                {options?.map((option) => {
                    let isSelected = false;
                    if (select === 'multiple') {
                        isSelected = (answers[key] || []).includes(option.value);
                    } else {
                        isSelected = answers[key] === option.value;
                    }

                    return (
                        <motion.button
                            key={option.label}
                            onClick={() => handleOptionClick(option)}
                            className={cn(
                                'flex items-center justify-center gap-2 p-3 rounded-lg text-3xl font-semibold transition-all shadow-md active:scale-95',
                                isSelected
                                    ? 'bg-primary text-white scale-105' // Estilo seleccionado
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Estilo normal
                            )}
                            // Animación al presionar
                            whileTap={{ scale: 0.95 }}
                        >
                            {select === 'multiple' && isSelected && <Check size={18} />}
                            {option.label}
                        </motion.button>
                    );
                })}
            </div>
        );
    };

    // --- 5. Lógica de QR (sin cambios) ---

    const getQRValue = () => {
        const params = new URLSearchParams();
        console.log(answers);
        for (const key in answers) {
            if (Array.isArray(answers[key])) {
                params.append(key, answers[key].join(','));
            } else {
                params.append(key, answers[key]);
            }
        }
        return `http://10.20.20.5:3000/it-wayki?${params.toString()}`;
    };

    const isMultiselectValid = () => {
        if (currentQuestion.select !== 'multiple') return true;
        return (answers[currentQuestion.key] || []).length > 0;
    };


    return (
        <div className="size-full flex items-center justify-center p-4">
            <div className="flex-1 flex flex-col justify-center items-center">
                <AnimatePresence mode="wait">
                    {showQR ? (
                        <motion.div
                            key="qr"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center p-8 bg-white rounded-lg shadow-xl"
                        >
                            <h2 className="text-3xl font-bold text-center text-secondary mb-4">{t('wayki_layout.thanks')}</h2>
                            <p className="text-lg text-gray-700 text-center mb-6">
                                {t('wayki_layout.itinerary')}
                            </p>
                            <div className="p-4 bg-white border-4 border-primary rounded-lg">
                                <QRCodeSVG value={getQRValue()} size={200} />
                            </div>
                            <p className='text-sm text-gray-500 mt-4 mb-3'>{t('wayki_layout.mail')}</p>
                            <button
                                onClick={prevStep}
                                // Deshabilitado solo en el paso 0
                                disabled={step === 0 && !showQR}
                                className="flex items-center gap-2 p-2 rounded-lg text-primary font-semibold transition-all hover:bg-primary/20 z-20 border"
                            >
                                <ArrowLeft size={20} /> {showQR ? t('wayki_layout.return') : t('wayki_layout.back')}
                            </button>
                        </motion.div>
                    ) : (
                        // --- ESTADO INICIAL: PREGUNTAS ---
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-lg"
                        >
                            <h1 className="text-5xl font-bold text-center text-white mb-8">
                                {t('wayki_layout.help')}
                            </h1>

                            {/* Contenedor de la pregunta con altura MÍNIMA para adaptarse */}
                            <div className="relative w-full h-[450px] bg-white p-6 rounded-lg shadow-xl">
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={step}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: 'spring', stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 },
                                        }}
                                        className="w-full top-0 left-0 p-6"
                                    >
                                        <h2 className="text-4xl font-semibold text-gray-800 mb-4">{currentQuestion.text}</h2>
                                        {renderInput()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* --- 6. Controles de Navegación Modificados --- */}
                            <div className="flex justify-between items-center mt-6 min-h-[52px]">

                                {/* Botón Atras: Siempre visible */}
                                <button
                                    onClick={prevStep}
                                    // Deshabilitado solo en el paso 0
                                    disabled={step === 0 && !showQR}
                                    className="flex text-3xl items-center gap-2 p-3 rounded-lg text-white font-semibold transition-all hover:bg-white/20 z-20"
                                >
                                    <ArrowLeft size={30} /> {showQR ? t('wayki_layout.return') : t('wayki_layout.back')}
                                </button>

                                {/* Indicador de pasos: Siempre visible */}
                                {!showQR && (
                                    <div className="flex gap-1">
                                        {questions.map((_, i) => (
                                            <div key={i} className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                i === step ? 'bg-white scale-125' : 'bg-white/30'
                                            )} />
                                        ))}
                                    </div>
                                )}
                                {/* Botón Siguiente/Finalizar: 
                                    SOLO es visible para preguntas 'multiple' o la vista de QR (para volver)
                                */}
                                {(currentQuestion?.select === 'multiple' && !showQR) && (
                                    <button
                                        onClick={nextStep}
                                        disabled={!isMultiselectValid()} // Deshabilitado si no eligió ninguna
                                        className="flex text-3xl items-center gap-2 p-3 rounded-lg bg-primary text-white font-semibold transition-all hover:bg-opacity-80 disabled:opacity-40 z-20"
                                    >
                                        {step === questions.length - 1 ? t('wayki_layout.finish') : t('wayki_layout.next')}
                                        <ArrowRight size={20} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- Animación de Wayki (sin cambios) --- */}
            <div className="w-4/9 relative hidden md:block">
                <div className="w-full flex items-center">
                    <motion.div
                        className="absolute flex justify-center items-center w-[90vw] pointer-events-none -left-15"
                        initial={{
                            rotate: -20,
                            scale: 1.1,
                            transition: {
                                type: 'spring', stiffness: 300, damping: 30
                            }
                        }}
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [-25, -27, -25],
                        }}
                        transition={{ repeat: Infinity, repeatDelay: 5 }}
                    >
                        <img className="h-auto w-full inset-0" src={process.env.URL_IMG_TOUCH + '/img/wayki.png'} alt="" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}