import { auth } from "@clerk/nextjs";
import { loadCollection } from "@/lib/jsonStore";
import type { User, ChatRoom, ChatRoomMember } from "@/lib/types";

export async function GET() {
  const { userId: clerkId } = auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const users = await loadCollection<User>("users");
  const me = users.find(u => u.clerkId === clerkId);
  if (!me) return new Response("Not found", { status: 404 });

  const rooms = await loadCollection<ChatRoom>("chatRooms");
  const members = await loadCollection<ChatRoomMember>("chatRoomMembers");

  const myRooms = members
    .filter(m => m.userId === me.id)
    .map(m => rooms.find(r => r.id === m.roomId))
    .filter(Boolean);

  return Response.json(myRooms);
}
