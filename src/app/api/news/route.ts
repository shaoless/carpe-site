import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const all = db.select().from(news).orderBy(news.createdAt).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const result = db.insert(news).values({
      title: body.title,
      slug,
      summary: body.summary || "",
      content: body.content || "",
      coverImage: body.coverImage || "",
      published: body.published ?? false,
    }).returning().get();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }
    console.error("Create news error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
