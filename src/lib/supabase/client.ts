"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Supabase client phía trình duyệt (dùng trong Client Component: form đăng nhập...). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Lấy "vé đăng nhập" (access token) của phiên hiện tại để gửi kèm mỗi thao tác ghi.
 * Nhờ vậy máy chủ xác thực được Admin mà không phụ thuộc cookie.
 */
export async function getAccessToken(): Promise<string | null> {
  // 1) Ưu tiên phiên hiện tại (tự động làm mới token)
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      try {
        localStorage.setItem("kgvh_token", session.access_token);
      } catch {}
      return session.access_token;
    }
  } catch {
    // rơi xuống dự phòng
  }
  // 2) Dự phòng: vé đã lưu lúc đăng nhập
  try {
    return localStorage.getItem("kgvh_token");
  } catch {
    return null;
  }
}
