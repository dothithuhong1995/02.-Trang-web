"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Item } from "@/lib/types";
import { saveItemAction, deleteItemAction } from "@/app/actions";
import { Icon } from "./icons";

export interface EditorConfig {
  roomSlug: string;
  section: string;
  heading: string;
  accent?: string;
  /** Hiển thị ô tiêu đề */
  title?: boolean;
  titleLabel?: string;
  /** Hiển thị ô nội dung (textarea) */
  body?: boolean;
  bodyLabel?: string;
  /** Kiểu media cho phép thêm */
  media?: "image" | "video" | "file" | "any" | "none";
  /** Ô nhập năm (dòng thời gian) */
  year?: boolean;
  /** Thứ tự mặc định khi tạo mới */
  nextOrder?: number;
}

/** Ô "+" để thêm mục mới (chỉ hiện với Admin). */
export function AddItemSlot({
  config,
  className,
  label = "Thêm nội dung",
  hint,
}: {
  config: EditorConfig;
  className?: string;
  label?: string;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? "upload-slot"}
        type="button"
      >
        <span className="upload-plus">
          <Icon name="plus" className="h-7 w-7" />
        </span>
        <span className="text-sm font-bold uppercase text-flag-red">{label}</span>
        {hint && <span className="text-xs text-[#8a6a2a]">{hint}</span>}
      </button>
      {open && (
        <EditorModal config={config} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

/** Nút sửa/xóa nổi trên một mục đã có (chỉ hiện với Admin). */
export function EditControls({
  config,
  item,
}: {
  config: EditorConfig;
  item: Item;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  function onDelete() {
    if (!confirm("Bạn có chắc muốn xóa mục này?")) return;
    start(async () => {
      const res = await deleteItemAction(item.id, config.roomSlug);
      if (res?.error) {
        alert("Lỗi: " + res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      <div className="absolute right-2 top-2 z-20 flex gap-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-flag-red shadow hover:bg-white"
          title="Sửa"
        >
          <Icon name="edit" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-flag-red shadow hover:bg-white disabled:opacity-50"
          title="Xóa"
        >
          <Icon name="trash" className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <EditorModal
          config={config}
          item={item}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function EditorModal({
  config,
  item,
  onClose,
}: {
  config: EditorConfig;
  item?: Item;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [removeMedia, setRemoveMedia] = useState(false);

  const meta = (item?.meta ?? {}) as Record<string, unknown>;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    // Gộp năm vào meta nếu có
    if (config.year) {
      const y = String(fd.get("_year") || "");
      fd.set("meta", JSON.stringify({ ...meta, year: y }));
    }
    start(async () => {
      const res = await saveItemAction(fd);
      if (res?.error) {
        setError(res.error);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-flag-red">
            {item ? "Chỉnh sửa" : config.heading}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="room_slug" value={config.roomSlug} />
          <input type="hidden" name="section" value={config.section} />
          {item && <input type="hidden" name="id" value={item.id} />}
          <input
            type="hidden"
            name="sort_order"
            value={item?.sort_order ?? config.nextOrder ?? 0}
          />

          {config.year && (
            <Field label="Năm / Mốc thời gian">
              <input
                name="_year"
                defaultValue={String(meta.year ?? "")}
                placeholder="Ví dụ: 1911"
                className={inputCls}
              />
            </Field>
          )}

          {config.title && (
            <Field label={config.titleLabel ?? "Tiêu đề"}>
              <input
                name="title"
                defaultValue={item?.title ?? ""}
                className={inputCls}
                placeholder="Nhập tiêu đề..."
              />
            </Field>
          )}

          {config.body && (
            <Field label={config.bodyLabel ?? "Nội dung"}>
              <textarea
                name="body"
                defaultValue={item?.body ?? ""}
                rows={4}
                className={inputCls}
                placeholder="Nhập nội dung..."
              />
            </Field>
          )}

          {config.media === "image" && (
            <Field label="Hình ảnh">
              <input
                type="file"
                name="file"
                accept="image/*"
                className={fileCls}
              />
            </Field>
          )}

          {config.media === "video" && (
            <>
              <Field label="Link YouTube (khuyến nghị)">
                <input
                  name="youtube_url"
                  placeholder="Dán link YouTube..."
                  className={inputCls}
                />
              </Field>
              <Field label="Hoặc tải tệp video lên">
                <input
                  type="file"
                  name="file"
                  accept="video/*"
                  className={fileCls}
                />
              </Field>
            </>
          )}

          {config.media === "file" && (
            <Field label="Tệp tài liệu (PDF, ảnh, âm thanh...)">
              <input type="file" name="file" className={fileCls} />
            </Field>
          )}

          {config.media === "any" && (
            <>
              <Field label="Tải ảnh hoặc video lên">
                <input
                  type="file"
                  name="file"
                  accept="image/*,video/*"
                  className={fileCls}
                />
              </Field>
              <Field label="Hoặc dán link YouTube">
                <input
                  name="youtube_url"
                  placeholder="Dán link YouTube..."
                  className={inputCls}
                />
              </Field>
            </>
          )}

          {item && item.media_url && config.media !== "none" && (
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="remove_media"
                value="1"
                checked={removeMedia}
                onChange={(e) => setRemoveMedia(e.target.checked)}
              />
              Xóa tệp/ảnh hiện tại
            </label>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-home text-sm disabled:opacity-60"
            >
              {pending ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[#4a2f10]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-gold/40 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-flag-red focus:ring-1 focus:ring-flag-red";
const fileCls =
  "w-full rounded-lg border border-gold/40 bg-cream/50 px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-flag-red file:px-4 file:py-1.5 file:text-white";
