import { loadCollection } from "@/lib/jsonStore";
import type { Profile } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) return new Response("Missing username", { status: 400 });

  const profiles = await loadCollection<Profile>("profiles");
  const profile = profiles.find(p => p.username === username);

  if (!profile) return new Response("Not found", { status: 404 });

  return Response.json(profile);
}
