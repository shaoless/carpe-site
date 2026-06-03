import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";
import path from "path";
import { getUploadDir } from "@/lib/upload";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const file = db.select().from(media).where(eq(media.id, parseInt(id))).get();
    if (!file) {
      return NextResponse.json({ error: "文件不存在" }, { status: 404 });
    }

    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, file.filename);
    try {
      await unlink(filePath);
    } catch {
      // File may not exist on disk, remove from DB anyway
    }

    db.delete(media).where(eq(media.id, parseInt(id))).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
