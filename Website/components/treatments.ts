import type { ComponentType, SVGProps } from "react";
import {
  AlignerIcon,
  BracesIcon,
  CapIcon,
  CleaningIcon,
  ExtractionIcon,
  FillingIcon,
  RootCanalIcon,
  WhiteningIcon,
} from "./Icons";

export type TreatmentMeta = {
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  image: string;
  alt: string;
  /** A minimal picture shown only while the treatment is hovered, on Home (Public/Images/Site/hover-*). */
  hover?: string;
};

/** Each treatment name in Home's approved price list, matched to its page, its icon and its picture. */
export const TREATMENTS: Record<string, TreatmentMeta> = {
  "Caps and bridges": {
    href: "/caps-and-bridges",
    Icon: CapIcon,
    image: "caps-and-bridges",
    alt: "A ceramic crown held in tweezers",
    hover: "hover-caps-and-bridges",
  },
  "Root canal": {
    href: "/root-canal",
    Icon: RootCanalIcon,
    image: "root-canal",
    alt: "A dental X-ray on the clinic screen",
    hover: "hover-root-canal",
  },
  "Tooth removal": {
    href: "/tooth-removal",
    Icon: ExtractionIcon,
    image: "tooth-removal",
    alt: "Extraction instruments laid out on a tray",
    hover: "hover-tooth-removal",
  },
  "Teeth cleaning": {
    href: "/teeth-cleaning",
    Icon: CleaningIcon,
    image: "teeth-cleaning",
    alt: "Teeth being cleaned with a scaler and a dental mirror",
    hover: "hover-teeth-cleaning",
  },
  Fillings: {
    href: "/fillings",
    Icon: FillingIcon,
    image: "fillings",
    alt: "A filling being placed in a molar",
    hover: "hover-fillings",
  },
  "Teeth whitening": {
    href: "/teeth-whitening",
    Icon: WhiteningIcon,
    image: "teeth-whitening",
    alt: "A tooth shade tab held against the front teeth",
    hover: "hover-teeth-whitening",
  },
  Braces: {
    href: "/braces-and-aligners",
    Icon: BracesIcon,
    image: "braces-and-aligners",
    alt: "Braces on upper teeth, with a clear aligner tray beside them",
  },
  "Clear aligners": {
    href: "/braces-and-aligners",
    Icon: AlignerIcon,
    image: "clear-aligners",
    alt: "A clear aligner tray held in a gloved hand",
  },
};

/** "Caps and bridges, from PKR 5,000" -> the name and the price, both verbatim. */
export function parsePriceList(body: string) {
  const rows: { name: string; price: string }[] = [];
  for (const raw of body.split("\n")) {
    const item = /^[-*]\s+(.*?),\s*(from PKR .+?)\s*$/i.exec(raw.trim());
    if (item) rows.push({ name: item[1].trim(), price: item[2].trim() });
  }
  return rows;
}
