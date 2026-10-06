import { connectDB } from "@/lib/mongodb";
import { slugify } from "@/lib/slugify";
import { Service } from "@/models/Service";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const services = await Service.find().sort({ createdAt: -1 });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const service = await Service.create({
      ...body,
      slug: slugify(body.slug || body.title || ""),
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    const err = error as { code?: number; name?: string; message?: string };
    if (err.code === 11000) {
      return NextResponse.json({ error: "slug already ache" }, { status: 409 });
    }
    if (err.name === "ValidationError") {
      return NextResponse.json(
        {
          error: err.message,
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
