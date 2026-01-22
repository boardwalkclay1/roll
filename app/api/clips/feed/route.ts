import { auth } from "@clerk/nextjs";
import { loadCollection } from "@/lib/jsonStore";
import type { User, Clip, Follow } from "@/lib/types";

export async function GET() {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("User not found", { status: 404 });

  const clips = await loadCollection<Clip>("clips");
  const follows = await loadCollection<Follow>("follows");

  const followingIds = follows
    .filter(f => f.followerId === me.id)
    .map(f => f.followedId);

  const feed = clips
    .filter(c => c.visibility === "public" || followingIds.includes(c.userId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 50);

  return Response.json(feed);
}
