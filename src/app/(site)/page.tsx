import Link from "next/link";
import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
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

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

const reasons = [
  { title: "Free Quote", text: "Clear, itemised pricing before any work begins." },
  { title: "Quality Materials", text: "Durable materials and clean, careful finishing." },
  { title: "On-Time Delivery", text: "A fixed timeline that we plan and stick to." },
  { title: "Skilled Carpenters", text: "Experienced craftsmen who treat your home with care." },
];

function Heading({
  id,
  title,
  subtitle,
  href,
  linkLabel,
}: {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-3xl font-bold tracking-tight text-stone-900">
          {title}
        </h2>
        <p className="mt-1 text-stone-600">{subtitle}</p>
      </div>
      <Link
        href={href}
        aria-label={linkLabel}
        className={`shrink-0 text-sm font-semibold text-amber-800 hover:underline ${focusRing}`}
      >
        View all <span aria-hidden="true">→</span>
      </Link>
    </div>
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

      <section aria-labelledby="hero-heading" className="bg-linear-to-br from-stone-950 via-stone-900 to-amber-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Carpentry &amp; Home Renovation
          </span>
          <h1 id="hero-heading" className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Custom Carpentry and Renovation, Built to Last
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-300">{SITE.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className={`rounded-full bg-amber-800 px-6 py-3 font-semibold hover:bg-amber-900 ${focusRing}`}>
              Get Free Quote
            </Link>
            <Link href="/projects" className={`rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10 ${focusRing}`}>
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="why-heading" className="bg-white py-14">
        <h2 id="why-heading" className="sr-only">
          Why choose {SITE.name}
        </h2>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-900">
                <span aria-hidden="true" className="text-amber-800">✓</span> {r.title}
              </h3>
              <p className="mt-1 text-sm text-stone-600">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="services-heading" className="bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Heading
            id="services-heading"
            title="Our Services"
            subtitle="What we can build for your home"
            href="/services"
            linkLabel="View all services"
          />
          {services.length === 0 ? (
            <p className="text-stone-500">Services coming soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ContentCard key={s._id} href={`/services/${s.slug}`} title={s.title} description={s.shortDescription} image={s.coverImage} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="projects-heading" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Heading
            id="projects-heading"
            title="Recent Projects"
            subtitle="A look at our finished work"
            href="/projects"
            linkLabel="View all projects"
          />
          {projects.length === 0 ? (
            <p className="text-stone-500">Projects coming soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ContentCard key={p._id} href={`/projects/${p.slug}`} title={p.title} description={p.shortDescription} image={p.coverImage} meta={p.location} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="blog-heading" className="bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Heading
            id="blog-heading"
            title="From the Blog"
            subtitle="Tips and ideas for your home"
            href="/blog"
            linkLabel="View all blog posts"
          />
          {blogs.length === 0 ? (
            <p className="text-stone-500">Posts coming soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b) => (
                <ContentCard key={b._id} href={`/blog/${b.slug}`} title={b.title} description={b.shortDescription} image={b.coverImage} meta={b.author} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="cta-heading" className="bg-amber-900 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 id="cta-heading" className="text-3xl font-bold">Ready to start your project?</h2>
          <p className="mt-2 text-amber-100">Tell us what you have in mind and get a free quote.</p>
          <Link href="/contact" className={`mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-amber-900 hover:bg-amber-50 ${focusRing}`}>
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}