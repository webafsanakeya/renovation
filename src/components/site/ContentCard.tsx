import Link from "next/link";
import CoverImage from "./CoverImage";

export default function ContentCard({
  href, title, description, image, meta,
}: { href: string; title: string; description: string; image?: string; meta?: string }) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <CoverImage src={image} alt={title} className="aspect-video w-full" />
      <div className="p-5">
        {meta && <p className="mb-1 text-xs font-medium uppercase tracking-wide text-amber-800">{meta}</p>}
        <h3 className="text-lg font-semibold text-stone-900 group-hover:text-amber-800">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-stone-600">{description}</p>
      </div>
    </Link>
  );
}