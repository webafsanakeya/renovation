import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
import { getBlogs } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Renovation tips, carpentry ideas and home improvement guides.",
};

export default async function BlogPage() {
  const blogs = await getBlogs();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">Blog</h1>
      <p className="mt-2 text-stone-600">Tips and ideas for your home.</p>
      {blogs.length === 0 ? (
        <p className="mt-10 text-stone-500">No posts published yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <ContentCard
              key={b._id}
              href={`/blog/${b.slug}`}
              title={b.title}
              description={b.shortDescription}
              image={b.coverImage}
              meta={formatDate(b.createdAt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}