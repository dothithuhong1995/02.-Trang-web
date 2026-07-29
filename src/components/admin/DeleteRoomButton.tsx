"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRoomAction } from "@/app/actions";
import { Icon } from "@/components/icons";

export function DeleteRoomButton({ slug, name }: { slug: string; name: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  function onClick() {
    if (
      !confirm(
        `Xóa phòng "${name}"? Toàn bộ nội dung trong phòng cũng sẽ bị xóa. Không thể hoàn tác.`
      )
    )
      return;
    start(async () => {
      const res = await deleteRoomAction(slug);
      if (res?.error) {
        alert("Lỗi: " + res.error);
        return;
      }
      router.refresh();
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Icon name="trash" className="h-4 w-4" />
      {pending ? "Đang xóa..." : "Xóa phòng"}
    </button>
  );
}
