import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Kiểm tra đã cấu hình biến môi trường Supabase hợp lệ hay chưa. */
export function supabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !!url &&
    !!key &&
    url.startsWith("http") &&
    !url.includes("your-project-ref")
  );
}

/**
 * Tạo Supabase client phía máy chủ, gắn cookie phiên đăng nhập.
 * Dùng trong Server Component, Route Handler và Server Action.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            );
          } catch {
            // Server Component không được phép ghi cookie — bỏ qua an toàn.
          }
        },
      },
    }
  );
}
