import { auth } from "@clerk/nextjs";
import { loadCollection } from "@/lib/jsonStore";
import type { User, CalendarItem } from "@/lib/types";

export async function GET() {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("Not found", { status: 404 });

  const items = await loadCollection<CalendarItem>("calendarItems");
  const mine = items
    .filter(i => i.userId === me.id)
    .sort((a, b) => (a.startAt > b.startAt ? 1 : -1));

  return Response.json(mine);
}
