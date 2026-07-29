"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError("Email hoặc mật khẩu chưa đúng.");
        setLoading(false);
        return;
      }
      // Lưu "vé" đăng nhập dự phòng, để thao tác Lưu luôn có token gửi lên.
      if (data.session?.access_token) {
        try {
          localStorage.setItem("kgvh_token", data.session.access_token);
        } catch {}
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#4a2f10]">
          Email quản trị
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gold/40 bg-cream/50 px-3 py-2.5 outline-none focus:border-flag-red focus:ring-1 focus:ring-flag-red"
          placeholder="admin@truong..."
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#4a2f10]">
          Mật khẩu
        </span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gold/40 bg-cream/50 px-3 py-2.5 outline-none focus:border-flag-red focus:ring-1 focus:ring-flag-red"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-home w-full justify-center disabled:opacity-60"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <p className="pt-2 text-center text-sm">
        <Link href="/" className="text-flag-red hover:underline">
          ← Về trang chủ
        </Link>
      </p>
    </form>
  );
}
