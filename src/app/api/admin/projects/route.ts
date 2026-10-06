import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { slugify } from "@/lib/slugify";
import { Project } from "@/models/Project";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const project = await Project.create({
      ...body,
      slug: slugify(body.slug || body.title || ""),
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    const err = error as { code?: number; name?: string; message?: string };
    if (err.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    if (err.name === "ValidationError") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}