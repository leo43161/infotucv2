// src/pages/index.tsx
import NavButtons from "@/components/NavButtons";
import EventCarousel from "@/components/EventCarousel";

export default function HomePage() {
  return (
    <div>
      <div className="bg-secondary p-5 text-center">
        <h1 className="text-4xl font-bold text-white">¿EN QUÉ TE PODEMOS AYUDAR?</h1>
      </div>
      <div className="p-4">
        <NavButtons />
      </div>
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold">
          Itinerario Inteligente (Próximamente)
        </h2>
      </div>
      <div className="p-4">
        <EventCarousel />
      </div>
    </div>
  );
}