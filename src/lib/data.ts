import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { Blog } from "@/models/Blog";
import { Project } from "@/models/Project";

export type ContentItem = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImage?: string;
  published: boolean;
  createdAt: string;
  author?: string;
  location?: string;
  completedAt?: string;
  gallery?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
};

function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export async function getServices(limit = 0) {
  await connectDB();
  const docs = await Service.find({ published: true }).sort({ createdAt: -1 }).limit(limit).lean();
  return plain<ContentItem[]>(docs);
}
export async function getServiceBySlug(slug: string) {
  await connectDB();
  const doc = await Service.findOne({ slug, published: true }).lean();
  return doc ? plain<ContentItem>(doc) : null;
}

export async function getBlogs(limit = 0) {
  await connectDB();
  const docs = await Blog.find({ published: true }).sort({ createdAt: -1 }).limit(limit).lean();
  return plain<ContentItem[]>(docs);
}
export async function getBlogBySlug(slug: string) {
  await connectDB();
  const doc = await Blog.findOne({ slug, published: true }).lean();
  return doc ? plain<ContentItem>(doc) : null;
}

export async function getProjects(limit = 0) {
  await connectDB();
  const docs = await Project.find({ published: true }).sort({ createdAt: -1 }).limit(limit).lean();
  return plain<ContentItem[]>(docs);
}
export async function getProjectBySlug(slug: string) {
  await connectDB();
  const doc = await Project.findOne({ slug, published: true }).lean();
  return doc ? plain<ContentItem>(doc) : null;
}