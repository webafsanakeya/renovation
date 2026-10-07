import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverImage from "@/components/site/CoverImage";
import { getServiceBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getServiceBySlug(slug);
  if (!item) return { title: "Service not found" };
  return buildMetadata(item, `/services/${item.slug}`);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getServiceBySlug(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-14">
      <Link href="/services" className="text-sm font-medium text-amber-800 hover:underline">
        ← All services
      </Link>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">{item.title}</h1>
      <p className="mt-3 text-lg text-stone-600">{item.shortDescription}</p>
      <CoverImage src={item.coverImage} alt={item.title} className="mt-8 aspect-video w-full rounded-xl" />
      <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-stone-800">{item.content}</div>
      <Link href="/contact" className="mt-10 inline-block rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900">
        Get a Free Quote
      </Link>
    </article>
  );
}