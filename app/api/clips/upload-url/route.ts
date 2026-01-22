import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { fileName, contentType } = await req.json();

  const { url } = await put(`roll-connect/clips/${fileName}`, Buffer.alloc(0), {
    access: "public",
    contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });

  return Response.json({ uploadUrl: url });
}
