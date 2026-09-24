import { Urbanist } from "next/font/google";
import Header from "@/components/brand/Header";
import Footer from "@/components/brand/Footer";
import StickyBar from "@/components/brand/StickyBar";

// Declared here, not in a shared module, so Next preloads it on Home (and only Home).
const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

/** Home, on the new brand: Urbanist, Warm White, the new header and footer. */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${urbanist.variable} bg-warm font-brand text-copy`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-deep focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        {children}
      </main>
      <Footer />
      <StickyBar />
    </div>
  );
}
