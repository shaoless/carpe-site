import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export function getSiteSettings(): Record<string, string> {
  const rows = db.select().from(siteSettings).all();
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}
