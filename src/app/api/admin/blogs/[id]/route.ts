import { connectDB } from "@/lib/mongodb";
import { slugify } from "@/lib/slugify";
import { Blog } from "@/models/Blog";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await connectDB();
  const blog = await Blog.findById(id);
  if (!blog)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "invalid id" }, { status: 400 });
    }
    await connectDB();
    const body = await req.json();
    if (body.slug) body.slug = slugify(body.slug);
    const blog = await Blog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!blog)
      return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    const err = error as { code?: number };
    if (err.code === 11000) {
      return NextResponse.json({ error: "slug already exits" }, { status: 409 });
    }
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  await connectDB();
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
