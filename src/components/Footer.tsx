import React from 'react'

export default function Footer() {
    const socialLinks = [
        { href: "#", label: "Facebook" },
        { href: "#", label: "Instagram" },
        { href: "#", label: "Twitter" },
    ];
    return (
        <footer className="bg-gray-800 text-white p-4 flex items-center justify-between flex-shrink-0 mt-auto">

            <a href="/" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <div className="w-6 h-6 bg-white rounded"></div>
                <span className="font-bold">Inicio</span>
            </a>

            <div className="flex items-center gap-4">
                <div className="w-24 h-10 bg-gray-500 rounded flex items-center justify-center text-xs">Logo 1</div>
                <div className="w-24 h-10 bg-gray-500 rounded flex items-center justify-center text-xs">Logo 2</div>
            </div>

            <div className="flex items-center gap-3">
                {socialLinks.map(link => (
                    <a href={link.href} aria-label={link.label} className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-full">
                    </a>
                ))}
            </div>

        </footer>
    )
}
