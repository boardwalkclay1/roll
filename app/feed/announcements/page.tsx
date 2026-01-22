"use client";

import { useEffect, useState } from "react";
import { SkateLoader } from "@/app/components/SkateLoader";
import { NavBar } from "@/app/components/NavBar";

type Announcement = {
  id: number;
  text: string;
  createdAt: string;
};

export default function AnnouncementsFeedPage() {
  const [posts, setPosts] = useState<Announcement[] | null>(null);
  const [text, setText] = useState("");

  async function loadFeed() {
    const res = await fetch("/api/announcements/feed");
    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    loadFeed();
  }, []);

  async function createPost() {
    if (!text.trim()) return;
    const res = await fetch("/api/announcements/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      setText("");
      await loadFeed();
    }
  }

  if (!posts) return <SkateLoader label="Loading announcements..." />;

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 text-xl font-bold flex items-center justify-between">
        <span>Roll & Connect</span>
        <span className="text-xs text-white/50">Announcements</span>
      </header>
      <section className="p-4 border-b border-white/10">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full bg-black border border-white/30 rounded p-2 text-sm"
          placeholder="Drop a skate announcement..."
        />
        <button
          onClick={createPost}
          className="mt-2 px-4 py-2 rounded bg-white text-black font-semibold"
        >
          Post
        </button>
      </section>
      <section className="flex-1 overflow-y-auto">
        {posts.length === 0 && (
          <div className="p-6 text-center text-white/60 text-sm">
            No announcements yet. Be the first to call a session.
          </div>
        )}
        {posts.map(p => (
          <article key={p.id} className="border-b border-white/10 p-4">
            <p className="text-sm">{p.text}</p>
            <p className="mt-1 text-xs text-white/40">
              {new Date(p.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </section>
      <NavBar />
    </main>
  );
}
