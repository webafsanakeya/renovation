import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
import PageHeader from "@/components/site/PageHeader";
import { getBlogs } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Renovation tips, carpentry guides and project stories from our team. Read our latest articles and watch our video walkthroughs.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const blogs = await getBlogs();
  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Journal"
        title="Blog"
        description="Tips and ideas for your home."
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="sr-only">All blog posts</h2>
        {blogs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
            No posts published yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b, i) => (
              <ContentCard
                key={b._id}
                href={`/blog/${b.slug}`}
                title={b.title}
                description={b.shortDescription}
                image={b.coverImage}
                meta={formatDate(b.createdAt)}
                priority={i < 3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}