"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { SkateLoader } from "@/app/components/SkateLoader";
import { NavBar } from "@/app/components/NavBar";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

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
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(["skate_park", "street_spot"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-84.39, 33.75],
      zoom: 11
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    setLoading(true);

    const params = new URLSearchParams();
    activeFilters.forEach(t => params.append("type", t));

    fetch(`/api/spots?${params.toString()}`)
      .then(r => r.json())
      .then((spots: Spot[]) => {
        (mapRef.current as any)._markers?.forEach((m: mapboxgl.Marker) => m.remove());
        (mapRef.current as any)._markers = [];

        spots.forEach(s => {
          const marker = new mapboxgl.Marker({ color: "#00ffcc" })
            .setLngLat([s.lng, s.lat])
            .setPopup(
              new mapboxgl.Popup().setText(
                `${s.name} (${s.type.replace("_", " ")})`
              )
            )
            .addTo(mapRef.current!);
          (mapRef.current as any)._markers.push(marker);
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeFilters]);

  function toggleFilter(type: string) {
    setActiveFilters(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 text-xl font-bold flex items-center justify-between">
        <span>Roll & Connect</span>
        <span className="text-xs text-white/50">Map</span>
      </header>
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
