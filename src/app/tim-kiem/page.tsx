import Link from "next/link";
import { getRooms, getSettings, searchItems } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Icon } from "@/components/icons";
import type { Room } from "@/lib/types";

export const metadata = { title: "Tìm kiếm" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const [settings, rooms, admin] = await Promise.all([
    getSettings(),
    getRooms(),
    isAdmin(),
  ]);
  const results = q.trim() ? await searchItems(q) : [];
  const roomBySlug = new Map<string, Room>(rooms.map((r) => [r.slug, r]));

  return (
    <>
      <SiteHeader settings={settings} rooms={rooms} isAdmin={admin} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-extrabold text-flag-red">Tìm kiếm nội dung</h1>

        <form action="/tim-kiem" className="mt-4 flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Nhập từ khóa (câu chuyện, địa điểm, tài liệu...)"
            className="flex-1 rounded-full border border-gold/40 bg-white px-5 py-3 outline-none focus:border-flag-red focus:ring-1 focus:ring-flag-red"
          />
          <button className="btn-home" type="submit">
            <Icon name="search" className="h-5 w-5" /> Tìm
          </button>
        </form>

        {q.trim() && (
          <p className="mt-4 text-sm text-[#6a4a1a]">
            {results.length > 0
              ? `Tìm thấy ${results.length} kết quả cho “${q}”.`
              : `Không tìm thấy kết quả nào cho “${q}”.`}
          </p>
        )}

        <div className="mt-4 space-y-3">
          {results.map((it) => {
            const room = roomBySlug.get(it.room_slug);
            return (
              <Link
                key={it.id}
                href={`/phong/${it.room_slug}`}
                className="block rounded-xl border border-gold/30 bg-white/80 p-4 hover:shadow-card"
              >
                <div className="mb-1 text-xs font-semibold uppercase text-flag-red">
                  {room ? room.cardTitle.replace(/\n/g, " ") : it.room_slug}
                </div>
                {it.title && (
                  <div className="font-bold text-[#3a2410]">{it.title}</div>
                )}
                {it.body && (
                  <p className="line-clamp-2 text-sm text-[#6a4a1a]">{it.body}</p>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
