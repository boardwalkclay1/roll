import { auth } from "@clerk/nextjs";
import { loadCollection } from "@/lib/jsonStore";
import type { User, Profile } from "@/lib/types";

export async function GET() {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("Not found", { status: 404 });

  const profiles = await loadCollection<Profile>("profiles");
  const profile = profiles.find(p => p.userId === me.id);

  return Response.json(profile);
}
