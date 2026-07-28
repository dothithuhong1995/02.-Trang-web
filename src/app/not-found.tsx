import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-black text-flag-red">404</p>
      <h1 className="mt-2 text-xl font-bold text-[#4a2f10]">
        Không tìm thấy trang
      </h1>
      <p className="mt-1 text-sm text-[#6a4a1a]">
        Trang bạn tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link href="/" className="btn-home mt-6">
        Quay về trang chủ
      </Link>
    </main>
  );
}
