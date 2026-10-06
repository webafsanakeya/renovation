import mongoose, { Schema, InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    published: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: { type: [String], default: [] },
      ogTitle: { type: String, default: "" },
      ogDescription: { type: String, default: "" },
      ogImage: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export type ProjectType = InferSchemaType<typeof projectSchema>;

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);