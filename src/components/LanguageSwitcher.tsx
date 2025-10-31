// src/components/LanguageSwitcher.tsx
import React, { useState, useRef } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/hooks/useI18n';
import { useClickOutside } from '@/hooks/useClickOutside'; // Asegúrate que la ruta sea correcta
import { cn, languages } from '@/utils';

interface LanguageSwitcherProps {
    className?: string;
    classNameLabel?: string;
    buttonClassName?: string;
    direction?: 'up' | 'down'; // Nueva prop para la dirección
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    className = '',
    classNameLabel = '',
    buttonClassName = '',
    direction = 'down', // 'down' por defecto
}) => {
    const { currentLanguage, changeLanguage } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    // Ref para el hook useClickOutside
    const switcherRef = useRef<HTMLDivElement>(null);

    // Llama al hook para cerrar el menú al hacer clic fuera
    useClickOutside(switcherRef as any, () => setIsOpen(false));

    // Variantes de animación para el menú
    const menuVariants = {
        hidden: {
            opacity: 0,
            y: direction === 'down' ? -10 : 10,
            transition: { duration: 0.2, ease: 'easeInOut' },
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2, ease: 'easeInOut' },
        },
    };

    return (
        <div ref={switcherRef} className={cn('relative w-28', className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={cn(
                    "flex items-center justify-between w-full gap-2 px-3 py-2 bg-white rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:bg-secondary",
                    buttonClassName
                )}
            >
                <div className="flex items-center gap-2">
                    <img
                        src={process.env.URL_WEB + currentLanguage.flag}
                        alt={currentLanguage.alt}
                        className="w-5 h-5 rounded-sm"
                    />
                    <span className={cn('font-bold text-base', classNameLabel)}>{currentLanguage.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="menu"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants as any}
                        className={cn(
                            "absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden",
                            direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1' // Posicionamiento dinámico
                        )}
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                role="menuitem"
                                onClick={() => {
                                    changeLanguage(lang.code.toLowerCase());
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    'w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors',
                                    currentLanguage.code === lang.code
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-gray-700'
                                )}
                            >
                                <img
                                    src={process.env.URL_WEB + lang.flag}
                                    alt={lang.alt}
                                    className="w-5 h-5 rounded-sm"
                                />
                                <span className={cn('', classNameLabel)}>{lang.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;