import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { MediaViewer } from "@/components/MediaViewer";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = db
    .select()
    .from(news)
    .where(eq(news.id, parseInt(id)))
    .get();

  if (!item) {
    notFound();
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-4xl font-bold">{item.title}</h1>
          <p className="mt-2 text-blue-100">
            {new Date(item.createdAt).toLocaleDateString("zh-CN")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        {item.coverImage && (
          <MediaViewer
            src={item.coverImage}
            alt={item.title}
            className="mb-8 w-full rounded-xl object-cover max-h-96"
          />
        )}

        {item.summary && (
          <p className="mb-8 text-lg text-gray-600 italic border-l-4 border-blue-500 pl-4">
            {item.summary}
          </p>
        )}

        <div className="prose prose-lg max-w-none">
          {item.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="mb-4 mt-8 text-2xl font-bold text-gray-900">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.trim() === "") {
              return <br key={i} />;
            }
            return (
              <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      </section>
    </div>
  );
}
