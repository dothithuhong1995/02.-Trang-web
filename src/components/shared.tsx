import Link from "next/link";
import { Icon } from "./icons";

/** Nút lớn "QUAY VỀ TRANG CHỦ" dưới mỗi phòng. */
export function HomeButton() {
  return (
    <div className="flex justify-center py-8">
      <Link href="/" className="btn-home text-sm md:text-base">
        <Icon name="home" className="h-5 w-5" />
        QUAY VỀ TRANG CHỦ
      </Link>
    </div>
  );
}

/** Thanh nhỏ góc trên trái mỗi phòng: về trang chủ. */
export function RoomTopBar() {
  return (
    <div className="absolute left-4 top-4 z-20">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-full bg-flag-red/90 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-soft backdrop-blur hover:bg-flag-red"
      >
        <Icon name="home" className="h-4 w-4" />
        Trang chủ
      </Link>
    </div>
  );
}

/** Ruy băng "PHÒNG N". */
export function RibbonBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ribbon">
      <span className="text-gold">★</span>
      {children}
      <span className="text-gold">★</span>
    </span>
  );
}

/** Đường phân cách hình hoa sen nhỏ. */
export function LotusDivider() {
  return (
    <div className="my-3 flex items-center justify-center gap-3 text-gold">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
      <Icon name="lotus" className="h-5 w-5 text-flag-red" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}

/** Tiêu đề mục trong phòng: ô icon vuông đỏ + chữ + đường kẻ. */
export function SectionHeading({
  icon,
  children,
  color = "#C8102E",
  action,
}: {
  icon: string;
  children: React.ReactNode;
  color?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-soft"
        style={{ backgroundColor: color }}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h2 className="text-lg font-extrabold uppercase tracking-wide text-flag-red md:text-xl">
        {children}
      </h2>
      <span className="mx-1 hidden h-px flex-1 bg-gold/50 sm:block" />
      {action}
    </div>
  );
}
