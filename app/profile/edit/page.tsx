"use client";

import { useEffect, useState } from "react";
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

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile/me")
      .then(r => r.json())
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify(profile),
      headers: { "Content-Type": "application/json" }
    });
    setSaving(false);
  }

  if (!profile) return <SkateLoader label="Loading profile..." />;

  return (
    <main className="h-screen flex flex-col bg-black text-white p-4">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

      <label className="text-sm">Display Name</label>
      <input
        value={profile.displayName}
        onChange={e => setProfile({ ...profile, displayName: e.target.value })}
        className="w-full bg-black border border-white/20 rounded p-2 mb-4"
      />

      <label className="text-sm">Bio</label>
      <textarea
        value={profile.bio}
        onChange={e => setProfile({ ...profile, bio: e.target.value })}
        className="w-full bg-black border border-white/20 rounded p-2 mb-4"
      />

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-2 bg-white text-black rounded font-semibold"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      <NavBar />
    </main>
  );
}
