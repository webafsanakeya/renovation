import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverImage from "@/components/site/CoverImage";
import { getBlogBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { getYouTubeId } from "@/lib/youtube";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBlogBySlug(slug);
  if (!item) return { title: "Post not found" };
  return buildMetadata(item, `/blog/${item.slug}`);
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getBlogBySlug(slug);
  if (!item) notFound();

  const videoId = getYouTubeId(item.videoUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: item.title,
    description: item.shortDescription,
    image: item.coverImage || undefined,
    datePublished: item.createdAt,
    author: { "@type": "Person", name: item.author || "Admin" },
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog" className="text-sm font-medium text-amber-800 hover:underline">
        ← All posts
      </Link>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">{item.title}</h1>
      <p className="mt-3 text-sm text-stone-500">
        By {item.author || "Admin"} · {formatDate(item.createdAt)}
      </p>
      <CoverImage src={item.coverImage} alt={item.title} sizes="(min-width: 768px) 768px, 100vw" className="mt-8 aspect-video w-full rounded-xl" />

        {videoId && (
        <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-stone-900">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={item.title}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-stone-800">{item.content}</div>
    </article>
  );
}