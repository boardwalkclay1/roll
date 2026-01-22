import { auth } from "@clerk/nextjs";
import { loadCollection, saveCollection } from "@/lib/jsonStore";
import type { User, Announcement } from "@/lib/types";

export async function POST(req: Request) {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { text, visibility } = await req.json();
  if (!text || !text.trim()) return new Response("Text required", { status: 400 });

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("User not found", { status: 404 });

  const announcements = await loadCollection<Announcement>("announcements");
  const nextId = announcements.length ? Math.max(...announcements.map(a => a.id)) + 1 : 1;

  const post: Announcement = {
    id: nextId,
    userId: me.id,
    text: text.trim(),
    visibility: visibility ?? "public",
    createdAt: new Date().toISOString()
  };

  announcements.push(post);
  await saveCollection<Announcement>("announcements", announcements);

  return Response.json(post);
}
