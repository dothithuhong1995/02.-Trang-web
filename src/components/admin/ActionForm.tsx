"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/app/actions";

/**
 * Bọc một form gọi Server Action, hiển thị thông báo THÀNH CÔNG hoặc LỖI
 * (kèm lý do thật) ngay tại chỗ thay vì làm sập cả trang.
 */
export function ActionForm({
  action,
  children,
  submitLabel = "Lưu",
  className,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const res = await action(fd);
      if (res?.error) {
        setMsg({ error: res.error });
      } else {
        setMsg({ ok: true });
        router.refresh();
        // Xóa các ô chọn tệp sau khi lưu thành công
        form.querySelectorAll('input[type="file"]').forEach((el) => {
          (el as HTMLInputElement).value = "";
        });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      {children}

      {msg?.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          ❌ Lỗi: {msg.error}
        </p>
      )}
      {msg?.ok && (
        <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
          ✅ Đã lưu thành công!
        </p>
      )}

      <div className="mt-3 flex justify-end">
        <button type="submit" disabled={pending} className="btn-home text-sm disabled:opacity-60">
          {pending ? "Đang lưu..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
