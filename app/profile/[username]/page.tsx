"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SkateLoader } from "@/app/components/SkateLoader";
import { NavBar } from "@/app/components/NavBar";

type Profile = {
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};

type Clip = {
  id: number;
  userId: string;
  blobUrl: string;
  caption?: string;
};

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clips, setClips] = useState<Clip[] | null>(null);

  useEffect(() => {
    fetch(`/api/profile?username=${username}`)
      .then(r => r.json())
      .then(setProfile)
      .catch(() => setProfile(null));

    fetch(`/api/clips/user?username=${username}`)
      .then(r => r.json())
      .then(setClips)
      .catch(() => setClips([]));
  }, [username]);

  if (!profile || !clips) return <SkateLoader label="Loading profile..." />;

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      {profile.bannerUrl && (
        <div
          className="h-32 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.bannerUrl})` }}
        />
      )}

      <div className="p-4">
        {profile.avatarUrl && (
          <img
            src={profile.avatarUrl}
            className="w-20 h-20 rounded-full border border-white/20"
          />
        )}
        <h1 className="mt-3 text-xl font-bold">{profile.displayName}</h1>
        <p className="text-sm text-white/60">@{profile.username}</p>
        {profile.bio && (
          <p className="mt-2 text-sm text-white/80">{profile.bio}</p>
        )}
      </div>

      <section className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-3">Clips</h2>
        {clips.length === 0 && (
          <p className="text-white/60 text-sm">No clips yet.</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {clips.map(c => (
            <video
              key={c.id}
              src={c.blobUrl}
              className="w-full h-40 object-cover rounded border border-white/20"
            />
          ))}
        </div>
      </section>

      <NavBar />
    </main>
  );
}
