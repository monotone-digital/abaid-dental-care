import Header from "./Header";
import Footer from "./Footer";
import StickyBar from "./StickyBar";

/**
 * The current design's frame: header, footer and the phone's sticky WhatsApp bar. `fonts` is
 * the Poppins and Inter variable classes, from whichever layout or page declared them.
 */
export default function SiteChrome({ children, fonts }: { children: React.ReactNode; fonts: string }) {
  return (
    <div className={`${fonts} bg-white font-sans text-body`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="pb-24 lg:pb-0">
        {children}
      </main>
      <Footer />
      <StickyBar />
    </div>
  );
}
