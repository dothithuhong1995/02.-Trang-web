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
  return NextResponse.redirect(new URL("/", request.url));
}
