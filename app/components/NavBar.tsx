"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Clips" },
  { href: "/feed/announcements", label: "Announcements" },
  { href: "/events", label: "Events" },
  { href: "/maps", label: "Map" }
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="h-14 border-t border-white/10 flex items-center justify-around bg-black/90 backdrop-blur">
      {items.map(item => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-xs uppercase tracking-[0.2em] ${
              active ? "text-[#00ffcc]" : "text-white/60"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
