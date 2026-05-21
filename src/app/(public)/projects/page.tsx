import Link from "next/link";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default function ProjectsPage() {
  const publishedProjects = db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(projects.createdAt)
    .all();

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-bold">项目案例</h1>
          <p className="mt-2 text-blue-100">我们交付的每一个项目都是对品质的承诺</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        {publishedProjects.length === 0 ? (
          <p className="text-center text-gray-500 py-16">暂无项目</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
