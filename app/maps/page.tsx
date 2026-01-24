"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SkateLoader } from "@/app/components/SkateLoader";
import { NavBar } from "@/app/components/NavBar";

type Spot = {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
};

const FILTERS = [
  "skate_park",
  "street_spot",
  "parking_garage",
  "parking_lot",
  "park",
  "food",
  "water"
];

export default function MapsPage() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(["skate_park", "street_spot"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current).setView([33.75, -84.39], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors"
    }).addTo(mapRef.current);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    setLoading(true);

    const params = new URLSearchParams();
    activeFilters.forEach(t => params.append("type", t));

    fetch(`/api/spots?${params.toString()}`)
      .then(r => r.json())
      .then((spots: Spot[]) => {
        mapRef.current!.eachLayer(layer => {
          if ((layer as any)._url) return;
          mapRef.current!.removeLayer(layer);
        });

        spots.forEach(s => {
          L.marker([s.lat, s.lng], {
            icon: L.divIcon({
              className: "custom-marker",
              html: `<div style="width:14px;height:14px;border-radius:50%;background:#00ffcc;box-shadow:0 0 8px #00ffcc;"></div>`
            })
          })
            .addTo(mapRef.current!)
            .bindPopup(`${s.name} (${s.type.replace("_", " ")})`);
        });

        setLoading(false);
      });
  }, [activeFilters]);

  function toggleFilter(type: string) {
    setActiveFilters(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 text-xl font-bold">Skate Map</header>

      <div className="p-2 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className={`px-3 py-1 rounded-full text-xs border ${
              activeFilters.includes(f)
                ? "bg-[#00ffcc] text-black border-[#00ffcc]"
                : "border-white/30 text-white/70"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <div ref={mapContainer} className="absolute inset-0" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <SkateLoader label="Loading map..." />
          </div>
        )}
      </div>

      <NavBar />
    </main>
  );
}
