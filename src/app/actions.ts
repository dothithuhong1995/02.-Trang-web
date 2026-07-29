"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  createSupabaseServerClient,
  supabaseConfigured,
} from "@/lib/supabase/server";
import { parseYouTube } from "@/lib/youtube";
import type { MediaType } from "@/lib/types";

/** Kết quả trả về của các action: rỗng = thành công, có `error` = thất bại (kèm lý do). */
export type ActionResult = { ok?: boolean; error?: string };

function safeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(-60);
}

async function uploadToStorage(
  file: File,
  folder: string
): Promise<{ url: string; type: MediaType }> {
  const admin = createSupabaseAdminClient();
  const path = `${folder}/${Date.now()}-${safeName(file.name)}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await admin.storage
    .from("media")
    .upload(path, new Uint8Array(arrayBuffer), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (error) throw new Error("Tải tệp lên thất bại: " + error.message);
  const { data } = admin.storage.from("media").getPublicUrl(path);
  const type: MediaType = file.type.startsWith("image/")
    ? "image"
    : file.type.startsWith("video/")
    ? "video"
    : "file";
  return { url: data.publicUrl, type };
}

async function ensureAdmin() {
  const configured = supabaseConfigured();
  let cookieNames = "(none)";
  let detail = "";
  try {
    const store = await cookies();
    const names = store
      .getAll()
      .map((c) => c.name)
      .filter((n) => n.startsWith("sb-") || n.includes("auth"));
    cookieNames = names.length ? names.join("|") : "(none)";

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) return; // OK — đã đăng nhập
    detail = error?.message ?? "no-user";
  } catch (e) {
    detail = "EXC:" + (e as Error).message;
  }
  throw new Error(
    `Chưa nhận diện Admin. [configured=${configured}] [cookies=${cookieNames}] [detail=${detail}]`
  );
}

/** Tạo mới hoặc cập nhật một mục nội dung trong phòng. */
export async function saveItemAction(formData: FormData): Promise<ActionResult> {
  try {
    await ensureAdmin();
    const admin = createSupabaseAdminClient();

    const id = (formData.get("id") as string) || null;
    const room_slug = formData.get("room_slug") as string;
    const section = formData.get("section") as string;
    const title = ((formData.get("title") as string) || "").trim() || null;
    const body = ((formData.get("body") as string) || "").trim() || null;
    const youtube = ((formData.get("youtube_url") as string) || "").trim();
    const metaRaw = (formData.get("meta") as string) || "";
    const sort_order = Number(formData.get("sort_order") || 0);
    const file = formData.get("file") as File | null;
    const removeMedia = formData.get("remove_media") === "1";

    if (!room_slug || !section)
      throw new Error("Thiếu thông tin phòng/phân mục.");

    let media_url: string | null | undefined = undefined;
    let media_type: MediaType | undefined = undefined;

    if (file && file.size > 0) {
      const up = await uploadToStorage(file, `${room_slug}/${section}`);
      media_url = up.url;
      media_type = up.type;
    } else if (youtube) {
      const yt = parseYouTube(youtube);
      if (!yt.id) throw new Error("Link YouTube không hợp lệ.");
      media_url = yt.embed;
      media_type = "youtube";
    } else if (removeMedia) {
      media_url = null;
      media_type = "none";
    }

    let meta: Record<string, unknown> = {};
    if (metaRaw) {
      try {
        meta = JSON.parse(metaRaw);
      } catch {
        meta = {};
      }
    }

    if (id) {
      const patch: Record<string, unknown> = { title, body, sort_order };
      if (media_url !== undefined) {
        patch.media_url = media_url;
        patch.media_type = media_type;
      }
      if (metaRaw) patch.meta = meta;
      const { error } = await admin.from("items").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await admin.from("items").insert({
        room_slug,
        section,
        title,
        body,
        media_url: media_url ?? null,
        media_type: media_type ?? "none",
        meta,
        sort_order,
      });
      if (error) throw new Error(error.message);
    }

    revalidatePath(`/phong/${room_slug}`);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** Xóa một mục nội dung. */
export async function deleteItemAction(
  id: string,
  room_slug: string
): Promise<ActionResult> {
  try {
    await ensureAdmin();
    const admin = createSupabaseAdminClient();
    const { error } = await admin.from("items").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(`/phong/${room_slug}`);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** Lưu cấu hình chung (thông tin trường, banner, logo...). */
export async function saveSettingsAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    await ensureAdmin();
    const admin = createSupabaseAdminClient();

    const textKeys = [
      "schoolName",
      "schoolSubtitle",
      "heroTitleTop",
      "heroTitleMain",
      "heroBadge",
      "heroQuote",
      "heroQuoteAuthor",
      "footerNote",
      "footerQuote",
    ];
    const rows: { key: string; value: string }[] = [];
    for (const k of textKeys) {
      const v = formData.get(k);
      if (v !== null) rows.push({ key: k, value: String(v) });
    }

    const fileKeys: { field: string; key: string }[] = [
      { field: "logoFile", key: "logoUrl" },
      { field: "heroFile", key: "heroUrl" },
      { field: "qrFile", key: "qrUrl" },
    ];
    for (const { field, key } of fileKeys) {
      const f = formData.get(field) as File | null;
      if (f && f.size > 0) {
        const up = await uploadToStorage(f, "settings");
        rows.push({ key, value: up.url });
      }
    }

    if (rows.length) {
      const { error } = await admin.from("settings").upsert(rows);
      if (error) throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** Lưu (tạo/cập nhật) thông tin một phòng. */
export async function saveRoomAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    await ensureAdmin();
    const admin = createSupabaseAdminClient();
    const slug = (formData.get("slug") as string)?.trim();
    if (!slug) throw new Error("Thiếu mã phòng.");
    const row = {
      slug,
      idx: Number(formData.get("idx") || 0),
      card_title: (formData.get("card_title") as string) || "",
      title: (formData.get("title") as string) || "",
      subtitle: (formData.get("subtitle") as string) || "",
      accent: (formData.get("accent") as string) || "#C8102E",
      enabled:
        formData.get("enabled") === "on" || formData.get("enabled") === "1",
      sort_order: Number(formData.get("sort_order") || 0),
    };

    let banner_url: string | undefined;
    const bf = formData.get("bannerFile") as File | null;
    if (bf && bf.size > 0) {
      const up = await uploadToStorage(bf, `banners`);
      banner_url = up.url;
    }

    const payload: Record<string, unknown> = { ...row };
    if (banner_url) payload.banner_url = banner_url;

    const { error } = await admin.from("rooms").upsert(payload);
    if (error) throw new Error(error.message);
    revalidatePath("/", "layout");
    revalidatePath(`/phong/${slug}`);
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** Xóa một phòng. */
export async function deleteRoomAction(slug: string): Promise<ActionResult> {
  try {
    await ensureAdmin();
    const admin = createSupabaseAdminClient();
    await admin.from("items").delete().eq("room_slug", slug);
    const { error } = await admin.from("rooms").delete().eq("slug", slug);
    if (error) throw new Error(error.message);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
