import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentPage from "@/components/brand/page/ContentPage";
import PageJsonLd from "@/components/JsonLd";
import { getPage, getPages } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPages()
    .filter((page) => page.slug !== "")
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  return page ? buildMetadata(page) : {};
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  return (
    <>
      <PageJsonLd page={page} />
      <ContentPage page={page} />
    </>
  );
}
