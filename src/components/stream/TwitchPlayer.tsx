"use client";

import { useEffect, useState } from "react";

interface TwitchPlayerProps {
  channel: string;
  autoplay?: boolean;
  muted?: boolean;
}

export default function TwitchPlayer({
  channel,
  autoplay = true,
  muted = true
}: TwitchPlayerProps) {
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    // Obtenemos el dominio actual (localhost o tu-web.com)
    setHost(window.location.hostname);
  }, []);

  // Mientras no tengamos el host, no renderizamos el iframe para evitar errores
  if (!host) {
    return (
      <div className="aspect-video w-full animate-pulse bg-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-white">Cargando stream...</span>
      </div>
    );
  }
  const embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${host}&autoplay=${autoplay}&muted=${muted}`;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
      <iframe
        src={embedUrl}
        height="100%"
        width="100%"
        allowFullScreen>
      </iframe>
    </div>
  );
}