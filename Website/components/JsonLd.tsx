import { getGlobal, resolved } from "@/lib/global";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const to24 = (hour: string, minute: string | undefined, meridiem: string) => {
  let h = Number(hour) % 12;
  if (meridiem.toLowerCase() === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${minute ?? "00"}`;
};

/** "10am to 1pm and 4pm to 8pm" -> [["10:00","13:00"],["16:00","20:00"]] */
function ranges(value: string): [string, string][] {
  const pattern = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*to\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi;
  const out: [string, string][] = [];
  for (const m of value.matchAll(pattern)) {
    out.push([to24(m[1], m[2], m[3]), to24(m[4], m[5], m[6])]);
  }
  return out;
}

/**
 * One Dentist node, on Home only. No aggregateRating, no review nodes, no priceRange,
 * no email, and no list of services.
 */
export default function ClinicJsonLd() {
  const global = getGlobal();

  const openingHoursSpecification = Object.entries(global.hours.week).flatMap(([index, value]) =>
    ranges(value).map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAYS[Number(index)]}`,
      opens,
      closes,
    })),
  );

  const [street, road, city] = global.address.lines;
  const geo = resolved(global.maps.geo);
  const hasMap = resolved(global.maps.url);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: global.clinic,
    url: global.siteUrl,
    telephone: global.phone.tel.replace(/^tel:/, ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: [street, road].filter(Boolean).join(", "),
      addressLocality: city,
      addressCountry: "PK",
    },
    openingHoursSpecification,
    sameAs: Object.values(global.social ?? {}),
  };

  if (geo) {
    const [latitude, longitude] = geo.split(",").map((part) => part.trim());
    data.geo = { "@type": "GeoCoordinates", latitude, longitude };
  }
  if (hasMap) data.hasMap = hasMap;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
