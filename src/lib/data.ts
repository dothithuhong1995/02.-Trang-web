import {
  DEFAULT_ROOMS,
  DEFAULT_SETTINGS,
  SEED_ITEMS,
} from "./seed";
import type { Item, Room, SiteSettings } from "./types";
import {
  createSupabaseServerClient,
  supabaseConfigured,
} from "./supabase/server";

/**
 * Lấy cấu hình chung của website.
 * Chưa kết nối Supabase -> dùng mặc định. Có kết nối -> phủ giá trị Admin đã lưu.
 */
export async function getSettings(): Promise<SiteSettings> {
  if (!supabaseConfigured()) return DEFAULT_SETTINGS;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("settings").select("key,value");
    if (error || !data) return DEFAULT_SETTINGS;
    const merged: SiteSettings = { ...DEFAULT_SETTINGS };
    for (const row of data as { key: string; value: string }[]) {
      if (row.key in merged && row.value != null) {
        (merged as unknown as Record<string, string>)[row.key] = row.value;
      }
    }
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Lấy danh sách phòng (đã bật, sắp xếp theo thứ tự). */
export async function getRooms(): Promise<Room[]> {
  if (!supabaseConfigured()) return DEFAULT_ROOMS;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_ROOMS;
    return (data as RoomRow[]).map(mapRoomRow);
  } catch {
    return DEFAULT_ROOMS;
  }
}

/** Hàng dữ liệu phòng trong CSDL (snake_case). */
interface RoomRow {
  slug: string;
  idx: number;
  card_title: string;
  title: string;
  subtitle: string;
  banner_url: string;
  accent: string;
  enabled: boolean;
  sort_order: number;
}

function mapRoomRow(r: RoomRow): Room {
  return {
    slug: r.slug,
    index: r.idx,
    cardTitle: r.card_title,
    title: r.title,
    subtitle: r.subtitle,
    bannerUrl: r.banner_url,
    accent: r.accent,
    enabled: r.enabled,
    sort_order: r.sort_order,
  };
}

export async function getRoom(slug: string): Promise<Room | null> {
  const rooms = await getRooms();
  return rooms.find((r) => r.slug === slug) ?? null;
}

/**
 * Lấy các mục nội dung của một phòng (có thể lọc theo phân mục).
 */
export async function getItems(
  roomSlug: string,
  section?: string
): Promise<Item[]> {
  if (!supabaseConfigured()) {
    return SEED_ITEMS.filter(
      (i) => i.room_slug === roomSlug && (!section || i.section === section)
    ).sort((a, b) => a.sort_order - b.sort_order);
  }
  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("items")
      .select("*")
      .eq("room_slug", roomSlug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (section) query = query.eq("section", section);
    const { data, error } = await query;
    if (error || !data) return [];
    // Ẩn các mục đang trong thùng rác (lọc phía JS để an toàn kể cả khi cột
    // deleted_at chưa được thêm vào CSDL).
    return (data as unknown as Item[]).filter((i) => !i.deleted_at);
  } catch {
    return [];
  }
}

/** Lấy các mục trong thùng rác (đã xóa mềm). Dùng cho trang Thùng rác. */
export async function getTrashedItems(): Promise<Item[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });
    if (error || !data) return [];
    return data as unknown as Item[];
  } catch {
    return [];
  }
}

/** Tìm kiếm nội dung theo từ khóa (trong tiêu đề & nội dung các mục). */
export async function searchItems(q: string): Promise<Item[]> {
  const term = q.trim();
  if (!term) return [];
  if (!supabaseConfigured()) {
    const low = term.toLowerCase();
    return SEED_ITEMS.filter(
      (i) =>
        (i.title ?? "").toLowerCase().includes(low) ||
        (i.body ?? "").toLowerCase().includes(low)
    );
  }
  try {
    const supabase = await createSupabaseServerClient();
    const pattern = `%${term}%`;
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .or(`title.ilike.${pattern},body.ilike.${pattern}`)
      .limit(60);
    if (error || !data) return [];
    return data as unknown as Item[];
  } catch {
    return [];
  }
}

/** Gom nhóm các mục theo phân mục — tiện cho các phòng nhiều phân mục. */
export async function getItemsGrouped(
  roomSlug: string
): Promise<Record<string, Item[]>> {
  const items = await getItems(roomSlug);
  const grouped: Record<string, Item[]> = {};
  for (const it of items) {
    (grouped[it.section] ||= []).push(it);
  }
  return grouped;
}
