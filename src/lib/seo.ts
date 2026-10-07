import type { Metadata } from "next";
import type { ContentItem } from "@/lib/data";

export function buildMetadata(item: ContentItem, path: string): Metadata {
  const title = item.seo?.metaTitle || item.title;
  const description = item.seo?.metaDescription || item.shortDescription;
  const image = item.seo?.ogImage || item.coverImage;
  return {
    title,
    description,
    keywords: item.seo?.keywords,
    alternates: { canonical: item.seo?.canonicalUrl || path },
    openGraph: {
          title: item.seo?.metaTitle ? { absolute: item.seo.metaTitle } : item.title,
      description: item.seo?.ogDescription || description,
      images: image ? [image] : undefined,
    },
  };
}