import { auth } from "@clerk/nextjs";
import { loadCollection, saveCollection } from "@/lib/jsonStore";
import type { User, Event } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const events = await loadCollection<Event>("events");
  let filtered = events;

  if (from) filtered = filtered.filter(e => e.startAt >= from);
  if (to) filtered = filtered.filter(e => e.startAt <= to);

  filtered = filtered
    .filter(e => e.visibility === "public")
    .sort((a, b) => (a.startAt > b.startAt ? 1 : -1));

  return Response.json(filtered);
}

export async function POST(req: Request) {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { title, description, spotId, startAt, endAt, type, maxAttendees, visibility } =
    await req.json();

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("User not found", { status: 404 });

  const events = await loadCollection<Event>("events");
  const nextId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;

  const event: Event = {
    id: nextId,
    title,
    description,
    hostUserId: me.id,
    spotId,
    startAt,
    endAt,
    type,
    maxAttendees,
    visibility: visibility ?? "public"
  };

  events.push(event);
  await saveCollection<Event>("events", events);

  return Response.json(event);
}
