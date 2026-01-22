import { auth } from "@clerk/nextjs";
import { loadCollection, saveCollection } from "@/lib/jsonStore";
import type { User, Profile } from "@/lib/types";

export async function POST(req: Request) {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("Not found", { status: 404 });

  const profiles = await loadCollection<Profile>("profiles");
  const idx = profiles.findIndex(p => p.userId === me.id);

  if (idx === -1) return new Response("Not found", { status: 404 });

  profiles[idx] = { ...profiles[idx], ...body };

  await saveCollection<Profile>("profiles", profiles);

  return Response.json({ ok: true });
}
