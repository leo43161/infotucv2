import { BedDouble, Briefcase, BusFront, Map, Utensils, Car, Bike } from 'lucide-react';

// Rediseñamos la estructura de datos para incluir el icono y el color de Tailwind
const navItems = [
    {
        href: "/transportes",
        label: "Transportes",
        icon: BusFront, // Nombre del icono de Lucide
        color: "trans",     // Clave del color en tailwind.config.mjs
        gridClass: "row-span-2"
    },
    {
        href: "/agencias",
        label: "Agencias",
        icon: Briefcase,
        color: "agen",
        gridClass: "row-span-2"
    },
    {
        href: "/alojamientos",
        label: "Alojamientos",
        icon: BedDouble,
        color: "aloj",
        gridClass: "row-span-2"
    },
    {
        href: "/actividades",
        label: "Actividades",
        icon: Bike,
        color: "acti",
        gridClass: "row-span-2 row-start-3"
    },
    {
        href: "/mapas",
        label: "Mapas",
        icon: Map,
        color: "mapas",
        gridClass: "row-start-3",
        row: true
    },
    {
        href: "/autos",
        label: "Autos",
        icon: Car,
        color: "autos",
        gridClass: "col-start-2 row-start-4",
        row: true
    },
    {
        href: "/restaurantes",
        label: "Restaurantes",
        icon: Utensils,
        color: "rest",
        gridClass: "row-span-2 col-start-3 row-start-3",
    },
];

export default function NavButtons() {
    return (
        <nav className="p-4 flex-shrink-0">
            <div className="grid grid-cols-3 grid-rows-4 gap-4"> {/* Damos una altura fija al contenedor */}
                {navItems.map((item) => (
                    <div className={item.gridClass}>
                        <a
                            href={item.href}
                            className={`group ${item.row ? "flex-row justify-start gap-5" : "flex-col justify-center"} flex  items-center text-center rounded shadow-lg transition-all duration-300 ease-in-out h-full transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 gap-2 px-4 py-5 focus:ring-${item.color}/50 border-1`}
                            style={{ borderColor: `var(--${item.color})` }}
                        >
                            <item.icon
                                className="group-hover:text-white group-hover:scale-110 transition-transform duration-300"
                                size={item.row ? 50 : 90}
                                style={{ color: `var(--${item.color})` }}
                            />
                            <span className="text-white text-4xl font-bold text-left" style={{ color: `var(--${item.color})` }}>
                                {item.label}
                            </span>
                        </a>
                    </div>
                ))}
            </div>
        </nav>
    )
}
