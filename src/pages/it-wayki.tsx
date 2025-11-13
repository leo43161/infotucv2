import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Loader2, MailCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Tipos de estado para la UI
type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ItinerarioEmail() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');

    // Extraemos los datos de las respuestas del URL
    const { estadia, actividades } = router.query;

    // Estado para mostrar un resumen de lo que se enviará
    const [summary, setSummary] = useState('');

    useEffect(() => {
        // Cuando los datos del router estén listos, crea un resumen
        if (estadia && actividades) {
            const actividadesLabel = [
                { label: 'Montañismo', value: 'montanismo' },
                { label: 'Historia', value: 'historia' },
                { label: 'Naturaleza', value: 'naturaleza' },
                { label: 'Compras', value: 'compras' },
                { label: 'Cultura', value: 'cultura' },
                { label: 'Gastronomía', value: 'gastronomia' },
            ].find((item) => item.value === actividades)?.label;
            const estadiaLabel = [
                { label: '1-2 días', value: '1-2' },
                { label: '3-5 días', value: '3-5' },
                { label: 'Una semana', value: '7' },
                { label: 'Más...', value: 'mas' },
            ].find((item) => item.value === estadia)?.label;
            setSummary(`Tu itinerario de ${actividadesLabel} para ${estadiaLabel}.`);
        }
    }, [estadia, actividades]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'loading' || !email) return;

        setStatus('loading');

        try {
            console.log(email, estadia, actividades);
            const response = await fetch('https://tucumanturismo.gob.ar/api/itinerario/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email: email,
                    estadia: estadia as string,
                    actividades: actividades as string,
                }),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Hubo un problema al enviar el correo.');
            }
            setStatus('success');
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
                        <Link href="/" passHref>
                            <button className="mt-6 flex items-center gap-2 mx-auto px-6 py-3 rounded-lg bg-secondary text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                                <ArrowLeft size={20} />
                                Volver al inicio
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
                        <p className="text-gray-600 text-center mt-2 mb-6">
                            Ingresa tu email para recibir tu itinerario personalizado.
                        </p>

                        {/* Muestra el resumen del itinerario que se va a enviar */}
                        {summary && (
                            <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-lg mb-6">
                                <p className="font-semibold text-primary">{summary}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 text-lg text-gray-700 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="tu.correo@ejemplo.com"
                                disabled={status === 'loading'}
                            />
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 ">
            {/* Usamos el logo de Wayki en la esquina */}
            <img
                src={process.env.NEXT_PUBLIC_URL_IMG_TOUCH ? process.env.NEXT_PUBLIC_URL_IMG_TOUCH + '/img/wayki.png' : '/img/wayki.png'}
                alt="Wayki"
                className="absolute w-48 -left-12 bottom-0 opacity-30 md:opacity-100 md:w-64 md:-left-20"
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl z-10"
            >
                {renderContent()}
            </motion.div>
        </div>
    );
}

ItinerarioEmail.getLayout = function getLayout(page: any) {
    return page;
};