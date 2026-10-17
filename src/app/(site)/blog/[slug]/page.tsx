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
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Link
        href="/blog"
        className="inline-flex min-h-11 items-center text-sm font-medium text-amber-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        <span aria-hidden="true" className="mr-1">←</span> All posts
      </Link>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">{item.title}</h1>
      <p className="mt-4 text-sm text-stone-500">
        By {item.author || "Admin"} ·{" "}
        <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
      </p>

      {videoId ? (
        <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-stone-900">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={item.title}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <CoverImage
          src={item.coverImage}
          alt={item.title}
          priority
          sizes="(min-width: 768px) 704px, 100vw"
          className="mt-8 aspect-video w-full rounded-2xl"
        />
      )}

      <div className="mt-10 whitespace-pre-line text-base leading-8 text-stone-800 sm:text-lg">
        {item.content}
      </div>

      <section
        aria-labelledby="blog-cta"
        className="mt-14 rounded-2xl bg-amber-900 p-8 text-center text-white sm:p-10"
      >
        <h2 id="blog-cta" className="text-2xl font-bold sm:text-3xl">
          Planning a project of your own?
        </h2>
        <p className="mt-2 text-amber-100">Tell us what you have in mind and get a free quote.</p>
        <Link
          href="/contact"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-white px-8 font-semibold text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Get a Free Quote
        </Link>
      </section>
    </article>
  );
}