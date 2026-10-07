import type { Metadata } from "next";
import ContentCard from "@/components/site/ContentCard";
import { getServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: "Custom carpentry, cabinets, wardrobes and full home renovation services.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">Our Services</h1>
      <p className="mt-2 text-stone-600">Everything we offer for your home.</p>
      {services.length === 0 ? (
        <p className="mt-10 text-stone-500">No services published yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ContentCard key={s._id} href={`/services/${s.slug}`} title={s.title} description={s.shortDescription} image={s.coverImage} />
          ))}
        </div>
      )}
    </div>
  );
}