import { FaBus, FaBriefcase, FaHiking, FaMapMarkedAlt, FaUtensils } from 'react-icons/fa'
import { LuBedDouble } from "react-icons/lu";
import { FaCar } from "react-icons/fa6";
import { useI18n } from '@/hooks/useI18n';
// Rediseñamos la estructura de datos para incluir el icono y el color de Tailwind
const navItems = () => {
    const { t } = useI18n();
    return [
        {
            href: "/transportes",
            label: t("navigation.transportation"),
            icon: FaBus, // Nombre del icono de Lucide
            color: "trans",     // Clave del color en tailwind.config.mjs
            gridClass: "row-span-2"
        },
        {
            href: "/mapas",
            label: t("navigation.maps"),
            icon: FaMapMarkedAlt,
            color: "mapas",
            gridClass: "row-span-2",
        },
        {
            href: "/alojamientos",
            label: t("navigation.accommodations"),
            icon: LuBedDouble,
            color: "aloj",
            gridClass: "row-span-2"
        },
        {
            href: "/actividades",
            label: t("navigation.activities"),
            icon: FaHiking,
            color: "acti",
            gridClass: "row-span-2 row-start-3"
        },

        {
            href: "/agencias",
            label: t("navigation.agencies"),
            icon: FaBriefcase,
            gridClass: "row-start-3",
            row: true,
            color: "agen",
        },
        {
            href: "/autos",
            label: t("navigation.cars"),
            icon: FaCar,
            color: "autos",
            gridClass: "col-start-2 row-start-4",
            row: true
        },
        {
            href: "/restaurantes",
            label: t("navigation.restaurants"),
            icon: FaUtensils,
            color: "rest",
            gridClass: "row-span-2 col-start-3 row-start-3",
        },
    ]
};

export default function NavButtons() {
    return (
        <nav className="p-2 flex-shrink-0">
            <div className="grid grid-cols-3 grid-rows-4 gap-4"> {/* Damos una altura fija al contenedor */}
                {navItems().map((item, index) => (
                    <div className={item.gridClass} key={index}>
                        <a
                            href={item.href}
                            className={`group ${item.row ? "flex-row justify-start gap-5" : "flex-col justify-center"} flex  items-center text-center rounded shadow-lg transition-all duration-300 ease-in-out h-full transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 gap-2 px-4 py-2.5 focus:ring-${item.color}/50 border-2`}
                            style={{ borderColor: `var(--${item.color})` }}
                        >
                            <item.icon
                                className="group-hover:text-white group-hover:scale-110 transition-transform duration-300"
                                size={item.row ? 38 : 62}
                                style={{ color: `var(--${item.color})` }}
                            />
                            <span className="text-white text-[2.1em] font-bold text-left" style={{ color: `var(--${item.color})` }}>
                                {item.label}
                            </span>
                        </a>
                    </div>
                ))}
            </div>
        </nav>
    )
}
