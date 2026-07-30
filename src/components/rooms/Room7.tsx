"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Item, Room } from "@/lib/types";
import { LIBRARY_CATEGORIES } from "@/lib/seed";
import { useIsAdmin } from "@/components/AdminProvider";
import { AddItemSlot, EditControls } from "@/components/ItemEditor";
import { EmptyNote } from "@/components/Media";
import { Icon } from "@/components/icons";
import { parseYouTube } from "@/lib/youtube";

function mediaForCategory(key: string): "file" | "video" | "none" {
  if (key === "bai-hat") return "video";
  if (key === "tho") return "none";
  return "file";
}

/** Hiển thị nội dung tài liệu ngay trên trang (PDF nhúng, ảnh, video...). */
function LibraryContent({ item }: { item: Item }) {
  const url = item.media_url;
  if (!url || item.media_type === "none") return null;
  const lower = url.toLowerCase();
  const isImage =
    item.media_type === "image" || /\.(jpg|jpeg|png|gif|webp|svg)$/.test(lower);
  const isPdf = /\.pdf($|\?)/.test(lower);

  if (item.media_type === "youtube") {
    const yt = parseYouTube(url);
    return (
      <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={yt.embed ?? url}
          title={item.title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  if (item.media_type === "video") {
    return (
      <video controls className="mt-3 w-full rounded-lg bg-black" src={url} />
    );
  }

  if (isImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={item.title ?? "Hình ảnh"}
        className="mt-3 max-h-[600px] w-full rounded-lg object-contain"
      />
    );
  }

  if (isPdf) {
    return (
      <div className="mt-3">
        <iframe
          src={url}
          title={item.title ?? "Tài liệu PDF"}
          className="h-[600px] w-full rounded-lg border border-gold/30"
        />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-more mt-2"
        >
          <Icon name="arrow-right" className="h-4 w-4" /> Mở toàn màn hình
        </a>
      </div>
    );
  }

  // Tệp khác (Word, Excel...) — không xem trực tiếp được, cho tải xuống.
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-more mt-3"
    >
      <Icon name="folder" className="h-4 w-4" /> Tải xuống
    </a>
  );
}

export function Room7({
  grouped,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
}) {
  const isAdmin = useIsAdmin();
  const searchParams = useSearchParams();
  const muc = searchParams.get("muc");
  const library = grouped["library"] ?? [];

  const current = LIBRARY_CATEGORIES.find((c) => c.key === muc);

  // ---- Chế độ 1: hiện 5 "phòng nhỏ" (danh mục) ----
  if (!current) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {LIBRARY_CATEGORIES.map((cat, i) => {
          const count = library.filter(
            (it) => (it.meta as Record<string, unknown>)?.category === cat.key
          ).length;
          return (
            <Link
              key={cat.key}
              href={`/phong/thu-vien-so?muc=${cat.key}`}
              className="flex flex-col items-center rounded-2xl bg-white/80 p-5 text-center shadow-soft ring-1 ring-gold/20 transition-transform hover:-translate-y-1 hover:shadow-card"
              style={{ borderTop: `4px solid ${cat.accent}` }}
            >
              <span
                className="mb-2 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ color: cat.accent, backgroundColor: `${cat.accent}1A` }}
              >
                <Icon name={cat.icon} className="h-7 w-7" />
              </span>
              <h3
                className="text-sm font-extrabold uppercase"
                style={{ color: cat.accent }}
              >
                {i + 1}. {cat.label}
              </h3>
              <p className="mt-1 text-[11px] text-[#6a4a1a]">{cat.note}</p>
              <span className="mt-3 rounded-full bg-cream-dark px-3 py-1 text-xs font-semibold text-[#7a5a2a]">
                {count} tài liệu
              </span>
              <span className="mt-2 text-xs font-bold text-flag-red">
                Mở →
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  // ---- Chế độ 2: bên trong một "phòng nhỏ" ----
  const media = mediaForCategory(current.key);
  const items = library.filter(
    (it) => (it.meta as Record<string, unknown>)?.category === current.key
  );
  const config = {
    roomSlug: "thu-vien-so",
    section: "library",
    heading: `Thêm vào mục ${current.label}`,
    title: true,
    titleLabel: "Tên tài liệu",
    body: current.key === "tho",
    bodyLabel: "Nội dung",
    media,
    fixedMeta: { category: current.key },
  };

  return (
    <div>
      {/* Đầu mục: quay lại + tên danh mục */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link
          href="/phong/thu-vien-so"
          className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-white/70 px-4 py-2 text-sm font-semibold text-flag-red hover:bg-cream-dark"
        >
          ← Tất cả danh mục
        </Link>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ color: current.accent, backgroundColor: `${current.accent}1A` }}
        >
          <Icon name={current.icon} className="h-6 w-6" />
        </span>
        <h2
          className="text-xl font-extrabold uppercase"
          style={{ color: current.accent }}
        >
          {current.label}
        </h2>
      </div>

      {isAdmin && (
        <div className="mb-4">
          <AddItemSlot
            config={{ ...config, nextOrder: items.length + 1 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-flag-red/50 py-3 text-sm font-bold text-flag-red hover:bg-cream-dark"
            label="+ Thêm tài liệu"
          />
        </div>
      )}

      <div className="space-y-5">
        {items.map((it) => (
          <article
            key={it.id}
            className="relative rounded-xl border border-gold/30 bg-white/80 p-4 shadow-soft"
          >
            {isAdmin && (
              <EditControls
                config={{ ...config, heading: "Sửa tài liệu" }}
                item={it}
              />
            )}
            <p className="pr-16 text-lg font-bold text-flag-red">{it.title}</p>
            {it.body && (
              <p className="mt-1 whitespace-pre-line text-[#3a2410]">
                {it.body}
              </p>
            )}
            <LibraryContent item={it} />
          </article>
        ))}

        {!isAdmin && items.length === 0 && (
          <EmptyNote text="Chưa có tài liệu trong mục này." />
        )}
      </div>
    </div>
  );
}
