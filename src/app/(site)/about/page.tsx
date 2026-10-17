import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Meet the carpenters and renovation specialists behind ${SITE.name}. Learn how we work, from the first consultation to the final handover.`,
  alternates: { canonical: "/about" },
};

const steps = [
  { title: "Consultation", text: "We visit, listen and understand what you need." },
  { title: "Design & Quote", text: "You get a clear plan, timeline and itemised price." },
  { title: "Build", text: "Our carpenters build with care and keep you updated." },
  { title: "Handover", text: "We check every detail with you before we finish." },
];

export default function AboutPage() {
  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Who we are"
        title={`About ${SITE.name}`}
        description="We are a team of carpenters and renovation specialists who care about quality, honest pricing and homes that work for the people living in them."
      />

      <section aria-labelledby="story-heading" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 id="story-heading" className="text-3xl font-bold tracking-tight text-stone-900">
          Our Story
        </h2>
        <p className="mt-4 text-lg leading-8 text-stone-700">
          What started as a small carpentry workshop has grown into a full renovation service.
          We still approach every job the same way: measure carefully, build properly and
          communicate clearly. Whether it is a single wardrobe or a complete kitchen, we treat
          your home like our own.
        </p>
      </section>

      <section aria-labelledby="process-heading" className="bg-stone-50 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="process-heading" className="text-3xl font-bold tracking-tight text-stone-900">
            How We Work
          </h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-stone-200 bg-white p-6">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-900"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="about-cta" className="bg-amber-900 py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 id="about-cta" className="text-3xl font-bold">Let&apos;s talk about your home</h2>
          <p className="mt-3 text-lg text-amber-100">Share your idea and we will get back with a free quote.</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-8 font-semibold text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Talk to Us
          </Link>
        </div>
      </section>
    </div>
  );
}