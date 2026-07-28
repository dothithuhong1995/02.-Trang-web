import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({
  settings,
  isAdmin,
}: {
  settings: SiteSettings;
  isAdmin: boolean;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-gold/30 bg-flag-deepred text-cream">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-extrabold uppercase text-gold-light">
              Không gian Văn hóa Hồ Chí Minh
            </p>
            <p className="mt-1 text-sm font-semibold">{settings.schoolName}</p>
            <p className="text-xs opacity-80">{settings.schoolSubtitle}</p>
          </div>
          <div className="text-sm md:text-right">
            <p className="italic opacity-90">
              “Học tập và làm theo tấm gương đạo đức Hồ Chí Minh”
            </p>
            <p className="mt-2 text-xs opacity-70">
              © {year} · Bản quyền thuộc {settings.schoolName}
            </p>
            <p className="mt-1 text-xs">
              {isAdmin ? (
                <Link href="/admin" className="underline hover:text-gold-light">
                  Trang quản trị
                </Link>
              ) : (
                <Link
                  href="/admin/dang-nhap"
                  className="opacity-70 hover:text-gold-light hover:opacity-100"
                >
                  Đăng nhập quản trị
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
