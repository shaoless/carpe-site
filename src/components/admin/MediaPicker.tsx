"use client";

import { useState, useEffect, useRef } from "react";

interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

interface MediaPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaPicker({ value, onChange, multiple = false }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function fetchMedia() {
    const res = await fetch("/api/upload");
    if (res.ok) setMedia(await res.json());
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const uploaded = await res.json();
        if (multiple) {
          onChange([...value, uploaded.path]);
        } else {
          onChange([uploaded.path]);
        }
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchMedia();
  }

  function toggleSelect(path: string) {
    if (multiple) {
      if (value.includes(path)) {
        onChange(value.filter((v) => v !== path));
      } else {
        onChange([...value, path]);
      }
    } else {
      onChange(value.includes(path) ? [] : [path]);
    }
  }

  function isSelected(path: string) {
    return value.includes(path);
  }

  const selectedItems = media.filter((m) => value.includes(m.path));

  return (
    <div>
      {selectedItems.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <div key={item.id} className="relative group">
              {item.mimeType.startsWith("image/") ? (
                <img
                  src={item.path}
                  alt={item.originalName}
                  className="h-16 w-16 rounded object-cover"
                />
              ) : item.mimeType.startsWith("video/") ? (
                <video
                  src={item.path}
                  className="h-16 w-16 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                  {item.originalName.split(".").pop()?.toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => toggleSelect(item.path)}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative inline-block" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          {open ? "关闭素材库" : "选择素材"}
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-[480px] max-w-[90vw] rounded-xl border bg-white p-4 shadow-lg">
            <div className="mb-3">
              <label className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer">
                {uploading ? "上传中..." : multiple ? "批量上传" : "上传文件"}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                  multiple={multiple}
                  accept="image/*,video/*"
                />
              </label>
            </div>

            <div className="max-h-72 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.path)}
                    className={`cursor-pointer rounded-lg border-2 p-1 transition-colors ${
                      isSelected(item.path)
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    {item.mimeType.startsWith("image/") ? (
                      <img
                        src={item.path}
                        alt={item.originalName}
                        className="h-20 w-full rounded object-cover"
                      />
                    ) : item.mimeType.startsWith("video/") ? (
                      <div className="relative h-20 w-full rounded bg-gray-100">
                        <video
                          src={item.path}
                          className="h-full w-full rounded object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white text-sm">
                            ▶
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-20 w-full items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                        {item.originalName.split(".").pop()?.toUpperCase()}
                      </div>
                    )}
                    <p className="mt-1 truncate text-[10px] text-gray-500">
                      {item.originalName}
                    </p>
                    <p className="truncate text-[10px] text-gray-400">
                      {formatSize(item.size)}
                    </p>
                  </div>
                ))}
                {media.length === 0 && (
                  <p className="col-span-4 py-8 text-center text-sm text-gray-400">
                    暂无素材，请上传文件
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-xs text-gray-400">
                {value.length > 0 ? `已选择 ${value.length} 个文件` : "未选择文件"}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
