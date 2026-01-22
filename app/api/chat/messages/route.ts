import { auth } from "@clerk/nextjs";
import { loadCollection, saveCollection } from "@/lib/jsonStore";
import type { User, Message } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomIdParam = searchParams.get("roomId");
  if (!roomIdParam) return new Response("Missing roomId", { status: 400 });

  const roomId = Number(roomIdParam);
  if (Number.isNaN(roomId)) return new Response("Invalid roomId", { status: 400 });

  const messages = await loadCollection<Message>("messages");
  const roomMessages = messages
    .filter(m => m.roomId === roomId)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  return Response.json(roomMessages);
}

export async function POST(req: Request) {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const roomId = Number(body.roomId);
  const text = (body.text || "").trim();

  if (Number.isNaN(roomId)) return new Response("Invalid roomId", { status: 400 });
  if (!text) return new Response("Text required", { status: 400 });

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("User not found", { status: 404 });

  const messages = await loadCollection<Message>("messages");
  const nextId = messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1;

  const msg: Message = {
    id: nextId,
    roomId,
    senderId: me.id,
    contentText: text,
    contentType: "text",
    createdAt: new Date().toISOString()
  };

  messages.push(msg);
  await saveCollection<Message>("messages", messages);

  return Response.json(msg);
}
