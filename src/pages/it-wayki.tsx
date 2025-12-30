import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Loader2, MailCheck, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { useSetItinerarioTouchMutation } from '@/store/services/itinerarioApi';
import { actividadesData, estadiaData, edadData, origenData, cantidadData } from '@/data/itWayki';

// Tipos de estado para la UI
type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ItinerarioEmail() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [pdfFile, setPdfFile] = useState<string>('');
    const [status, setStatus] = useState<Status>('idle');
    const [emailError, setEmailError] = useState<string | null>('');
    const [waykiActividad, setWaykiActividad] = useState<string | null>(null);
    const [createItTouch, { error: createError }] = useSetItinerarioTouchMutation()


    // Extraemos los datos de las respuestas del URL
    const { estadia, actividades, edad, origen, cantidad } = router.query;
    console.log("router.query", { estadia, actividades, edad, origen, cantidad });

    const [summary, setSummary] = useState('');

    useEffect(() => {
        // Cuando los datos del router estén listos, crea un resumen
        if (estadia && actividades) {
            const estadiaLabel = estadiaData.find((item) => item.value === estadia)?.label;
            const activiadesWayki = actividadesData.find((item) => item.value === actividades)?.wayki;
            const actividadesLabel = actividadesData.find((item) => item.value === actividades)?.label;
            setWaykiActividad(activiadesWayki || null);
            setSummary(`Tu itinerario de ${actividadesLabel} para ${estadiaLabel}.`);
        }
    }, [estadia, actividades]);

    const validateEmail = (email: string) => {
        if (!email) {
            return 'El correo electrónico es obligatorio.';
        }
        // Expresión regular simple para validación de email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return 'Por favor, ingresa un correo electrónico válido.';
        }
        return ''; // Sin error
    };

    const handleSubmit = async (e: React.FormEvent) => {
        const getIdData = (value: string, data: any) => {
            const item = data.find((item: any) => item.value === value);
            return item?.id || item?.value;
        };
        e.preventDefault();

        const validationError = validateEmail(email);
        if (validationError) {
            setEmailError(validationError);
            return; // Detiene el envío si hay un error
        }
        setEmailError('');

        if (status === 'loading') return;

        setStatus('loading');
        //@ts-ignore
        const findPdfFile = actividadesData.find((item: any) => item.value === actividades)?.pdf[estadia];
        setPdfFile(process.env.URL_PDF + findPdfFile);
        try {
            const dataQuestionaries = {
                estadia: getIdData(estadia as string, estadiaData),
                circuito: getIdData(actividades as string, actividadesData) || 1,
                edad: getIdData(edad as string, edadData),
                origen: getIdData(origen as string, origenData),
                cantidad: getIdData(cantidad as string, cantidadData),
                email,
            };
            createItTouch(dataQuestionaries).unwrap();
            const estadiaLabel = estadiaData.find((item) => item.value === estadia)?.label;
            const actividadesLabel = actividadesData.find((item) => item.value === actividades)?.label;
            const response = await fetch('https://tucumanturismo.gob.ar/api/itinerario/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email: email,
                    estadia: estadiaLabel || '1-2',
                    actividades: actividadesLabel || 'Ciudad Historica',
                    pdf: findPdfFile
                }),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                const errorData = await response.json();
                console.error("createITError: ", createError);
                throw new Error(errorData.error || 'Hubo un problema al enviar el correo.');
            } else {
                /* window.open('https://www.tucumanturismo.gob.ar/', '_blank'); */
                setStatus('success');
            }
        } catch (error: any) {
            console.error(error);
            setStatus('error');
        }
    };


    const renderContent = () => {
        switch (status) {
            case 'success':
                return (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <MailCheck size={64} className="mx-auto text-primary" />
                        <h2 className="text-3xl font-bold text-gray-800 mt-4">¡Enviado!</h2>
                        <p className="text-gray-600 mt-2">
                            Revisa tu bandeja de entrada (y spam) para descargar tu itinerario.
                        </p>
                        <Link href={pdfFile} passHref>
                            <button className="mt-3 flex items-center gap-2 mx-auto px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                                <Download size={20} />
                                Descarga el pdf
                            </button>
                        </Link>
                        <Link href="https://www.tucumanturismo.gob.ar/" passHref>
                            <button className="mt-3 flex items-center gap-2 mx-auto px-6 py-3 rounded-lg bg-secondary text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                                <ArrowLeft size={20} />
                                Conoce mas de Tucumán
                            </button>
                        </Link>
                    </motion.div>
                );
            case 'error':
                return (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <AlertCircle size={64} className="mx-auto text-red-500" />
                        <h2 className="text-3xl font-bold text-gray-800 mt-4">¡Oh no!</h2>
                        <p className="text-gray-600 mt-2">
                            Hubo un error al enviar tu itinerario. Por favor, intenta de nuevo más tarde.
                        </p>
                        <button
                            onClick={() => setStatus('idle')} // Permite al usuario reintentar
                            className="mt-6 px-6 py-3 rounded-lg bg-secondary text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                        >
                            Volver a intentar
                        </button>
                    </motion.div>
                );
            default: // 'idle' o 'loading'
                return (
                    <form onSubmit={handleSubmit} className="w-full">
                        <h2 className="text-3xl font-bold text-center text-gray-800">
                            ¡Casi listo!
                        </h2>
                        <p className="text-gray-600 text-center mt-2 mb-3 text-xl font-bold">
                            Ingresa tu email para recibir tu itinerario personalizado.
                        </p>

                        {/* Muestra el resumen del itinerario que se va a enviar */}
                        {summary && (
                            <div className="px-4 py-2 bg-primary/10 border-l-4 border-primary rounded-lg mb-3">
                                <p className="font-semibold text-primary text-lg">{summary}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                className={`w-full p-3 text-lg text-gray-700 border-2 rounded-lg focus:outline-none transition-colors ${emailError
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-primary'
                                    }`}
                                placeholder="tu.correo@ejemplo.com"
                                disabled={status === 'loading'}
                                formNoValidate
                            />
                            {emailError && (
                                <p className="mt-1 text-sm text-red-600">{emailError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full p-4 flex items-center justify-center rounded-lg bg-primary text-white text-lg font-semibold shadow-lg transition-all hover:scale-102 active:scale-100 disabled:opacity-50"
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                    <Loader2 size={24} />
                                </motion.div>
                            ) : (
                                'Enviar mi Itinerario'
                            )}
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="h-svh flex items-center justify-center bg-secondary p-2  overflow-hidden">
            <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
            {/* Usamos el logo de Wayki en la esquina */}
            <div
                className='absolute left-1/2 transform -translate-x-1/2 w-full h-full overflow-hidden flex justify-center items-center'>
                {waykiActividad && <motion.div
                    initial={{ rotate: -30, opacity: 0, y: 0, }}
                    animate={{ rotate: 33, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 13, delay: 0.7 }}
                    style={{
                        transformOrigin: 'bottom center'
                    }}
                    className='relative opacity-100 md:opacity-100 bottom-23 w-fit -left-100 max-w-none'
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 3, 0],
                        }}
                        transition={{ repeat: Infinity, repeatDelay: 5 }}
                    >
                        <img
                            src={process.env.URL_IMG_TOUCH ?
                                process.env.URL_IMG_TOUCH + '/img/wayki/' + waykiActividad
                                : '/img/wayki/' + waykiActividad}
                            alt="Wayki"
                            className="w-[580px] max-w-none"
                        />
                    </motion.div>
                </motion.div>
                }
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-6/7 max-w-md p-6 bg-white rounded-xl shadow-2xl z-10 absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                {renderContent()}
            </motion.div>
        </div>
    );
}

ItinerarioEmail.getLayout = function getLayout(page: any) {
    return page;
};