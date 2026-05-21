import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { culture } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const items = db.select().from(culture).orderBy(culture.sortOrder).all();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const result = db.insert(culture).values({
      type: body.type,
      title: body.title,
      content: body.content || "",
      image: body.image || "",
      sortOrder: body.sortOrder || 0,
    }).returning().get();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
