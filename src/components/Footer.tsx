import { Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { FaBus, FaUtensils } from 'react-icons/fa'
import { LuBedDouble } from "react-icons/lu";
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '@/hooks/useI18n';
import { getCurrentLanguageCode, urlFormater } from '@/utils';

export default function Footer() {
    const router = useRouter();
    const { t } = useI18n();
    //Quiero una funcion que me cree una url dependiendo el lenguaje y el process.env.URL_TOUCH
    const buttonsLeft = [
        { href: urlFormater("transportes"), color: "#800077", label: "Transportes", icon: FaBus },
        { href: urlFormater("restaurantes"), color: "#a83413", label: "Restaurantes", icon: FaUtensils },
        { href: urlFormater("alojamientos"), color: "#006b96", label: "Alojamientos", icon: LuBedDouble },
    ];
    return (
        <footer className="bg-secondary text-white px-4 py-1 flex items-center justify-between flex-shrink-0 mt-auto relative">
            <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src={process.env.URL_IMG_TOUCH + "/img/header/textura-tucuman.png"} alt="" />
            <div className="flex items-center gap-3 z-[1]">
                {buttonsLeft.map((link, index) => (
                    <Link href={link.href} key={index} aria-label={link.label} className="size-10  rounded-full flex justify-center items-center border border-zinc-300" style={{ backgroundColor: link.color }}>
                        <link.icon size={18} color={"#fff"} />
                    </Link>
                ))}
            </div>
            <div className="flex items-center gap-3 z-[1] h-full">
                <div>
                    <img src={process.env.URL_IMG_TOUCH + "/icons/footer/logo-tuctur-w.svg"} className='h-9 w-full' alt="" />
                </div>
                <div className='h-10 border'>
                </div>
                <div>
                    <img src={process.env.URL_IMG_TOUCH + "/icons/footer/eatt2024blancohorizontal.svg"} className='h-18 w-full' alt="" />
                </div>
            </div>
            <div className='flex items-center gap-3 h-11'>
                <LanguageSwitcher buttonClassName='bg-primary text-zinc-50 h-full' className='h-full' direction='up' />
                {router.pathname !== '/' && <a href={urlFormater("")} className="flex h-full items-center gap-2 px-4 py-2 bg-primary hover:bg-primary rounded transition-colors z-[1] justify-center">
                    <Home></Home>
                    <span className="font-bold">{t('navigation.home')}</span>
                </a>}
            </div>
        </footer>
    )
}
