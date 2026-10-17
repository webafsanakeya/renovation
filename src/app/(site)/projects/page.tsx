import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
import PageHeader from "@/components/site/PageHeader";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse our finished home renovation and custom carpentry projects and get inspired for your own home. Contact us for a free quote.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Our portfolio"
        title="Our Projects"
        description="A look at our finished work."
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="sr-only">All projects</h2>
        {projects.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
            No projects published yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <ContentCard
                key={p._id}
                href={`/projects/${p.slug}`}
                title={p.title}
                description={p.shortDescription}
                image={p.coverImage}
                meta={p.location}
                priority={i < 3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}