import Link from "next/link";

/** Thanh nhắc chế độ quản trị, chỉ hiện khi Admin đã đăng nhập. */
export function AdminBar({ isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return null;
  return (
    <div className="bg-flag-darkred text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 text-xs font-medium">
        <span className="font-bold text-gold-light">● Chế độ Quản trị</span>
        <span className="opacity-90">
          Bạn có thể thêm/sửa/xóa nội dung trực tiếp trên các phòng.
        </span>
        <Link href="/admin" className="ml-auto underline hover:text-gold-light">
          Bảng điều khiển
        </Link>
        <Link href="/admin/dang-xuat" className="underline hover:text-gold-light">
          Đăng xuất
        </Link>
      </div>
    </div>
  );
}
