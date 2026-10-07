import Link from "next/link";
import ContentCard from "@/components/site/ContentCard";
import { getServices, getProjects, getBlogs } from "@/lib/data";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const reasons = [
  { title: "Free Quote", text: "Clear, itemised pricing before any work begins." },
  { title: "Quality Materials", text: "Durable materials and clean, careful finishing." },
  { title: "On-Time Delivery", text: "A fixed timeline that we plan and stick to." },
  { title: "Skilled Carpenters", text: "Experienced craftsmen who treat your home with care." },
];

function Heading({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-stone-900">{title}</h2>
        <p className="mt-1 text-stone-600">{subtitle}</p>
      </div>
      <Link href={href} className="shrink-0 text-sm font-semibold text-amber-800 hover:underline">
        View all →
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
      <section className="bg-linear-to-br from-stone-950 via-stone-900 to-amber-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Carpentry &amp; Home Renovation
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Custom Carpentry and Renovation, Built to Last
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-300">{SITE.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-amber-800 px-6 py-3 font-semibold hover:bg-amber-900">
              Get Free Quote
            </Link>
            <Link href="/projects" className="rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10">
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-900">✓ {r.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Heading title="Our Services" subtitle="What we can build for your home" href="/services" />
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Heading title="Recent Projects" subtitle="A look at our finished work" href="/projects" />
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

      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Heading title="From the Blog" subtitle="Tips and ideas for your home" href="/blog" />
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

      <section className="bg-amber-900 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold">Ready to start your project?</h2>
          <p className="mt-2 text-amber-100">Tell us what you have in mind and get a free quote.</p>
          <Link href="/contact" className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-amber-900 hover:bg-amber-50">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}