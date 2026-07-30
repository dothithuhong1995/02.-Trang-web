"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/supabase/client";

/**
 * Chạy trên mọi trang: nếu trình duyệt đang có "vé" đăng nhập (session/token)
 * thì đặt "dấu" kgvh_admin để máy chủ hiện giao diện quản trị — không phụ thuộc
 * việc có đi qua form đăng nhập hay không. Nếu hết phiên thì gỡ dấu.
 */
export function AdminCookieSync() {
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    getAccessToken().then((token) => {
      if (cancelled) return;
      const has = document.cookie.includes("kgvh_admin=1");
      // CHỈ đặt dấu khi có vé; KHÔNG bao giờ tự xóa (tránh nhấp nháy/mất nút).
      // Dấu chỉ bị gỡ khi bấm Đăng xuất.
      if (token && !has) {
        document.cookie = "kgvh_admin=1; path=/; max-age=2592000; samesite=lax";
        router.refresh();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);
  return null;
}
