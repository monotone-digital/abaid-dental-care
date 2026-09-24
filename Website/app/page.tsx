import { notFound } from "next/navigation";
import HomePage from "@/components/brand/HomePage";
import ClinicJsonLd from "@/components/JsonLd";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

const page = getPage("");

export const metadata = page ? buildMetadata(page) : {};

export default function Home() {
  if (!page) notFound();

  return (
    <>
      <ClinicJsonLd />
      <HomePage page={page} />
    </>
  );
}
