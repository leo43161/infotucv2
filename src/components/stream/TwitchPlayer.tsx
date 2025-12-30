"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";

export default function TwitchPlayer({ channel }: { channel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Envolvemos la inicialización en useCallback para poder usarla en el useEffect y en el onLoad
  const initializeTwitch = useCallback(() => {
    // Limpiamos estados previos por si es un re-render
    setIsLoaded(false);
    setShowPlayButton(false);

    setTimeout(() => {
      // Verificamos que el contenedor exista y que Twitch esté cargado
      if (window.Twitch && window.Twitch.Embed && containerRef.current) {
        
        // ¡IMPORTANTE! Limpiamos el HTML interno para evitar duplicar iframes
        containerRef.current.innerHTML = "";

        const embed = new window.Twitch.Embed(containerRef.current, {
          width: "100%",
          height: "100%",
          channel: channel,
          layout: "video",
          autoplay: true,
          muted: true,
          parent: ["localhost", window.location.hostname],
        });

        embed.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
          setIsLoaded(true);
          const player = embed.getPlayer();
          playerRef.current = player;
          
          // Verificación de Autoplay tras 2 segundos
          setTimeout(() => {
            if (player.isPaused()) {
              console.log("Autoplay bloqueado. Mostrando botón manual.");
              setShowPlayButton(true);
            }
          }, 1000);
        });
      }
    }, 800); // Mantenemos el delay para la animación de entrada
  }, [channel]);

  // ESTE EFFECT ES LA CLAVE DEL ARREGLO
  useEffect(() => {
    // Si window.Twitch ya existe (segunda vez que abres el componente),
    // iniciamos manualmente sin esperar al onLoad del Script.
    if (window.Twitch && window.Twitch.Embed) {
      initializeTwitch();
    }
    
    // Cleanup: cuando cerramos el componente, limpiamos la referencia
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [initializeTwitch]);

  const handleManualPlay = () => {
    if (playerRef.current) {
      playerRef.current.setMuted(false); // Intentamos desmutear también
      playerRef.current.play();
      setShowPlayButton(false);
    }
  };

  return (
    // QUITE EL 'pointer-events-none' DE AQUÍ PORQUE BLOQUEABA EL BOTÓN DE PLAY MANUAL
    <div className="w-full h-full bg-black relative flex items-center justify-center pointer-events-none">
      
      <Script
        src="https://embed.twitch.tv/embed/v1.js"
        onLoad={initializeTwitch} // Solo se dispara la primera vez
      />

      <div 
        ref={containerRef} 
        id="twitch-embed" 
        className="w-full h-full"
      />

      {/* BOTÓN DE PLAY MANUAL (Solo si falla el autoplay) */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
          <button 
            onClick={handleManualPlay}
            className="group flex flex-col items-center gap-4 transition-transform hover:scale-110 active:scale-95"
          >
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:bg-primary/80 transition-colors border-4 border-white/10">
               <svg fill="white" width="40" height="40" viewBox="0 0 24 24"><path d="M7 20.528V3.472c0-.38.405-.603.703-.388L20 12 7.703 20.916c-.298.215-.703-.008-.703-.388Z"></path></svg>
            </div>
            <span className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-md">Hacer clic para ver en vivo</span>
          </button>
        </div>
      )}

      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-[5]">
          <div className="flex flex-col items-center gap-3">
             <div className="w-10 h-10 border-4 border-white/20 border-t-primary rounded-full animate-spin"></div>
             <span className="text-white animate-pulse text-xs uppercase tracking-widest">Conectando...</span>
          </div>
        </div>
      )}
    </div>
  );
}