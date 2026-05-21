import { getSiteSettings } from "@/lib/utils";

export function Footer() {
  const settings = getSiteSettings();
  const siteName = settings.site_name || "公司官网";
  const footerText = settings.footer_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">{siteName}</h3>
            <p className="text-sm text-gray-600">
              {settings.site_description || "专注于数字化解决方案的科技公司"}
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">快速链接</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <a href="/about" className="hover:text-gray-900">关于我们</a>
              <a href="/projects" className="hover:text-gray-900">项目案例</a>
              <a href="/news" className="hover:text-gray-900">新闻动态</a>
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">联系我们</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {settings.contact_email && <p>邮箱: {settings.contact_email}</p>}
              {settings.contact_phone && <p>电话: {settings.contact_phone}</p>}
              {settings.contact_address && <p>地址: {settings.contact_address}</p>}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
          {footerText}
        </div>
      </div>
    </footer>
  );
}
