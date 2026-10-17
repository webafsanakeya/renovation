import { getYouTubeId } from "@/lib/youtube";

export type ContentResource = "services" | "blogs" | "projects";
export type ContentErrors = Record<string, string>;

function isHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateContent(
  input: Record<string, unknown>,
  resource: ContentResource,
  opts: { partial?: boolean } = {},
) {
  const partial = !!opts.partial;
  const errors: ContentErrors = {};
  const has = (key: string) => !partial || key in input;
  const str = (key: string) => String(input[key] ?? "").trim();

  // SEO fields are flat in the admin form and nested under "seo" in the API payload
  const seo = (typeof input.seo === "object" && input.seo ? input.seo : input) as Record<string, unknown>;
  const seoStr = (key: string) => String(seo[key] ?? "").trim();

  if (has("title")) {
    const v = str("title");
    if (v.length < 3) errors.title = "Title must be at least 3 characters.";
    else if (v.length > 120) errors.title = "Title must be 120 characters or fewer.";
  }

  if (has("slug")) {
    const v = str("slug");
    if (v && !/[a-z0-9]/i.test(v)) errors.slug = "Slug needs at least one letter or number.";
    else if (v.length > 100) errors.slug = "Slug must be 100 characters or fewer.";
  }

  if (has("shortDescription")) {
    const v = str("shortDescription");
    if (v.length < 10) errors.shortDescription = "Short description must be at least 10 characters.";
    else if (v.length > 250) errors.shortDescription = "Short description must be 250 characters or fewer.";
  }

  if (has("content")) {
    if (str("content").length < 20) errors.content = "Content must be at least 20 characters.";
  }

  if (has("coverImage")) {
    const v = str("coverImage");
    if (v && !isHttpUrl(v)) errors.coverImage = "Enter a valid image URL starting with http:// or https://.";
  }

  if (resource === "blogs") {
    if (has("author") && str("author").length > 80) errors.author = "Author must be 80 characters or fewer.";
    if (has("videoUrl")) {
      const v = str("videoUrl");
      if (v && !getYouTubeId(v)) errors.videoUrl = "Enter a valid YouTube link, for example https://www.youtube.com/watch?v=...";
    }
  }

  if (resource === "projects") {
    if (has("location") && str("location").length > 120) errors.location = "Location must be 120 characters or fewer.";
    if (has("completedAt")) {
      const v = str("completedAt");
      if (v && Number.isNaN(Date.parse(v))) errors.completedAt = "Enter a valid date.";
    }
    if (has("gallery")) {
      const raw = input.gallery;
      const urls = (Array.isArray(raw) ? raw : String(raw ?? "").split(/[\n,]/))
        .map((g) => String(g).trim())
        .filter(Boolean);
      if (urls.some((u) => !isHttpUrl(u))) errors.gallery = "Every gallery line must be a valid http:// or https:// URL.";
    }
  }

  if (seoStr("metaTitle").length > 70) errors.metaTitle = "Meta title should be 70 characters or fewer.";
  if (seoStr("metaDescription").length > 200) errors.metaDescription = "Meta description should be 200 characters or fewer.";
  if (seoStr("ogImage") && !isHttpUrl(seoStr("ogImage"))) errors.ogImage = "Enter a valid URL starting with http:// or https://.";
  if (seoStr("canonicalUrl") && !isHttpUrl(seoStr("canonicalUrl"))) errors.canonicalUrl = "Enter a valid URL starting with http:// or https://.";

  return { ok: Object.keys(errors).length === 0, errors };
}