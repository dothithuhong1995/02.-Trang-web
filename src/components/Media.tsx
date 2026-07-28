import Image from "next/image";
import type { Item } from "@/lib/types";
import { parseYouTube } from "@/lib/youtube";
import { RoomTopBar } from "./shared";
import { Icon } from "./icons";

/** Banner đầu phòng (ảnh đã có sẵn tiêu đề "PHÒNG N"). */
export function RoomBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative">
      <RoomTopBar />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block h-auto w-full" />
    </div>
  );
}

/** Ảnh của một mục (dạng lấp đầy khung). */
export function ItemImage({ item, alt }: { item: Item; alt?: string }) {
  if (!item.media_url) return null;
  return (
    <Image
      src={item.media_url}
      alt={alt ?? item.title ?? "Hình ảnh"}
      fill
      sizes="(max-width:768px) 45vw, 20vw"
      className="object-cover"
    />
  );
}

/** Khung video lớn: nhúng YouTube hoặc phát tệp video. */
export function VideoBox({ item }: { item: Item | undefined }) {
  if (!item || !item.media_url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-gold/50 bg-cream/60 text-sm text-[#8a6a2a]">
        Chưa có video
      </div>
    );
  }
  if (item.media_type === "youtube") {
    const yt = parseYouTube(item.media_url);
    const embed = yt.embed ?? item.media_url;
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-soft">
        <iframe
          src={embed}
          title={item.title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }
  return (
    <video
      controls
      className="aspect-video w-full rounded-xl bg-black shadow-soft"
      src={item.media_url}
    />
  );
}

/** Ô media nhỏ trong lưới (ảnh / video thu nhỏ / tệp). */
export function MediaTile({ item }: { item: Item }) {
  if (item.media_type === "image" && item.media_url) {
    return <ItemImage item={item} />;
  }
  if (item.media_type === "youtube" && item.media_url) {
    const yt = parseYouTube(item.media_url);
    return (
      <>
        {yt.thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={yt.thumb} alt={item.title ?? "Video"} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white">
            <Icon name="play" className="h-6 w-6" />
          </span>
        </span>
      </>
    );
  }
  if (item.media_type === "video" && item.media_url) {
    return <video src={item.media_url} className="absolute inset-0 h-full w-full object-cover" />;
  }
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-flag-red">
      <Icon name="folder" className="h-10 w-10" />
    </span>
  );
}

/** Thông báo khi khách xem mà chưa có nội dung. */
export function EmptyNote({ text = "Nội dung đang được cập nhật." }: { text?: string }) {
  return (
    <div className="col-span-full rounded-2xl border-2 border-dashed border-gold/40 bg-cream/50 py-10 text-center text-sm font-medium text-[#8a6a2a]">
      {text}
    </div>
  );
}
