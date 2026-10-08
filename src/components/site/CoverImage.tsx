import Image from "next/image";

const OPTIMIZED_HOSTS = ["images.unsplash.com", "images.pexels.com", "placehold.co"];

function canOptimize(src: string) {
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

export default function CoverImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src) {
    return <div aria-hidden className={`bg-linear-to-br from-stone-800 to-amber-900 ${className}`} />;
  }

  // Unknown hosts fall back to a normal <img> so the page never crashes
  if (!canOptimize(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}