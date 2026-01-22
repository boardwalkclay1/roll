"use client";

import { useEffect, useState } from "react";
import { SkateLoader } from "@/app/components/SkateLoader";
import { NavBar } from "@/app/components/NavBar";
import Link from "next/link";

type ChatRoom = {
  id: number;
  name?: string;
  type: string;
};

export default function ChatListPage() {
  const [rooms, setRooms] = useState<ChatRoom[] | null>(null);

  useEffect(() => {
    fetch("/api/chat/rooms")
      .then(r => r.json())
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  if (!rooms) return <SkateLoader label="Loading chatrooms..." />;

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 text-xl font-bold">Chatrooms</header>
      <section className="flex-1 overflow-y-auto">
        {rooms.length === 0 && (
          <p className="p-4 text-white/60 text-sm">No chatrooms yet.</p>
        )}
        {rooms.map(r => (
          <Link
            key={r.id}
            href={`/chat/${r.id}`}
            className="block border-b border-white/10 p-4"
          >
            <p className="font-semibold">{r.name || "Unnamed Room"}</p>
            <p className="text-xs text-white/50">{r.type}</p>
          </Link>
        ))}
      </section>
      <NavBar />
    </main>
  );
}
