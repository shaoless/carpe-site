import Link from "next/link";
import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MediaViewer } from "@/components/MediaViewer";

export const dynamic = "force-dynamic";

export default function NewsPage() {
  const publishedNews = db
    .select()
    .from(news)
    .where(eq(news.published, true))
    .orderBy(news.createdAt)
    .all();

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-bold">新闻动态</h1>
          <p className="mt-2 text-blue-100">了解公司最新资讯与行业洞察</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20">
        {publishedNews.length === 0 ? (
          <p className="text-center text-gray-500 py-16">暂无新闻</p>
        ) : (
          <div className="flex flex-col gap-6">
            {publishedNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="group flex flex-col gap-4 rounded-xl border p-6 transition-all hover:shadow-md hover:border-blue-200 md:flex-row"
              >
                {item.coverImage && (
                  <MediaViewer
                    src={item.coverImage}
                    alt={item.title}
                    className="h-40 w-full rounded-lg object-cover md:w-48 md:shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </h2>
                  <p className="mb-3 text-sm text-gray-600 line-clamp-2">{item.summary}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
