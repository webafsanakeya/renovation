import { connectDB } from "@/lib/mongodb";
import { slugify } from "@/lib/slugify";
import { Service } from "@/models/Service";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await connectDB();
  const service = await Service.findById(id);
  if (!service)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(service);
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
    const service = await Service.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!service)
      return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(service);
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
  const service = await Service.findByIdAndDelete(id);
  if (!service)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
