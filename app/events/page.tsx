"use client";

import { useEffect, useState } from "react";
import { SkateLoader } from "@/app/components/SkateLoader";
import { NavBar } from "@/app/components/NavBar";

type Event = {
  id: number;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  type: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    const from = new Date().toISOString();
    fetch(`/api/events?from=${encodeURIComponent(from)}`)
      .then(r => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  if (!events) return <SkateLoader label="Loading events..." />;

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 text-xl font-bold flex items-center justify-between">
        <span>Roll & Connect</span>
        <span className="text-xs text-white/50">Events</span>
      </header>
      <section className="flex-1 overflow-y-auto">
        {events.length === 0 && (
          <div className="p-6 text-center text-white/60 text-sm">
            No upcoming events. Create one from the events page (we’ll add the form in a later batch).
          </div>
        )}
        {events.map(e => (
          <article key={e.id} className="border-b border-white/10 p-4">
            <h2 className="font-semibold text-lg">{e.title}</h2>
            {e.description && (
              <p className="mt-1 text-sm text-white/80">{e.description}</p>
            )}
            <p className="mt-1 text-xs text-white/50">
              {new Date(e.startAt).toLocaleString()} –{" "}
              {new Date(e.endAt).toLocaleTimeString()}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
              {e.type}
            </p>
          </article>
        ))}
      </section>
      <NavBar />
    </main>
  );
}
