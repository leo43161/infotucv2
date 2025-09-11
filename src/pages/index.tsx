// src/pages/index.tsx
import NavButtons from "@/components/NavButtons";
import EventCarousel from "@/components/EventCarousel";
import Itinerario from "@/components/itinerario/Itinerario";

export default function HomePage() {
  return (
    <div>
      <div className="bg-secondary p-5 text-center relative">
            <img className='absolute w-full h-full object-cover z-[0] opacity-10 object-center top-0 left-0' src="/img/header/textura-tucuman.png" alt="" />
        <h1 className="text-5xl font-bold text-white">¿EN QUÉ TE PODEMOS AYUDAR?</h1>
      </div>
      <div className="p-4">
        <NavButtons />
      </div>
      <div className="bg-gray-200">
        {/* <div className="p-5 text-center">
          <h1 className="text-3xl font-bold">Planificá tu viaje al Corazón del Norte Argentino</h1>
        </div> */}
        <div className="">
          <Itinerario />
        </div>
      </div>
      <div className="p-4">
        <EventCarousel />
      </div>
    </div>
  );
}