import Link from "next/link";
import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
import Hero from "@/components/site/Hero";
import LocalBusinessJsonLd from "@/components/site/LocalBusinessJsonLd";
import { getServices, getProjects, getBlogs } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Crafting Renovation | Home Renovation & Custom Carpentry" },
  description:
    "Crafting Renovation delivers home renovation and custom carpentry: kitchens, wardrobes, flooring and full-home makeovers. See our projects, get a free quote.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Crafting Renovation | Home Renovation & Custom Carpentry",
    description: "Home renovation and custom carpentry. See our projects and get a free quote.",
    url: "/",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";
const container = "mx-auto max-w-6xl px-4 sm:px-6";
const sectionY = "py-16 sm:py-20";

const reasons = [
  { title: "Free Quote", text: "Clear, itemised pricing before any work begins." },
  { title: "Quality Materials", text: "Durable materials and clean, careful finishing." },
  { title: "On-Time Delivery", text: "A fixed timeline that we plan and stick to." },
  { title: "Skilled Carpenters", text: "Experienced craftsmen who treat your home with care." },
];

function Heading({
  id,
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-stone-600">{subtitle}</p>
      </div>
      <Link
        href={href}
        aria-label={linkLabel}
        className={`inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-amber-800 hover:underline ${focusRing}`}
      >
        View all <span aria-hidden="true" className="ml-1">→</span>
      </Link>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
      {text}
    </p>
  );
}

export default async function HomePage() {
  const [services, projects, blogs] = await Promise.all([
    getServices(3),
    getProjects(3),
    getBlogs(3),
  ]);

  return (
    <div className="w-full">
      <LocalBusinessJsonLd />

      <Hero />

      <section aria-labelledby="why-heading" className="bg-white py-14 sm:py-16">
        <h2 id="why-heading" className="sr-only">
          Why choose {SITE.name}
        </h2>
        <div className={`${container} grid gap-5 sm:grid-cols-2 lg:grid-cols-4`}>
          {reasons.map((r) => (
            <div key={r.title} className="rounded-2xl border border-stone-200 bg-stone-50/60 p-6">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-900"
              >
                ✓
              </span>
              <h3 className="mt-4 text-lg font-semibold text-stone-900">{r.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="services-heading" className={`bg-stone-50 ${sectionY}`}>
        <div className={container}>
          <Heading
            id="services-heading"
            eyebrow="What we do"
            title="Our Services"
            subtitle="What we can build for your home"
            href="/services"
            linkLabel="View all services"
          />
          {services.length === 0 ? (
            <Empty text="Services coming soon." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ContentCard key={s._id} href={`/services/${s.slug}`} title={s.title} description={s.shortDescription} image={s.coverImage} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="projects-heading" className={`bg-white ${sectionY}`}>
        <div className={container}>
          <Heading
            id="projects-heading"
            eyebrow="Our portfolio"
            title="Recent Projects"
            subtitle="A look at our finished work"
            href="/projects"
            linkLabel="View all projects"
          />
          {projects.length === 0 ? (
            <Empty text="Projects coming soon." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ContentCard key={p._id} href={`/projects/${p.slug}`} title={p.title} description={p.shortDescription} image={p.coverImage} meta={p.location} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="blog-heading" className={`bg-stone-50 ${sectionY}`}>
        <div className={container}>
          <Heading
            id="blog-heading"
            eyebrow="Journal"
            title="From the Blog"
            subtitle="Tips and ideas for your home"
            href="/blog"
            linkLabel="View all blog posts"
          />
          {blogs.length === 0 ? (
            <Empty text="Posts coming soon." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b) => (
                <ContentCard key={b._id} href={`/blog/${b.slug}`} title={b.title} description={b.shortDescription} image={b.coverImage} meta={b.author} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="cta-heading" className={`bg-amber-900 text-center text-white ${sectionY}`}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 id="cta-heading" className="text-3xl font-bold sm:text-4xl">
            Ready to start your project?
          </h2>
          <p className="mt-3 text-lg text-amber-100">Tell us what you have in mind and get a free quote.</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-8 font-semibold text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}