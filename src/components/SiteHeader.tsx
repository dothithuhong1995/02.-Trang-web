"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Room, SiteSettings } from "@/lib/types";
import { Icon } from "./icons";

export function SiteHeader({
  settings,
  rooms,
  isAdmin,
}: {
  settings: SiteSettings;
  rooms: Room[];
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/30 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        {/* Logo + tên trường */}
        <Link href="/" className="flex items-center gap-3">
          <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full">
            <Image
              src={settings.logoUrl}
              alt="Logo trường"
              fill
              sizes="56px"
              className="object-contain"
            />
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] font-semibold tracking-wide text-flag-red/80">
              {splitName(settings.schoolName).prefix}
            </span>
            <span className="block text-base font-extrabold uppercase text-flag-red md:text-lg">
              {splitName(settings.schoolName).main}
            </span>
            <span className="hidden text-[10px] font-medium tracking-wide text-[#7a5a2a] sm:block">
              {settings.schoolSubtitle}
            </span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <NavLink href="/" active>
            <Icon name="home" className="h-4 w-4" /> Trang chủ
          </NavLink>
          <NavLink href="/#cac-phong">7 Phòng triển lãm</NavLink>
          <NavLink href="/phong/thu-vien-so">Thư viện số</NavLink>
          <NavLink href="/phong/lam-theo-loi-bac">Hoạt động</NavLink>
          <NavLink href="/phong/tieu-su">Dòng thời gian</NavLink>

          {/* Dropdown "Khác" */}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#5a3a12] hover:bg-cream-dark">
              Khác ▾
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full w-64 rounded-xl border border-gold/30 bg-white p-2 shadow-card">
                {rooms.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/phong/${r.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-[#4a2f10] hover:bg-cream-dark"
                  >
                    {r.index}. {oneLine(r.cardTitle)}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="mt-1 block rounded-lg bg-flag-red px-3 py-2 text-sm font-semibold text-white hover:bg-flag-darkred"
                  >
                    ⚙ Trang quản trị
                  </Link>
                )}
              </div>
            )}
          </div>

          <Link
            href="/tim-kiem"
            aria-label="Tìm kiếm"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-flag-red hover:bg-cream-dark"
          >
            <Icon name="search" className="h-5 w-5" />
          </Link>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-flag-red text-xl text-gold-light">
            ★
          </span>
        </nav>

        {/* Nút menu mobile */}
        <button
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-gold/50 text-flag-red lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Mở menu"
        >
          <span className="text-2xl leading-none">≡</span>
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-gold/30 bg-cream px-4 py-3 lg:hidden">
          <MobileLink href="/" onClick={() => setOpen(false)}>
            Trang chủ
          </MobileLink>
          <MobileLink href="/#cac-phong" onClick={() => setOpen(false)}>
            7 Phòng triển lãm
          </MobileLink>
          {rooms.map((r) => (
            <MobileLink
              key={r.slug}
              href={`/phong/${r.slug}`}
              onClick={() => setOpen(false)}
            >
              {r.index}. {oneLine(r.cardTitle)}
            </MobileLink>
          ))}
          <MobileLink href="/tim-kiem" onClick={() => setOpen(false)}>
            🔍 Tìm kiếm
          </MobileLink>
          {isAdmin && (
            <MobileLink href="/admin" onClick={() => setOpen(false)}>
              ⚙ Trang quản trị
            </MobileLink>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors " +
        (active
          ? "bg-flag-red text-white shadow-soft"
          : "text-[#5a3a12] hover:bg-cream-dark")
      }
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-3 py-2.5 font-semibold text-[#4a2f10] hover:bg-cream-dark"
    >
      {children}
    </Link>
  );
}

/** Tách tên trường thành phần "loại trường" (nhỏ) và "tên riêng" (to). */
function splitName(name: string): { prefix: string; main: string } {
  const kinds = ["TIỂU HỌC", "TRUNG HỌC CƠ SỞ", "TRUNG HỌC PHỔ THÔNG", "THCS", "THPT", "MẦM NON"];
  const upper = name.toUpperCase();
  for (const k of kinds) {
    const at = upper.indexOf(k);
    if (at !== -1) {
      const cut = at + k.length;
      return { prefix: name.slice(0, cut).trim(), main: name.slice(cut).trim() };
    }
  }
  return { prefix: "TRƯỜNG", main: name.replace(/^TRƯỜNG\s+/i, "") };
}

function oneLine(s: string) {
  return s.replace(/\n/g, " ");
}
