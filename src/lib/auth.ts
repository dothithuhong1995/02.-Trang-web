import { cookies } from "next/headers";
import { createSupabaseServerClient, supabaseConfigured } from "./supabase/server";

/** Trả về người dùng đang đăng nhập (hoặc null). */
export async function getCurrentUser() {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

/**
 * Kiểm tra người dùng hiện tại có quyền quản trị hay không.
 * Phiên bản v1 (1 Admin): bất kỳ tài khoản Supabase đăng nhập hợp lệ nào cũng là Admin.
 * (Chỉ Admin mới có tài khoản, nên không cần so khớp email.)
 */
export async function isAdmin(): Promise<boolean> {
  // Dấu đăng nhập đơn giản (đặt lúc login) — dùng để hiện/ẩn giao diện quản trị
  // trên mọi trang. Bảo mật ghi dữ liệu vẫn do access token + RLS đảm nhận.
  try {
    const store = await cookies();
    if (store.get("kgvh_admin")?.value === "1") return true;
  } catch {
    // bỏ qua
  }
  const user = await getCurrentUser();
  return !!user;
}
