// ==== Kiểu dữ liệu dùng chung cho toàn bộ website ====

export type MediaType = "image" | "video" | "youtube" | "file" | "none";

/** Một mục nội dung bất kỳ trong một phòng (câu chuyện, ảnh, mốc thời gian, tài liệu...). */
export interface Item {
  id: string;
  room_slug: string;
  /** Phân mục trong phòng, ví dụ: 'timeline', 'journey', 'video', 'story', 'teaching', 'place', 'good_deed_photo', 'diary', 'story_media', 'display', 'library'. */
  section: string;
  title: string | null;
  body: string | null;
  media_url: string | null;
  media_type: MediaType;
  /** Dữ liệu phụ tùy phân mục: { year, icon, accent, category, order... } */
  meta: Record<string, unknown>;
  sort_order: number;
  created_at: string;
  /** Thời điểm đưa vào thùng rác. NULL/không có = đang hiển thị. */
  deleted_at?: string | null;
}

/** Thông tin cấu hình chung của website (Admin chỉnh trong trang quản trị). */
export interface SiteSettings {
  schoolName: string;
  schoolSubtitle: string;
  logoUrl: string;
  heroUrl: string;
  heroTitleTop: string;
  heroTitleMain: string;
  heroBadge: string;
  heroQuote: string;
  heroQuoteAuthor: string;
  qrUrl: string;
  footerNote: string;
  footerQuote: string;
}

/** Định nghĩa một phòng triển lãm. */
export interface Room {
  slug: string;
  index: number;
  /** Tên hiển thị trên thẻ ngoài trang chủ (có thể xuống dòng bằng \n). */
  cardTitle: string;
  /** Tiêu đề lớn trong trang phòng. */
  title: string;
  subtitle: string;
  bannerUrl: string;
  /** Màu nhấn của thẻ/phòng (mã hex). */
  accent: string;
  enabled: boolean;
  sort_order: number;
}
