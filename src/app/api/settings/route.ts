import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const settings = db.select().from(siteSettings).all();
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      const existing = db.select().from(siteSettings).where(eq(siteSettings.key, key)).get();
      if (existing) {
        db.update(siteSettings)
          .set({ value: value as string, updatedAt: new Date() })
          .where(eq(siteSettings.key, key))
          .run();
      } else {
        db.insert(siteSettings).values({ key, value: value as string }).run();
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
