"use client";

import { useState, useEffect } from "react";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface CultureItem {
  id: number;
  type: string;
  title: string;
  content: string;
  image: string;
  sortOrder: number;
}

const typeLabels: Record<string, string> = {
  vision: "愿景",
  mission: "使命",
  values: "价值观",
  history: "发展历程",
};

export default function AdminCulturePage() {
  const [items, setItems] = useState<CultureItem[]>([]);
  const [editing, setEditing] = useState<CultureItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "vision", title: "", content: "", image: "", sortOrder: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCulture(); }, []);

  async function fetchCulture() {
    const res = await fetch("/api/culture");
    setItems(await res.json());
  }

  function resetForm() {
    setForm({ type: "vision", title: "", content: "", image: "", sortOrder: 0 });
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(item: CultureItem) {
    setEditing(item);
    setForm({ type: item.type, title: item.title, content: item.content, image: item.image, sortOrder: item.sortOrder });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url = editing ? `/api/culture/${editing.id}` : "/api/culture";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    resetForm();
    fetchCulture();
  }

  async function handleDelete(id: number) {
    if (!confirm("确认删除？")) return;
    await fetch(`/api/culture/${id}`, { method: "DELETE" });
    fetchCulture();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">企业文化</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          新增条目
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">{editing ? "编辑条目" : "新增条目"}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">排序</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">标题</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">内容</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">图片</label>
              <MediaPicker
                value={form.image ? [form.image] : []}
                onChange={(urls) => setForm({ ...form, image: urls[0] || "" })}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "保存中..." : "保存"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              取消
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">标题</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">排序</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{typeLabels[item.type] || item.type}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(item)} className="mr-2 text-sm text-blue-600 hover:text-blue-700">编辑</button>
                  <button onClick={() => handleDelete(item.id)} className="text-sm text-red-500 hover:text-red-600">删除</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">暂无条目</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
