import Link from "next/link";

export default function NotFoundContent() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-800">Error 404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-stone-600">
        The page you are looking for does not exist, has been moved, or is not published yet.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900">
          Back to Home
        </Link>
        <Link href="/services" className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-800 hover:bg-stone-100">
          Our Services
        </Link>
      </div>
    </section>
  );
}