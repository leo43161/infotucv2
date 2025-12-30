"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Thermometer, Droplets, Wind, MapPin } from 'lucide-react';

interface WeatherData {
    temp_c: number;
    condition: { text: string; icon: string };
    humidity: number;
    wind_kph: number;
}

export default function StreamInfoBar({ onBack }: { onBack: () => void }) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const API_KEY = '3208887a589245bfa45151945242406';

    useEffect(() => {
        // Petición específica para El Cadillal
        fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=El Cadillal, Tucuman&lang=es`)
            .then(res => res.json())
            .then(data => {
                setWeather({
                    temp_c: data.current.temp_c,
                    condition: data.current.condition,
                    humidity: data.current.humidity,
                    wind_kph: data.current.wind_kph
                });
            })
            .catch(err => console.error("Error clima:", err));
    }, []);

    return (
        <div className="bg-tertiary w-full px-4 py-3 flex items-center justify-between shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-20">
            {/* 1. BOTÓN VOLVER (Grande para Touch) */}
            <button
                onClick={onBack}
                className="flex items-center gap-1 bg-black/20 active:scale-95 transition-all text-white px-6 py-3 rounded-xl border border-white/70"
            >
                <ArrowLeft size={28} />
                <span className="font-bold text-xl uppercase tracking-wide">Volver</span>
            </button>

            {/* 2. TÍTULO Y ESTADO */}
            <div className="flex flex-col items-center justify-center text-white">
                <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Transmisión en Vivo</span>
                </div>
                <div className="flex items-center gap-1">
                    <MapPin size={28} />
                    <h2 className="text-4xl font-black tracking-tight leading-none">El Cadillal</h2>
                </div>
            </div>

            {/* 3. CLIMA (Diseño compacto horizontal) */}
            <div className="flex items-center bg-black/20 rounded-xl px-5 py-2 text-white border border-white/10">
                {weather ? (
                    <>
                        {/* Temperatura Grande */}
                        <div className="flex items-center gap-1 pr-5 border-r border-white/20">
                            <Thermometer className="text-white" size={28} />
                            <span className="text-3xl font-light">{Math.round(weather.temp_c)}°</span>
                        </div>

                        {/* Detalles */}
                        <div className="flex flex-col justify-center pl-5 gap-1">
                            <span className="text-md font-medium capitalize leading-none">{weather.condition.text}</span>
                            <div className="flex gap-4 text-md text-white/70">
                                <span className="flex items-center gap-1"><Droplets size={14} /> {weather.humidity}%</span>
                                <span className="flex items-center gap-1"><Wind size={14} /> {weather.wind_kph} km/h</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 opacity-50">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Cargando clima...</span>
                    </div>
                )}
            </div>
        </div>
    );
}