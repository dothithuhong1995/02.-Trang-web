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
 * Phiên bản v1: bất kỳ tài khoản đăng nhập hợp lệ nào cũng là Admin
 * (chỉ Admin mới có tài khoản). Có thể siết theo NEXT_PUBLIC_ADMIN_EMAIL.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    return user.email?.toLowerCase() === adminEmail;
  }
  return true;
}
