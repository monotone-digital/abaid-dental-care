import { Inter, Poppins } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";

// Declared here, not in a shared module, so Next preloads them on these pages.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Every page but Home: the current design, until the new one is approved and rolled out. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome fonts={`${poppins.variable} ${inter.variable}`}>{children}</SiteChrome>;
}
