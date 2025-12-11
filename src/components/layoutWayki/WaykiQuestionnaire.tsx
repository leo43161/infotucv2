// src/components/WaykiQuestionnaire.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, House } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/utils'; // Importamos tu 'cn' de utils
import { useI18n } from '@/hooks/useI18n';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
type Question = {
    key: string;
    text: string;
    select: 'single' | 'multiple';
    options: { label: string; value: string, icon?: IconName, color?: string }[];
    classOptionsContainer?: string;
    classOptionsGrid?: string;
    classContainer?: string;
    classOptions?: string;
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
    const questions = [
        {
            key: 'edad',
            text: t('questions.edad.text'),
            select: 'single',
            options: [
                { label: t('questions.edad.options.5-17'), value: '5-17' },
                { label: t('questions.edad.options.18-25'), value: '18-25' },
                { label: t('questions.edad.options.26-35'), value: '26-35' },
                { label: t('questions.edad.options.36-50'), value: '36-50' },
                { label: t('questions.edad.options.51+'), value: '51+' },
            ],
        },
        {
            key: 'origen',
            text: t('questions.origen.text'),
            select: 'single',
            classOptionsContainer: 'h-[650px]',
            classContainer: 'h-[800px] scroll-visible',
            options: [
                { label: 'Tucumán', value: 'tucuman' },
                { label: 'Buenos Aires', value: 'buenos_aires' },
                { label: 'Catamarca', value: 'catamarca' },
                { label: 'Chaco', value: 'chaco' },
                { label: 'Chubut', value: 'chubut' },
                { label: 'Córdoba', value: 'cordoba' },
                { label: 'Corrientes', value: 'corrientes' },
                { label: 'Entre Ríos', value: 'entre_rios' },
                { label: 'Formosa', value: 'formosa' },
                { label: 'Jujuy', value: 'jujuy' },
                { label: 'La Pampa', value: 'la_pampa' },
                { label: 'La Rioja', value: 'la_rioja' },
                { label: 'Mendoza', value: 'mendoza' },
                { label: 'Misiones', value: 'misiones' },
                { label: 'Neuquén', value: 'neuquen' },
                { label: 'Río Negro', value: 'rio_negro' },
                { label: 'Salta', value: 'salta' },
                { label: 'San Juan', value: 'san_juan' },
                { label: 'San Luis', value: 'san_luis' },
                { label: 'Santa Cruz', value: 'santa_cruz' },
                { label: 'Santa Fe', value: 'santa_fe' },
                { label: 'Santiago del Estero', value: 'santiago_del_estero' },
                { label: 'Tierra del Fuego', value: 'tierra_del_fuego' },
                { label: 'Uruguay', value: 'uruguay' },
                { label: 'Chile', value: 'chile' },
                { label: 'Europa', value: 'europa' },
                { label: 'EEUU/Canadá', value: 'eeuu_canada' },
                { label: t('questions.origen.options.america'), value: 'resto_america' },
                { label: t('questions.origen.options.rest-world'), value: 'resto_mundo' },
            ],
        },
        {
            key: 'estadia',
            text: t('questions.estadia.text'),
            select: 'single',
            options: [
                { label: t('questions.estadia.options.1-2'), value: '1-2' },
                { label: t('questions.estadia.options.3-5'), value: '3-5' },
                { label: t('questions.estadia.options.7'), value: '7' },
                { label: t('questions.estadia.options.mas'), value: 'mas' },
            ],
        },
        {
            key: 'cantidad',
            text: t('questions.cantidad.text'),
            select: 'single',
            options: [
                { label: t('questions.cantidad.options.1'), value: '1' },
                { label: t('questions.cantidad.options.2'), value: '2' },
                { label: t('questions.cantidad.options.3-5'), value: '3-5' },
                { label: t('questions.cantidad.options.6+'), value: '6+' },
            ],
        },
        {
            key: 'actividades',
            text: t('questions.actividades.text'),
            select: 'single', // Nota: El texto en español sugiere 'multiple'
            classOptionsContainer: 'h-[750px]',
            classOptionsGrid: 'grid grid-cols-1 gap-4 auto-rows-[90px]',
            classContainer: 'h-[930px] scroll-visible',
            classOptions: 'text-[2.83em] ',
            options: [
                {
                    label: t('questions.actividades.options.historia'),
                    value: 'historia',
                    icon: "house",
                    color: "secondary"
                },
                {
                    label: t('questions.actividades.options.montanismo'),
                    value: 'montanismo',
                    icon: "mountain",
                    color: "acti"
                },
                {
                    label: t('questions.actividades.options.naturaleza'),
                    value: 'naturaleza',
                    icon: "flower",
                    color: "tertiary"
                },
                {
                    label: t('questions.actividades.options.religion'),
                    value: 'religion',
                    icon: "church",
                    color: "aloj"
                },
                {
                    label: t('questions.actividades.options.gastronomia'),
                    value: 'gastronomia',
                    icon: "chef-hat", 
                    color: "agen"
                },
                {
                    label: t('questions.actividades.options.productivo'),
                    value: 'productivo',
                    icon: "tractor",
                    color: "trans"
                },
                {
                    label: t('questions.actividades.options.surprise'),
                    value: 'surprise',
                    icon: "",
                    color: ""
                },
            ],
        },
    ];
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

        const { key, select, options, classOptionsContainer, classOptions, classOptionsGrid } = currentQuestion;
        return (
            <div className={cn("w-full h-76 overflow-auto p-2", classOptionsContainer || '')}>
                <div className={cn("grid grid-cols-2 gap-4 auto-rows-[80px]", classOptionsGrid || "")}>
                    {options?.map((option) => {
                        let isSelected = false;
                        if (select === 'multiple') {
                            isSelected = (answers[key] || []).includes(option.value);
                        } else {
                            isSelected = answers[key] === option.value;
                        }

                        return option.label !== "---------" && (
                            <motion.button
                                key={option.label}
                                onClick={() => handleOptionClick(option)}
                                className={cn(
                                    'flex items-center justify-center gap-2 p-3 rounded-lg text-4xl font-semibold transition-all shadow-md active:scale-95',
                                    isSelected
                                        ? 'bg-primary text-white scale-105' // Estilo seleccionado
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                                    classOptions || '',
                                    option.color ? `text-white bg-${option.color}` : ''

                                )}
                                // Animación al presionar
                                whileTap={{ scale: 0.95 }}
                            >
                                {option.icon && <DynamicIcon name={option.icon as IconName} size={40} />}
                                {select === 'multiple' && isSelected && <Check size={18} />}
                                {option.label}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- 5. Lógica de QR---

    const getQRValue = () => {
        const params = new URLSearchParams();
        for (const key in answers) {
            if (Array.isArray(answers[key])) {
                params.append(key, answers[key].join(','));
            } else {
                let valueAppend = answers[key];
                if (answers[key] === 'surprise') {
                    valueAppend = ["historia", "montanismo", "naturaleza", "religion", "gastronomia", "productivo"][Math.floor(Math.random() * 6) + 1];
                }
                params.append(key, valueAppend);
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
                            className="flex flex-col items-center p-8 bg-white rounded-lg shadow-xl max-w-lg w-full z-10"
                        >
                            <h2 className="text-5xl font-bold text-center text-secondary mb-4">{t('wayki_layout.thanks')}</h2>
                            <p className="text-4xl text-gray-700 text-center mb-6 font-bold">
                                {t('wayki_layout.itinerary')}
                            </p>
                            <div className="p-4 bg-white border-4 border-primary rounded-lg">
                                <QRCodeSVG value={getQRValue()} size={250} />
                            </div>
                            <p className='text-3xl text-gray-500 mt-5 mb-3'>{t('wayki_layout.mail')}</p>
                            <button
                                onClick={prevStep}
                                // Deshabilitado solo en el paso 0
                                disabled={step === 0 && !showQR}
                                className="flex items-center gap-2 p-2 rounded-lg text-primary font-semibold transition-all hover:bg-primary/20 z-20 border text-2xl"
                            >
                                <ArrowLeft size={27} /> {showQR ? t('wayki_layout.return') : t('wayki_layout.back')}
                            </button>
                        </motion.div>
                    ) : (
                        // --- ESTADO INICIAL: PREGUNTAS ---
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-lg flex flex-col items-center"
                        >
                            <h1 className="text-6xl font-bold text-center text-white mb-8 text-nowrap">
                                {t('wayki_layout.help')}
                            </h1>

                            {/* Contenedor de la pregunta con altura MÍNIMA para adaptarse */}
                            <div className={cn("relative w-full h-[480px] bg-white p-4 rounded-lg shadow-xl transition duration-300 ease-in-out", currentQuestion.classContainer || "")}>
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
                                        <h2 className="text-5xl font-bold text-gray-800 mb-4">{currentQuestion.text}</h2>
                                        {renderInput()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* --- 6. Controles de Navegación Modificados --- */}
                            <div className="flex justify-between items-center mt-6 min-h-[52px] w-full">

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

            {/* --- Animación de Wayki --- */}
            <div className="w-4/10 relative hidden md:block z-10">
                <div className="w-full flex items-center">
                    <motion.div
                        className="absolute flex justify-center items-center w-[90vw] pointer-events-none -left-22"
                        initial={{
                            rotate: -20,
                            scale: 1.5,
                            transition: {
                                type: 'spring', stiffness: 300, damping: 30
                            }
                        }}
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [-27, -29, -27],
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