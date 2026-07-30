"use client";

import type { Item, Room } from "@/lib/types";
import { useIsAdmin } from "@/components/AdminProvider";
import { SectionHeading } from "@/components/shared";
import { MediaTile, EmptyNote } from "@/components/Media";
import { AddItemSlot, EditControls } from "@/components/ItemEditor";

const CONFIG = {
  roomSlug: "cb-gv-nv",
  section: "display",
  heading: "Thêm nội dung trưng bày",
  title: true,
  body: true,
  media: "any" as const,
};

export function Room6({
  grouped,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
}) {
  const isAdmin = useIsAdmin();
  const items = grouped["display"] ?? [];

  return (
    <section className="panel p-5 md:p-6">
      <SectionHeading icon="gallery">Không gian trưng bày</SectionHeading>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <article
            key={it.id}
            className="relative flex flex-col overflow-hidden rounded-xl bg-white/80 shadow-soft ring-1 ring-gold/20"
          >
            {isAdmin && <EditControls config={CONFIG} item={it} />}
            <div className="relative aspect-square w-full overflow-hidden bg-cream">
              <MediaTile item={it} />
            </div>
            {(it.title || it.body) && (
              <div className="p-2 text-center">
                {it.title && (
                  <p className="text-xs font-bold text-flag-red">{it.title}</p>
                )}
                {it.body && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-[#6a4a1a]">
                    {it.body}
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
        {isAdmin && (
          <AddItemSlot
            config={{ ...CONFIG, nextOrder: items.length + 1 }}
            className="upload-slot aspect-square"
            label="Thêm nội dung"
          />
        )}
        {!isAdmin && items.length === 0 && (
          <EmptyNote text="Nội dung đang được cập nhật." />
        )}
      </div>
    </section>
  );
}
