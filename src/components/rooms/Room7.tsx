"use client";

import type { Item, Room } from "@/lib/types";
import { useIsAdmin } from "@/components/AdminProvider";
import { LIBRARY_CATEGORIES } from "@/lib/seed";
import { Icon } from "@/components/icons";
import { AddItemSlot, EditControls } from "@/components/ItemEditor";

function mediaForCategory(key: string): "file" | "video" | "none" {
  if (key === "bai-hat") return "video";
  if (key === "tho") return "none";
  return "file";
}

export function Room7({
  grouped,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
}) {
  const isAdmin = useIsAdmin();
  const library = grouped["library"] ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {LIBRARY_CATEGORIES.map((cat, i) => {
        const items = library.filter(
          (it) => (it.meta as Record<string, unknown>)?.category === cat.key
        );
        const media = mediaForCategory(cat.key);
        const config = {
          roomSlug: "thu-vien-so",
          section: "library",
          heading: `Thêm vào mục ${cat.label}`,
          title: true,
          titleLabel: "Tên tài liệu",
          body: cat.key === "tho",
          bodyLabel: "Nội dung",
          media,
          fixedMeta: { category: cat.key },
        };
        return (
          <section
            key={cat.key}
            className="flex flex-col rounded-2xl bg-white/80 p-4 shadow-soft ring-1 ring-gold/20"
            style={{ borderTop: `4px solid ${cat.accent}` }}
          >
            <div className="mb-3 text-center">
              <span
                className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full"
                style={{ color: cat.accent, backgroundColor: `${cat.accent}1A` }}
              >
                <Icon name={cat.icon} className="h-6 w-6" />
              </span>
              <h3
                className="text-sm font-extrabold uppercase"
                style={{ color: cat.accent }}
              >
                {i + 1}. {cat.label}
              </h3>
              <p className="mt-0.5 text-[11px] text-[#6a4a1a]">{cat.note}</p>
            </div>

            <ul className="flex-1 space-y-2">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="relative rounded-lg border border-gold/30 bg-cream/50 p-2.5"
                >
                  {isAdmin && (
                    <EditControls
                      config={{ ...config, heading: "Sửa tài liệu" }}
                      item={it}
                    />
                  )}
                  <p className="pr-12 text-sm font-semibold text-[#3a2410]">
                    {it.title}
                  </p>
                  {it.body && (
                    <p className="mt-1 line-clamp-3 whitespace-pre-line text-xs text-[#6a4a1a]">
                      {it.body}
                    </p>
                  )}
                  {it.media_url && it.media_type !== "none" && (
                    <a
                      href={it.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-more mt-1"
                    >
                      {it.media_type === "youtube" ? (
                        <>
                          <Icon name="play" className="h-4 w-4" /> Nghe / Xem
                        </>
                      ) : (
                        <>
                          <Icon name="folder" className="h-4 w-4" /> Tải xuống
                        </>
                      )}
                    </a>
                  )}
                </li>
              ))}
              {!isAdmin && items.length === 0 && (
                <li className="rounded-lg border-2 border-dashed border-gold/40 py-6 text-center text-xs text-[#8a6a2a]">
                  Chưa có tài liệu
                </li>
              )}
            </ul>

            {isAdmin && (
              <div className="mt-3">
                <AddItemSlot
                  config={{ ...config, nextOrder: items.length + 1 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gold/60 py-2.5 text-xs font-bold hover:bg-cream-dark"
                  label="Thêm tài liệu"
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
