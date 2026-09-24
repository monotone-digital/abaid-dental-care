import Container from "@/components/Container";
import { LinkButton, Pill, WhatsAppButton } from "@/components/brand/ui";
import { getGlobal } from "@/lib/global";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  const global = getGlobal();

  return (
    <Container className="py-24 lg:py-32">
      <div className="max-w-[46ch]">
        <Pill>{global.clinic}</Pill>
        <h1 className="mt-5 text-[2.35rem] font-normal leading-[1.06] tracking-[-0.035em] text-charcoal sm:text-[3.1rem]">
          Page not found
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.7] text-copy">
          That page is not on this site. The pages that are, are in the menu.
        </p>

        <div className="mt-8 flex flex-wrap items-stretch gap-3">
          <WhatsAppButton href={global.whatsapp} label="Message us on WhatsApp" />
          <LinkButton href="/" label="Go to the home page" />
        </div>
      </div>
    </Container>
  );
}
