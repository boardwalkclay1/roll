import { list, put } from "@vercel/blob";

export type CollectionName =
  | "users"
  | "profiles"
  | "clips"
  | "announcements"
  | "follows"
  | "reactions"
  | "spots"
  | "events"
  | "calendarItems";

const BUCKET_PREFIX = "roll-connect";

export async function loadCollection<T>(name: CollectionName): Promise<T[]> {
  const key = `${BUCKET_PREFIX}/${name}.json`;

  const files = await list({ prefix: key });
  const file = files.blobs.find(b => b.pathname === key);

  if (!file) return [];

  const res = await fetch(file.url);
  const json = await res.json();
  return json as T[];
}

export async function saveCollection<T>(name: CollectionName, data: T[]): Promise<void> {
  const key = `${BUCKET_PREFIX}/${name}.json`;
  await put(key, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
}
