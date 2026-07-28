import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client dùng khóa service_role — CHỈ chạy phía máy chủ (Server Action / Route Handler).
 * Bỏ qua RLS, dùng cho thao tác ghi của Admin sau khi đã xác thực quyền.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY hoặc NEXT_PUBLIC_SUPABASE_URL."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
