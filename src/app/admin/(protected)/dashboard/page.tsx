import { db } from "@/lib/db";
import { projects, news } from "@/lib/db/schema";

export default function DashboardPage() {
  const projectCount = db.select().from(projects).all().length;
  const newsCount = db.select().from(news).all().length;
  const publishedProjects = db.select().from(projects).all().filter((p) => p.published).length;
  const publishedNews = db.select().from(news).all().filter((n) => n.published).length;

  const stats = [
    { label: "项目总数", value: projectCount, detail: `${publishedProjects} 已发布` },
    { label: "新闻总数", value: newsCount, detail: `${publishedNews} 已发布` },
    { label: "媒体文件", value: db.select().from(projects).all().length, detail: "" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">控制台</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border p-6">
            <p className="mb-1 text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            {stat.detail && (
              <p className="mt-1 text-xs text-gray-400">{stat.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
