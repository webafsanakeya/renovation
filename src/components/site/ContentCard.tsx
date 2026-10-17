import Link from "next/link";
import CoverImage from "./CoverImage";

export default function ContentCard({
  href,
  title,
  description,
  image,
  meta,
  priority = false,
}: {
  href: string;
  title: string;
  description: string;
  image?: string;
  meta?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="overflow-hidden bg-stone-100">
        <CoverImage
          src={image}
          alt=""
          priority={priority}
          className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        {meta && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-800">{meta}</p>
        )}
        <h3 className="text-xl font-semibold leading-snug text-stone-900 transition-colors group-hover:text-amber-800">
          {title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600">{description}</p>
        <span className="mt-5 text-sm font-semibold text-amber-800">
          Learn more <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}