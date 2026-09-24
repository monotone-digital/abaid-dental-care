import { Inter, Poppins } from "next/font/google";
import Container from "@/components/Container";
import SiteChrome from "@/components/SiteChrome";
import { TextLink, WhatsAppButton } from "@/components/Buttons";
import { getGlobal } from "@/lib/global";

// The (site) layout's fonts again: same files, so nothing downloads twice, and a font can
// only be preloaded from the layout or page that declares it.
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

export const metadata = { title: "Page not found" };

/** Sits outside both route groups, so it brings its own frame (the current design). */
export default function NotFound() {
  const global = getGlobal();

  return (
    <SiteChrome fonts={`${poppins.variable} ${inter.variable}`}>
      <Container className="py-24 lg:py-32">
        <div className="max-w-[46ch]">
          <h1 className="font-display text-[2.1rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2.7rem]">
            Page not found
          </h1>
          <p className="mt-5 text-lg leading-[1.75] text-body">
            That page is not on this site. The pages that are, are in the menu.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WhatsAppButton href={global.whatsapp} label="Message us on WhatsApp" />
            <TextLink href="/" label="Go to the home page" />
          </div>
        </div>
      </Container>
    </SiteChrome>
  );
}
