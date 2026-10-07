export default function CoverImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return <div aria-hidden className={`bg-linear-to-br from-stone-800 to-amber-900 ${className}`} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}