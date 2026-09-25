import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Header from "@/components/brand/Header";
import Footer from "@/components/brand/Footer";
import StickyBar from "@/components/brand/StickyBar";
import { getGlobal, resolved } from "@/lib/global";
import "./globals.css";

const global = getGlobal();

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

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
  twitter: { card: resolved(global.og.image) ? "summary_large_image" : "summary" },
};

/** Every page, on the brand of September 2026: Urbanist, Warm White, the header, footer and phone bar. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" className={`${urbanist.variable} scroll-smooth`}>
      <body className="bg-warm font-brand text-copy antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-deep focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyBar />
      </body>
    </html>
  );
}
