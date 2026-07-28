import Link from "next/link";
import Image from "next/image";
import type { Room } from "@/lib/types";

/** Thẻ một phòng triển lãm ngoài trang chủ. */
export function RoomCard({ room }: { room: Room }) {
  const accent = room.accent || "#C8102E";
  return (
    <Link
      href={`/phong/${room.slug}`}
      className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1.5"
    >
      {/* Ảnh nền */}
      <Image
        src={room.bannerUrl}
        alt={oneLine(room.title)}
        fill
        sizes="(max-width: 768px) 45vw, 14vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Lớp phủ màu nhấn */}
      <span
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${accent}B3 0%, ${accent}D9 45%, ${accent} 100%)`,
        }}
      />

      {/* Nội dung */}
      <div className="relative z-10 flex h-full flex-col items-center p-3 text-center text-white">
        <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-white/15 text-lg font-extrabold backdrop-blur-sm">
          {String(room.index).padStart(2, "0")}
        </span>
        <h3 className="mt-3 whitespace-pre-line text-[13px] font-extrabold uppercase leading-snug drop-shadow md:text-sm">
          {room.cardTitle}
        </h3>
        <span className="mt-auto inline-flex items-center gap-1 rounded-full bg-black/25 px-4 py-1.5 text-xs font-bold backdrop-blur-sm transition-colors group-hover:bg-black/40">
          Khám phá →
        </span>
      </div>
    </Link>
  );
}

function oneLine(s: string) {
  return s.replace(/\n/g, " ");
}
