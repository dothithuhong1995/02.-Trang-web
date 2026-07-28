import Image from "next/image";
import { getRooms, getSettings } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { RoomCard } from "@/components/RoomCard";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminBar } from "@/components/AdminBar";
import { LotusDivider } from "@/components/shared";

export default async function HomePage() {
  const [settings, rooms, admin] = await Promise.all([
    getSettings(),
    getRooms(),
    isAdmin(),
  ]);

  return (
    <>
      <AdminBar isAdmin={admin} />
      <SiteHeader settings={settings} rooms={rooms} isAdmin={admin} />

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-3 pt-4">
          <div className="overflow-hidden rounded-2xl shadow-card ring-1 ring-gold/30">
            <Image
              src={settings.heroUrl}
              alt="Không gian Văn hóa Hồ Chí Minh"
              width={1432}
              height={395}
              priority
              className="h-auto w-full"
            />
          </div>
        </section>

        {/* 7 PHÒNG */}
        <section id="cac-phong" className="mx-auto max-w-7xl scroll-mt-24 px-3 py-8">
          <div className="text-center">
            <LotusDivider />
            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-flag-red md:text-3xl">
              7 Không gian triển lãm
            </h2>
            <LotusDivider />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-7">
            {rooms.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </div>
        </section>

        {/* DẢI QR + KHẨU HIỆU */}
        <section className="mx-auto max-w-7xl px-3 pb-12">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel flex items-center gap-4 p-5">
              {settings.qrUrl ? (
                <Image
                  src={settings.qrUrl}
                  alt="Mã QR"
                  width={110}
                  height={110}
                  className="h-28 w-28 rounded-lg object-contain"
                />
              ) : (
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gold/60 bg-cream text-center text-[10px] font-semibold text-[#8a6a2a]">
                  Mã QR
                  <br />
                  (thêm sau)
                </div>
              )}
              <p className="text-sm font-medium text-[#5a3a12]">
                {settings.footerNote}
              </p>
            </div>

            <div className="panel flex items-center justify-center p-5 text-center">
              <p className="text-sm font-semibold italic text-flag-darkred md:text-base">
                {settings.footerQuote}
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} isAdmin={admin} />
    </>
  );
}
