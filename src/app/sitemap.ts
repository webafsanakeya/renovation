import type { MetadataRoute } from "next";
import { getServices, getBlogs, getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [services, blogs, projects] = await Promise.all([getServices(), getBlogs(), getProjects()]);

  const pages = ["", "/about", "/services", "/projects", "/blog", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  return [
    ...pages,
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: new Date(s.createdAt) })),
    ...blogs.map((b) => ({ url: `${base}/blog/${b.slug}`, lastModified: new Date(b.createdAt) })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date(p.createdAt) })),
  ];
}