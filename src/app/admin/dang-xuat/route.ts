import { NextResponse } from "next/server";
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (supabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // bỏ qua
    }
  }
  const res = NextResponse.redirect(new URL("/", request.url));
  // Xóa "dấu" đăng nhập để ẩn giao diện quản trị.
  res.cookies.set("kgvh_admin", "", { path: "/", maxAge: 0 });
  return res;
}
