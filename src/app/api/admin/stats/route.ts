import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { Blog } from "@/models/Blog";
import { Project } from "@/models/Project";
import { Message } from "@/models/Message";

export const dynamic = "force-dynamic";

function counts(total: number, published: number) {
  return { total, published, drafts: total - published };
}

export async function GET() {
  try {
    await connectDB();
    const [sTotal, sPub, bTotal, bPub, pTotal, pPub, mTotal, recent] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ published: true }),
      Blog.countDocuments(),
      Blog.countDocuments({ published: true }),
      Project.countDocuments(),
      Project.countDocuments({ published: true }),
      Message.countDocuments(),
      Message.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      services: counts(sTotal, sPub),
      blogs: counts(bTotal, bPub),
      projects: counts(pTotal, pPub),
      messages: { total: mTotal, recent },
    });
  } catch {
    return NextResponse.json({ error: "Could not load stats" }, { status: 500 });
  }
}