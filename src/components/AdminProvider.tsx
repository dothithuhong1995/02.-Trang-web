"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/supabase/client";

const AdminContext = createContext<boolean>(false);

/** Hook: trang/khối con dùng để biết người xem có phải Admin (đã đăng nhập) hay không. */
export function useIsAdmin(): boolean {
  return useContext(AdminContext);
}

/**
 * Xác định trạng thái Admin NGAY phía trình duyệt dựa trên "vé" đăng nhập
 * (không phụ thuộc cookie máy chủ). Nhờ vậy các nút Thêm/Sửa/Xóa hiện ra
 * ngay khi trang tải xong, KHÔNG cần bấm F5.
 * Đồng thời đặt "dấu" kgvh_admin để trang /admin (máy chủ) cũng nhận.
 */
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    getAccessToken().then((token) => {
      if (!alive) return;
      setIsAdmin(!!token);
      if (token && !document.cookie.includes("kgvh_admin=1")) {
        document.cookie =
          "kgvh_admin=1; path=/; max-age=2592000; samesite=lax";
        router.refresh();
      }
    });
    return () => {
      alive = false;
    };
  }, [router]);

  return (
    <AdminContext.Provider value={isAdmin}>{children}</AdminContext.Provider>
  );
}
