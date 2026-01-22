import { auth, currentUser } from "@clerk/nextjs";
import { loadCollection, saveCollection } from "@/lib/jsonStore";
import type { User, Profile } from "@/lib/types";
import { randomUUID } from "crypto";

export async function POST() {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const clerkUser = await currentUser();
  if (!clerkUser) return new Response("Unauthorized", { status: 401 });

  const users = await loadCollection<User>("users");
  let me = users.find(u => u.clerkId === clerkId);

  if (!me) {
    me = {
      id: randomUUID(),
      clerkId,
      createdAt: new Date().toISOString()
    };
    users.push(me);
    await saveCollection<User>("users", users);

    const profiles = await loadCollection<Profile>("profiles");
    profiles.push({
      userId: me.id,
      username: `skater_${me.id.slice(0, 6)}`,
      displayName: clerkUser.username || clerkUser.firstName || "New Skater",
      bio: "",
      socialLinks: {}
    });
    await saveCollection<Profile>("profiles", profiles);
  }

  return Response.json({ ok: true });
}
