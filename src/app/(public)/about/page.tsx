import { db } from "@/lib/db";
import { culture } from "@/lib/db/schema";
import { getSiteSettings } from "@/lib/utils";
import { MediaViewer } from "@/components/MediaViewer";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const settings = getSiteSettings();
  const cultureItems = db.select().from(culture).orderBy(culture.sortOrder).all();

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-bold">关于我们</h1>
          <p className="mt-2 text-blue-100">了解{settings.site_name || "我们"}的故事与愿景</p>
        </div>
      </section>

      {/* Culture Items */}
      {cultureItems.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid grid-cols-1 gap-12">
            {cultureItems.map((item, index) => (
              <div key={item.id} className={`flex flex-col gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center`}>
                {item.image && (
                  <div className="w-full md:w-1/2">
                    <MediaViewer
                      src={item.image}
                      alt={item.title}
                      className="rounded-xl object-cover w-full h-64"
                    />
                  </div>
                )}
                <div className={item.image ? "md:w-1/2" : "w-full"}>
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
                    {item.type === "vision" ? "愿景" : item.type === "mission" ? "使命" : item.type === "values" ? "价值观" : item.type}
                  </span>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">{item.title}</h2>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{item.content}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Company Development Timeline section placeholder */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">发展历程</h2>
          <p className="text-gray-600">
            公司自成立以来，始终致力于技术创新，持续为客户提供优质的数字化解决方案。
          </p>
          {settings.contact_address && (
            <p className="mt-4 text-gray-500">总部地址: {settings.contact_address}</p>
          )}
        </div>
      </section>
    </div>
  );
}
