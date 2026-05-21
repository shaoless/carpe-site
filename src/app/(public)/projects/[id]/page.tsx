import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = db
    .select()
    .from(projects)
    .where(eq(projects.id, parseInt(id)))
    .get();

  if (!project) {
    notFound();
  }

  const images: string[] = JSON.parse(project.images || "[]");

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="mt-2 text-blue-100">{project.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        {project.coverImage && (
          <img
            src={project.coverImage}
            alt={project.title}
            className="mb-8 w-full rounded-xl object-cover max-h-96"
          />
        )}

        {images.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-4">
            {images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`${project.title} ${i + 1}`}
                className="rounded-lg object-cover w-full h-64"
              />
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {project.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="mb-4 mt-8 text-2xl font-bold text-gray-900">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <li key={i} className="ml-4 text-gray-700">
                  {line.replace("- ", "")}
                </li>
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
