import { SITE } from "@/lib/site";

export default function LocalBusinessJsonLd() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: SITE.name,
    description: SITE.tagline,
    url,
    telephone: SITE.phone,
    email: SITE.email,
    address: { "@type": "PostalAddress", streetAddress: SITE.address },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}