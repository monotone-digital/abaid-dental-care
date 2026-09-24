import type { Metadata } from "next";
import { getGlobal, resolved } from "@/lib/global";
import "./globals.css";

const global = getGlobal();

export const metadata: Metadata = {
  metadataBase: new URL(global.siteUrl),
  title: global.clinic,
  description: global.og.description,
  openGraph: {
    type: "website",
    siteName: global.clinic,
    title: global.og.title,
    description: global.og.description,
    locale: "en_PK",
    ...(resolved(global.og.image) ? { images: [resolved(global.og.image) as string] } : {}),
  },
};

/**
 * The document only. The header, footer, fonts and page colour come from the route group:
 * (home) is on the new brand, (site) keeps the current design until the new one is approved.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
