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
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}
