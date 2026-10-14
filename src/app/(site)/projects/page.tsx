import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Renovation tips, carpentry guides and project stories from our team. Read our latest articles and watch our video walkthroughs.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">Our Projects</h1>
      <p className="mt-2 text-stone-600">A look at our finished work.</p>
      <h2 className="sr-only">All projects</h2>
      {projects.length === 0 ? (
        <p className="mt-10 text-stone-500">No projects published yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
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
    </div>
  );
}