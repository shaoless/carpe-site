"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "控制台" },
  { href: "/admin/projects", label: "项目管理" },
  { href: "/admin/news", label: "新闻管理" },
  { href: "/admin/culture", label: "企业文化" },
  { href: "/admin/settings", label: "站点设置" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen border-r bg-gray-50 p-4">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="text-lg font-bold text-gray-900">
          后台管理
        </Link>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-8">
        <Link
          href="/"
          className="rounded-md px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          target="_blank"
        >
          查看官网 →
        </Link>
      </div>
    </aside>
  );
}
