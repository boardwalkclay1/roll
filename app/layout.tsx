import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Roll & Connect",
  description: "Skate clips, events, maps, and crews."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-black text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
