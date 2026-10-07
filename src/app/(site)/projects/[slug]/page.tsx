import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverImage from "@/components/site/CoverImage";
import { getProjectBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getProjectBySlug(slug);
  if (!item) return { title: "Project not found" };
  return buildMetadata(item, `/projects/${item.slug}`);
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getProjectBySlug(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-14">
      <Link href="/projects" className="text-sm font-medium text-amber-800 hover:underline">
        ← All projects
      </Link>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">{item.title}</h1>
      <p className="mt-3 text-lg text-stone-600">{item.shortDescription}</p>
      <p className="mt-3 text-sm text-stone-500">
        {item.location && <span>📍 {item.location}</span>}
        {item.location && item.completedAt && <span> · </span>}
        {item.completedAt && <span>Completed {formatDate(item.completedAt)}</span>}
      </p>
      <CoverImage src={item.coverImage} alt={item.title} className="mt-8 aspect-video w-full rounded-xl" />
      <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-stone-800">{item.content}</div>

      {item.gallery && item.gallery.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold text-stone-900">Gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {item.gallery.map((src, i) => (
              <CoverImage key={i} src={src} alt={`${item.title} photo ${i + 1}`} className="aspect-video w-full rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}