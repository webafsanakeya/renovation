import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import PageHeader from "@/components/site/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SITE.name} for a free quote on your carpentry or home renovation project. Call, email or send us a message and we will get back to you.`,
  alternates: { canonical: "/contact" },
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

export default function ContactPage() {
  const phoneHref = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`;

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        description="Tell us about your project and get a free quote."
      />

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-3">
        <section
          aria-labelledby="details-heading"
          className="h-fit rounded-2xl bg-stone-950 p-8 text-stone-200 lg:col-span-1"
        >
          <h2 id="details-heading" className="text-2xl font-bold text-white">
            Contact details
          </h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-amber-400">Phone</dt>
              <dd className="mt-1">
                <a href={phoneHref} className={`hover:underline ${focusRing}`}>
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-amber-400">Email</dt>
              <dd className="mt-1 wrap-break-word">
                <a href={`mailto:${SITE.email}`} className={`hover:underline ${focusRing}`}>
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-amber-400">Address</dt>
              <dd className="mt-1">
                <address className="not-italic">{SITE.address}</address>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 inline-block text-sm font-semibold text-amber-300 hover:underline ${focusRing}`}
                >
                  Get directions<span className="sr-only"> (opens in a new tab)</span>{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="form-heading" className="lg:col-span-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 id="form-heading" className="text-2xl font-bold text-stone-900">
              Send us a message
            </h2>
            <p className="mt-1 mb-6 text-stone-600">
              Fill in the form and we will get back to you about your project.
            </p>
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}