"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SkateLoader } from "@/app/components/SkateLoader";
import { NavBar } from "@/app/components/NavBar";

type Message = {
  id: number;
  senderId: string;
  contentText?: string;
  createdAt: string;
};

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [text, setText] = useState("");

  async function loadMessages() {
    const res = await fetch(`/api/chat/messages?roomId=${roomId}`);
    const data = await res.json();
    setMessages(data);
  }

  useEffect(() => {
    loadMessages();
  }, [roomId]);

  async function send() {
    if (!text.trim()) return;
    await fetch("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify({ roomId: Number(roomId), text }),
      headers: { "Content-Type": "application/json" }
    });
    setText("");
    await loadMessages();
  }

  if (!messages) return <SkateLoader label="Loading chat..." />;

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 text-xl font-bold">Chat</header>
      <section className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className="p-3 bg-white/10 rounded">
            <p className="text-sm">{m.contentText}</p>
            <p className="text-xs text-white/40">
              {new Date(m.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </section>

      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 bg-black border border-white/20 rounded p-2"
          placeholder="Message..."
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-white text-black rounded font-semibold"
        >
          Send
        </button>
      </div>

      <NavBar />
    </main>
  );
}
