"use client";

import type { Item, Room } from "@/lib/types";
import { useIsAdmin } from "@/components/AdminProvider";
import { Icon } from "@/components/icons";
import { ItemImage } from "@/components/Media";
import { EditControls } from "@/components/ItemEditor";

export function Room3({
  grouped,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
}) {
  const isAdmin = useIsAdmin();
  const teachings = grouped["teaching"] ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {teachings.map((t) => {
        const meta = t.meta as Record<string, unknown>;
        const accent = String(meta?.accent ?? "#C8102E");
        const icon = String(meta?.icon ?? "star");
        const order = Number(meta?.order ?? 0);
        return (
          <article
            key={t.id}
            className="relative flex flex-col rounded-2xl bg-white/80 p-4 text-center shadow-soft ring-1 ring-gold/20"
            style={{ borderTop: `4px solid ${accent}` }}
          >
            {isAdmin && (
              <EditControls
                config={{
                  roomSlug: "nam-dieu",
                  section: "teaching",
                  heading: "Sửa điều dạy",
                  title: true,
                  titleLabel: "Nội dung điều dạy",
                  body: true,
                  bodyLabel: "Diễn giải / lời dẫn",
                  media: "image",
                }}
                item={t}
              />
            )}
            <span
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-full text-base font-extrabold text-white"
              style={{ backgroundColor: accent }}
            >
              {order}
            </span>
            <h3
              className="mt-2 min-h-[2.5rem] text-sm font-extrabold uppercase leading-tight"
              style={{ color: accent }}
            >
              {t.title}
            </h3>
            <span className="my-3 flex justify-center" style={{ color: accent }}>
              <Icon name={icon} className="h-8 w-8" />
            </span>

            {/* Vùng hình ảnh/nội dung */}
            <div className="relative mt-auto aspect-square w-full overflow-hidden rounded-xl border-2 border-dashed border-gold/40 bg-cream/50">
              {t.media_url ? (
                <ItemImage item={t} />
              ) : (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2 text-center text-xs text-[#8a6a2a]">
                  <Icon name="plus" className="h-6 w-6 text-flag-red/70" />
                  Thêm hình ảnh/ nội dung tại đây
                </span>
              )}
            </div>
            {t.body && (
              <p className="mt-2 text-xs leading-snug text-[#4a2f10]">{t.body}</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
