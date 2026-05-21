import Link from "next/link";
import { getSiteSettings } from "@/lib/utils";

export function Header() {
  const settings = getSiteSettings();
  const siteName = settings.site_name || "公司官网";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          {siteName}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            首页
          </Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">
            关于我们
          </Link>
          <Link href="/projects" className="hover:text-gray-900 transition-colors">
            项目案例
          </Link>
          <Link href="/news" className="hover:text-gray-900 transition-colors">
            新闻动态
          </Link>
        </nav>
      </div>
    </header>
  );
}
