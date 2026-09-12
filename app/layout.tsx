import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anime Kingdom | Anime Figures, Collectibles & Merchandise",
  description: "Shop premium anime figures, collectibles, accessories, gifts and anime merchandise at Anime Kingdom.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

