"use client";

import { useEffect, useState } from "react";
import { SkateLoader } from "./components/SkateLoader";
import { NavBar } from "./components/NavBar";

type Clip = {
  id: number;
  blobUrl: string;
  caption?: string;
  createdAt: string;
};

export default function HomePage() {
  const [clips, setClips] = useState<Clip[] | null>(null);

  useEffect(() => {
    fetch("/api/clips/feed")
      .then(r => r.json())
      .then(setClips)
      .catch(() => setClips([]));
  }, []);

  if (!clips) return <SkateLoader label="Loading clips..." />;

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 text-xl font-bold flex items-center justify-between">
        <span>Roll & Connect</span>
        <span className="text-xs text-white/50">Clips</span>
      </header>
      <section className="flex-1 overflow-y-auto">
        {clips.length === 0 && (
          <div className="p-6 text-center text-white/60 text-sm">
            No clips yet. Upload your first clip from the upload button (to be added).
          </div>
        )}
        {clips.map(c => (
          <article key={c.id} className="border-b border-white/10 p-4">
            <video
              src={c.blobUrl}
              controls
              className="w-full rounded-lg border border-white/20"
            />
            {c.caption && (
              <p className="mt-2 text-sm text-white/80">{c.caption}</p>
            )}
            <p className="mt-1 text-xs text-white/40">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </section>
      <NavBar />
    </main>
  );
}
