"use client";

import { useEffect, useState } from "react";
import { SkateLoader } from "@/app/components/SkateLoader";
import { NavBar } from "@/app/components/NavBar";

type CalendarItem = {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  type: string;
};

export default function CalendarPage() {
  const [items, setItems] = useState<CalendarItem[] | null>(null);

  useEffect(() => {
    fetch("/api/calendar")
      .then(r => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  if (!items) return <SkateLoader label="Loading calendar..." />;

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 text-xl font-bold">Calendar</header>
      <section className="flex-1 overflow-y-auto p-4">
        {items.length === 0 && (
          <p className="text-white/60 text-sm">No upcoming items.</p>
        )}
        {items.map(i => (
          <article key={i.id} className="border-b border-white/10 p-4">
            <h2 className="font-semibold">{i.title}</h2>
            <p className="text-xs text-white/50">
              {new Date(i.startAt).toLocaleString()} –{" "}
              {new Date(i.endAt).toLocaleTimeString()}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              {i.type}
            </p>
          </article>
        ))}
      </section>
      <NavBar />
    </main>
  );
}
