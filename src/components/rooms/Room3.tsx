"use client";

import type { Item, Room } from "@/lib/types";
import { useIsAdmin } from "@/components/AdminProvider";
import { ItemImage, EmptyNote } from "@/components/Media";
import { AddItemSlot, EditControls } from "@/components/ItemEditor";

const CONFIG = {
  roomSlug: "nam-dieu",
  section: "teaching",
  heading: "Thêm hình ảnh",
  body: true,
  bodyLabel: "Chú thích (không bắt buộc)",
  media: "image" as const,
};

export function Room3({
  grouped,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
}) {
  const isAdmin = useIsAdmin();
  const items = grouped["teaching"] ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <article
          key={it.id}
          className="panel group relative flex flex-col overflow-hidden"
        >
          {isAdmin && (
            <EditControls
              config={{ ...CONFIG, heading: "Sửa hình ảnh" }}
              item={it}
            />
          )}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
            {it.media_url ? (
              <ItemImage item={it} />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-flag-red/50">
                Chưa có ảnh
              </span>
            )}
          </div>
          {(it.title || it.body) && (
            <div className="p-3 text-center">
              {it.title && (
                <p className="font-bold text-flag-red">{it.title}</p>
              )}
              {it.body && (
                <p className="text-sm text-[#4a2f10]">{it.body}</p>
              )}
            </div>
          )}
        </article>
      ))}

      {isAdmin && (
        <AddItemSlot
          config={{ ...CONFIG, nextOrder: items.length + 1 }}
          label="Thêm hình ảnh"
          hint="Nhấn để tải ảnh lên"
        />
      )}

      {!isAdmin && items.length === 0 && (
        <EmptyNote text="Nội dung đang được cập nhật." />
      )}
    </div>
  );
}
