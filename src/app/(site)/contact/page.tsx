import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get a free quote for your carpentry or home renovation project.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">Contact Us</h1>
      <p className="mt-2 text-stone-600">Tell us about your project and get a free quote.</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 rounded-xl bg-stone-950 p-6 text-stone-200 lg:col-span-1">
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-500">Phone</p>
            <p>{SITE.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-500">Email</p>
            <p>{SITE.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-500">Address</p>
            <p>{SITE.address}</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}