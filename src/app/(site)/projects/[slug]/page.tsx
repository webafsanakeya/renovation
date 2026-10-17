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
    <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/projects"
        className="inline-flex min-h-11 items-center text-sm font-medium text-amber-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        <span aria-hidden="true" className="mr-1">←</span> All projects
      </Link>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">{item.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">{item.shortDescription}</p>

      {(item.location || item.completedAt) && (
        <ul className="mt-5 flex flex-wrap gap-2 text-sm">
          {item.location && (
            <li className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
              <span aria-hidden="true">📍 </span>
              {item.location}
            </li>
          )}
          {item.completedAt && (
            <li className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
              Completed {formatDate(item.completedAt)}
            </li>
          )}
        </ul>
      )}

      <CoverImage
        src={item.coverImage}
        alt={item.title}
        priority
        sizes="(min-width: 896px) 832px, 100vw"
        className="mt-8 aspect-video w-full rounded-2xl"
      />

      <div className="mt-10 whitespace-pre-line text-base leading-8 text-stone-800 sm:text-lg">
        {item.content}
      </div>

      {item.gallery && item.gallery.length > 0 && (
        <section aria-labelledby="gallery-heading" className="mt-14">
          <h2 id="gallery-heading" className="mb-5 text-2xl font-semibold text-stone-900 sm:text-3xl">
            Gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {item.gallery.map((src, i) => (
              <CoverImage
                key={i}
                src={src}
                alt={`${item.title} photo ${i + 1}`}
                sizes="(min-width: 768px) 416px, 100vw"
                className="aspect-video w-full rounded-xl"
              />
            ))}
          </div>
        </section>
      )}

      <section
        aria-labelledby="project-cta"
        className="mt-14 rounded-2xl bg-amber-900 p-8 text-center text-white sm:p-10"
      >
        <h2 id="project-cta" className="text-2xl font-bold sm:text-3xl">
          Want a result like this?
        </h2>
        <p className="mt-2 text-amber-100">Tell us about your project and get a free quote.</p>
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