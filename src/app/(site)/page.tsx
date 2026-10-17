import Link from "next/link";
import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
import Hero from "@/components/site/Hero";
import LocalBusinessJsonLd from "@/components/site/LocalBusinessJsonLd";
import {
  AboutTeaser,
  ContactBand,
  CtaBand,
  FeatureStrip,
  HowWeWork,
  PortfolioGallery,
  SectionTitle,
  WhyChoose,
} from "@/components/site/HomeSections";
import { getServices, getProjects, getBlogs } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    absolute: "Crafting Renovation | Home Renovation & Custom Carpentry",
  },
  description:
    "Crafting Renovation delivers home renovation and custom carpentry: kitchens, wardrobes, flooring and full-home makeovers. See our projects, get a free quote.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Crafting Renovation | Home Renovation & Custom Carpentry",
    description:
      "Home renovation and custom carpentry. See our projects and get a free quote.",
    url: "/",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const container = "mx-auto max-w-6xl px-4 sm:px-6";
const sectionY = "py-16 sm:py-20";
const ABOUT_IMAGE: string | undefined =
  "https://images.unsplash.com/photo-1582528617848-af3c559c4d71?auto=format&fit=crop&w=1200&q=75";
const WHY_IMAGE: string | undefined =
  "https://images.unsplash.com/photo-1549222270-060b52e953f5?auto=format&fit=crop&w=1200&q=75";

function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-10 text-center">
      <Link
        href={href}
        className="inline-flex min-h-12 items-center rounded-full border border-amber-800 px-7 font-semibold text-amber-900 transition-colors hover:bg-amber-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        {label}{" "}
        <span aria-hidden="true" className="ml-2">
          →
        </span>
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
    getServices(6),
    getProjects(9),
    getBlogs(3),
  ]);

  return (
    <div className="w-full">
      <LocalBusinessJsonLd />

      <Hero />
      <FeatureStrip />

      <section
        aria-labelledby="services-heading"
        className={`bg-[#f3ebe1] ${sectionY}`}
      >
        <div className={container}>
          <SectionTitle
            id="services-heading"
            eyebrow="What we do"
            title="Services Built Around Your Home"
            subtitle="From a single wardrobe to a full renovation."
          />
          {services.length === 0 ? (
            <Empty text="Services coming soon." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ContentCard
                  key={s._id}
                  href={`/services/${s.slug}`}
                  title={s.title}
                  description={s.shortDescription}
                  image={s.coverImage}
                />
              ))}
            </div>
          )}
          <ViewAll href="/services" label="View all services" />
        </div>
      </section>

      <ContactBand />
      <AboutTeaser image={ABOUT_IMAGE ?? projects[0]?.coverImage} />
      <WhyChoose
        image={WHY_IMAGE ?? projects[1]?.coverImage ?? projects[0]?.coverImage}
      />

      <section
        aria-labelledby="projects-heading"
        className={`bg-white ${sectionY}`}
      >
        <div className={container}>
          <SectionTitle
            id="projects-heading"
            eyebrow="Our portfolio"
            title="Recent Projects"
            subtitle="A look at our finished work."
          />
          {projects.length === 0 ? (
            <Empty text="Projects coming soon." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 3).map((p) => (
                <ContentCard
                  key={p._id}
                  href={`/projects/${p.slug}`}
                  title={p.title}
                  description={p.shortDescription}
                  image={p.coverImage}
                  meta={p.location}
                />
              ))}
            </div>
          )}
          <ViewAll href="/projects" label="View all projects" />
        </div>
      </section>

      <HowWeWork />
      <PortfolioGallery projects={projects} />

      <section
        aria-labelledby="blog-heading"
        className={`bg-[#f3ebe1] ${sectionY}`}
      >
        <div className={container}>
          <SectionTitle
            id="blog-heading"
            eyebrow="Journal"
            title="From the Blog"
            subtitle="Tips and ideas for your home."
          />
          {blogs.length === 0 ? (
            <Empty text="Posts coming soon." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b) => (
                <ContentCard
                  key={b._id}
                  href={`/blog/${b.slug}`}
                  title={b.title}
                  description={b.shortDescription}
                  image={b.coverImage}
                  meta={b.author}
                />
              ))}
            </div>
          )}
          <ViewAll href="/blog" label="View all posts" />
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
