"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type { Item } from "@/lib/types";
import { DEFAULT_ROOMS } from "@/lib/seed";
import { getAccessToken } from "@/lib/supabase/client";
import { useIsAdmin } from "@/components/AdminProvider";
import {
  listTrashAction,
  restoreItemAction,
  purgeItemAction,
} from "@/app/actions";
import { Icon } from "@/components/icons";

const ROOM_LABEL: Record<string, string> = Object.fromEntries(
  DEFAULT_ROOMS.map((r) => [r.slug, r.cardTitle.replace(/\n/g, " ")])
);

const SECTION_LABEL: Record<string, string> = {
  story: "Câu chuyện",
  timeline: "Mốc thời gian",
  journey: "Hành trình",
  video: "Video",
  teaching: "Điều Bác dạy",
  place: "Địa điểm",
  quote: "Trích dẫn",
  good_deed_photo: "Ảnh việc tốt",
  diary: "Nhật ký",
  story_media: "Kể chuyện",
  display: "Trưng bày",
  library: "Tài liệu",
};

export default function TrashPage() {
  const isAdmin = useIsAdmin();
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function load() {
    const token = await getAccessToken();
    const res = await listTrashAction(token);
    if (res.error) setError(res.error);
    else {
      setItems(res.items ?? []);
      setError(null);
    }
  }

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  function onRestore(id: string) {
    start(async () => {
      const token = await getAccessToken();
      const res = await restoreItemAction(id, token);
      if (res.error) alert("Lỗi: " + res.error);
      else setItems((prev) => (prev ?? []).filter((i) => i.id !== id));
    });
  }

  function onPurge(id: string) {
    if (!confirm("Xóa VĨNH VIỄN mục này? Sau khi xóa sẽ không lấy lại được."))
      return;
    start(async () => {
      const token = await getAccessToken();
      const res = await purgeItemAction(id, token);
      if (res.error) alert("Lỗi: " + res.error);
      else setItems((prev) => (prev ?? []).filter((i) => i.id !== id));
    });
  }

  return (
    <div className="min-h-screen">
      <div className="bg-flag-darkred text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Icon name="trash" className="h-6 w-6 text-gold-light" />
          <div>
            <h1 className="text-lg font-extrabold">Thùng rác</h1>
            <p className="text-xs opacity-80">
              Nội dung đã xóa — có thể khôi phục hoặc xóa vĩnh viễn
            </p>
          </div>
          <Link
            href="/admin"
            className="ml-auto rounded-full bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25"
          >
            ← Bảng điều khiển
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {!isAdmin && (
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Bạn cần đăng nhập quản trị để xem thùng rác.{" "}
            <Link href="/admin/dang-nhap" className="underline">
              Đăng nhập
            </Link>
          </p>
        )}

        {isAdmin && error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            ❌ {error}
          </p>
        )}

        {isAdmin && items === null && !error && (
          <p className="text-sm text-[#6a4a1a]">Đang tải...</p>
        )}

        {isAdmin && items && items.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gold/40 bg-cream/50 py-12 text-center text-[#8a6a2a]">
            <Icon name="trash" className="mx-auto mb-2 h-10 w-10 opacity-60" />
            Thùng rác trống.
          </div>
        )}

        {isAdmin && items && items.length > 0 && (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex flex-col gap-3 rounded-xl border border-gold/30 bg-white/80 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase">
                    <span className="rounded bg-flag-red/10 px-2 py-0.5 text-flag-red">
                      {ROOM_LABEL[it.room_slug] ?? it.room_slug}
                    </span>
                    <span className="rounded bg-gold/20 px-2 py-0.5 text-[#7a5a2a]">
                      {SECTION_LABEL[it.section] ?? it.section}
                    </span>
                  </div>
                  <p className="truncate font-bold text-[#3a2410]">
                    {it.title || it.body || "(Không có tiêu đề)"}
                  </p>
                  {it.title && it.body && (
                    <p className="truncate text-sm text-[#6a4a1a]">{it.body}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onRestore(it.id)}
                    disabled={pending}
                    className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Khôi phục
                  </button>
                  <button
                    onClick={() => onPurge(it.id)}
                    disabled={pending}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                    Xóa vĩnh viễn
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
