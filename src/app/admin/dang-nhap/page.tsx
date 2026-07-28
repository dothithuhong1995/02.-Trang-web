import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Đăng nhập quản trị" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const settings = await getSettings();
  const configured = supabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Image
            src={settings.logoUrl}
            alt="Logo"
            width={72}
            height={72}
            className="mx-auto h-18 w-18 rounded-full"
          />
          <h1 className="mt-3 text-xl font-extrabold uppercase text-flag-red">
            Đăng nhập Quản trị
          </h1>
          <p className="mt-1 text-sm text-[#6a4a1a]">
            Không gian Văn hóa Hồ Chí Minh
          </p>
        </div>

        <div className="panel bg-white/90 p-6">
          {configured ? (
            <LoginForm />
          ) : (
            <div className="space-y-3 text-sm text-[#4a2f10]">
              <p className="rounded-lg bg-amber-50 px-3 py-2 font-medium text-amber-800">
                Website chưa được kết nối Supabase nên chưa thể đăng nhập.
              </p>
              <p>
                Vui lòng làm theo hướng dẫn trong tệp{" "}
                <code className="rounded bg-cream-dark px-1">
                  HUONG-DAN-TRIEN-KHAI.md
                </code>{" "}
                để tạo cơ sở dữ liệu và tài khoản quản trị.
              </p>
              <Link href="/" className="link-more">
                ← Về trang chủ
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
