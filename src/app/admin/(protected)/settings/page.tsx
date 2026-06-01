"use client";

import { useState, useEffect } from "react";

interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchMedia();
  }, []);

  async function fetchSettings() {
    const res = await fetch("/api/settings");
    setSettings(await res.json());
  }

  async function fetchMedia() {
    const res = await fetch("/api/upload");
    if (res.ok) setMedia(await res.json());
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setMessage("保存成功");
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/upload", { method: "POST", body: formData });
    }
    setUploading(false);
    if (e.target) e.target.value = "";
    fetchMedia();
  }

  async function handleDelete(id: number) {
    if (!confirm("确认删除该素材？此操作不可恢复。")) return;
    await fetch(`/api/upload/${id}`, { method: "DELETE" });
    fetchMedia();
  }

  async function copyPath(path: string, id: number) {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  }

  const settingFields = [
    { key: "site_name", label: "网站名称" },
    { key: "site_description", label: "网站描述" },
    { key: "contact_email", label: "联系邮箱" },
    { key: "contact_phone", label: "联系电话" },
    { key: "contact_address", label: "联系地址" },
    { key: "footer_text", label: "页脚文案" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">站点设置</h1>

      {message && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-600">{message}</div>
      )}

      <form onSubmit={handleSave} className="mb-12 rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">基本信息</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {settingFields.map(({ key, label }) => (
            <div key={key} className={key === "site_description" || key === "footer_text" ? "md:col-span-2" : ""}>
              <label className="mb-1 block text-sm font-medium">{label}</label>
              {key === "site_description" || key === "footer_text" ? (
                <textarea
                  value={settings[key] || ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={settings[key] || ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存设置"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">素材管理</h2>
        <div className="mb-4">
          <label className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer">
            {uploading ? "上传中..." : "批量上传文件"}
            <input
              type="file"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
              multiple
              accept="image/*,video/*"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="rounded-lg border p-3 group relative">
              <div className="relative mb-2">
                {item.mimeType.startsWith("image/") ? (
                  <img
                    src={item.path}
                    alt={item.originalName}
                    className="h-32 w-full rounded object-cover"
                  />
                ) : item.mimeType.startsWith("video/") ? (
                  <div className="relative h-32 w-full rounded bg-gray-100 overflow-hidden">
                    <video
                      src={item.path}
                      className="h-full w-full rounded object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white text-lg">
                        ▶
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-32 w-full items-center justify-center rounded bg-gray-100">
                    <div className="text-center text-gray-400">
                      <span className="block text-2xl">📄</span>
                      <span className="text-xs mt-1">{item.originalName.split(".").pop()?.toUpperCase()}</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => copyPath(item.path, item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded bg-white/90 text-xs text-gray-700 shadow hover:bg-white"
                    title="复制路径"
                  >
                    {copiedId === item.id ? "✓" : "📋"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded bg-white/90 text-xs text-red-500 shadow hover:bg-white"
                    title="删除"
                  >
                    🗑
                  </button>
                </div>
              </div>
              <p className="truncate text-xs text-gray-600">{item.originalName}</p>
              <p className="flex items-center justify-between text-xs text-gray-400">
                <span>{formatSize(item.size)}</span>
                <button
                  type="button"
                  onClick={() => copyPath(item.path, item.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {copiedId === item.id ? "已复制" : "复制路径"}
                </button>
              </p>
            </div>
          ))}
          {media.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-gray-400">暂无素材</p>
          )}
        </div>
      </div>
    </div>
  );
}
