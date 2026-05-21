import { getSiteSettings } from "@/lib/utils";
import { db } from "@/lib/db";
import { projects, news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default function HomePage() {
  const settings = getSiteSettings();
  const publishedProjects = db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(projects.createdAt)
    .all()
    .slice(0, 3);

  const publishedNews = db
    .select()
    .from(news)
    .where(eq(news.published, true))
    .orderBy(news.createdAt)
    .all()
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="mb-4 text-5xl font-bold leading-tight">
            {settings.site_name || "XX科技有限公司"}
          </h1>
          <p className="mb-8 text-xl text-blue-100">
            {settings.site_description || "专注于数字化解决方案的科技公司"}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/projects"
              className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              查看项目
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-white px-6 py-3 font-medium text-white hover:bg-white/10 transition-colors"
            >
              了解我们
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {publishedProjects.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">核心项目</h2>
            <p className="text-gray-600">我们用技术为客户创造价值</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {publishedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-xl border p-6 transition-all hover:shadow-lg hover:border-blue-200"
              >
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                )}
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* News Section */}
      {publishedNews.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-gray-900">最新动态</h2>
              <p className="text-gray-600">了解公司最新资讯</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {publishedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  {item.coverImage && (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="mb-4 h-48 w-full rounded-lg object-cover"
                    />
                  )}
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.summary}</p>
                  <span className="mt-3 inline-block text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/news" className="text-blue-600 hover:text-blue-700 font-medium">
                查看全部新闻 →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
