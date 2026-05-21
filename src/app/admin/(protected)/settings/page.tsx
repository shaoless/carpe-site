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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    fetchMedia();
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
            {uploading ? "上传中..." : "上传文件"}
            <input type="file" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              {item.mimeType.startsWith("image/") ? (
                <img src={item.path} alt={item.originalName} className="mb-2 h-32 w-full rounded object-cover" />
              ) : (
                <div className="mb-2 flex h-32 items-center justify-center rounded bg-gray-100 text-2xl text-gray-400">
                  📄
                </div>
              )}
              <p className="truncate text-xs text-gray-600">{item.originalName}</p>
              <p className="text-xs text-gray-400">{item.path}</p>
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
