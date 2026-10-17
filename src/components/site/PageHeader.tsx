export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-linear-to-br from-stone-950 via-stone-900 to-amber-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-300">{description}</p>
        )}
      </div>
    </section>
  );
}