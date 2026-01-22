import { auth } from "@clerk/nextjs";
import { loadCollection, saveCollection } from "@/lib/jsonStore";
import type { User, Message } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomId = Number(searchParams.get("roomId"));

  const messages = await loadCollection<Message>("messages");
  const roomMessages = messages
    .filter(m => m.roomId === roomId)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  return Response.json(roomMessages);
}

export async function POST(req: Request) {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { roomId, text } = await req.json();

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("Not found", { status: 404 });

  const messages =
