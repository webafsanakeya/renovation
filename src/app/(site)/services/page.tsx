import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
import PageHeader from "@/components/site/PageHeader";
import { getServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our home renovation and custom carpentry services: kitchens, wardrobes, flooring and full-home makeovers. Get a free quote today.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="w-full">
      <PageHeader
        eyebrow="What we do"
        title="Our Services"
        description="Everything we offer for your home."
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="sr-only">All services</h2>
        {services.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
            No services published yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ContentCard
                key={s._id}
                href={`/services/${s.slug}`}
                title={s.title}
                description={s.shortDescription}
                image={s.coverImage}
                priority={i < 3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}