import type { Item, Room, SiteSettings } from "./types";

// ==== Cấu hình mặc định (dùng khi chưa kết nối Supabase, và làm giá trị khởi tạo) ====

export const DEFAULT_SETTINGS: SiteSettings = {
  schoolName: "TRƯỜNG TIỂU HỌC NGUYỄN VIẾT XUÂN",
  schoolSubtitle: "PHƯỜNG AN NHƠN – THÀNH PHỐ HỒ CHÍ MINH",
  logoUrl: "/images/logo-placeholder.svg",
  heroUrl: "/images/home-hero.jpeg",
  heroTitleTop: "KHÔNG GIAN VĂN HÓA",
  heroTitleMain: "HỒ CHÍ MINH",
  heroBadge: "TRÊN KHÔNG GIAN SỐ 4D",
  heroQuote:
    "Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu hay không, chính là nhờ một phần lớn ở công học tập của các em.",
  heroQuoteAuthor: "Hồ Chí Minh",
  qrUrl: "",
  footerNote:
    "Quét mã QR để khám phá không gian văn hóa Hồ Chí Minh trên không gian số 4D",
  footerQuote:
    "“Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh là việc làm thường xuyên, tự giác, suốt đời.”",
};

// ==== Bảy phòng triển lãm ====

export const DEFAULT_ROOMS: Room[] = [
  {
    slug: "tieu-su",
    index: 1,
    cardTitle: "TIỂU SỬ\nCHỦ TỊCH\nHỒ CHÍ MINH",
    title: "TIỂU SỬ\nCHỦ TỊCH HỒ CHÍ MINH",
    subtitle:
      "Cuộc đời và hành trình tìm đường cứu nước, giải phóng dân tộc, vì độc lập – tự do – hạnh phúc của Nhân dân.",
    bannerUrl: "/images/room-1-banner.jpeg",
    accent: "#C8102E",
    enabled: true,
    sort_order: 1,
  },
  {
    slug: "cau-chuyen",
    index: 2,
    cardTitle: "NHỮNG\nCÂU CHUYỆN\nVỀ BÁC",
    title: "NHỮNG CÂU CHUYỆN\nvề Bác",
    subtitle:
      "Những câu chuyện giản dị mà sâu sắc về Bác Hồ, thể hiện tình yêu thương bao la và tấm gương đạo đức sáng ngời.",
    bannerUrl: "/images/room-2-banner.png",
    accent: "#E8871E",
    enabled: true,
    sort_order: 2,
  },
  {
    slug: "nam-dieu",
    index: 3,
    cardTitle: "5 ĐIỀU\nBÁC HỒ DẠY",
    title: "5 ĐIỀU BÁC HỒ DẠY",
    subtitle:
      "Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các cháu. – Hồ Chí Minh",
    bannerUrl: "/images/room-3-banner.jpeg",
    accent: "#2E7D32",
    enabled: true,
    sort_order: 3,
  },
  {
    slug: "bac-voi-tphcm",
    index: 4,
    cardTitle: "BÁC HỒ VỚI\nTHÀNH PHỐ\nHỒ CHÍ MINH",
    title: "BÁC HỒ\nvới\nTHÀNH PHỐ HỒ CHÍ MINH",
    subtitle: "Những dấu ấn của Bác Hồ tại Thành phố Hồ Chí Minh.",
    bannerUrl: "/images/room-4-banner.png",
    accent: "#1565C0",
    enabled: true,
    sort_order: 4,
  },
  {
    slug: "lam-theo-loi-bac",
    index: 5,
    cardTitle: "EM LÀM THEO\nLỜI BÁC",
    title: "HỌC SINH LÀM THEO\nLỜI BÁC",
    subtitle: "Những việc tốt, nhật ký và câu chuyện học sinh làm theo lời Bác.",
    bannerUrl: "/images/room-5-banner.png",
    accent: "#6A1B9A",
    enabled: true,
    sort_order: 5,
  },
  {
    slug: "cb-gv-nv",
    index: 6,
    cardTitle: "CB-GV-NV\nHỌC TẬP VÀ LÀM THEO\nTẤM GƯƠNG ĐẠO ĐỨC\nHỒ CHÍ MINH",
    title: "CB-GV-NV HỌC TẬP VÀ LÀM THEO\nTẤM GƯƠNG ĐẠO ĐỨC HỒ CHÍ MINH",
    subtitle: "Không gian trưng bày các hoạt động học tập và làm theo Bác của cán bộ, giáo viên, nhân viên nhà trường.",
    bannerUrl: "/images/room-6-banner.png",
    accent: "#00838F",
    enabled: true,
    sort_order: 6,
  },
  {
    slug: "thu-vien-so",
    index: 7,
    cardTitle: "THƯ VIỆN SỐ",
    title: "THƯ VIỆN SỐ\nVỀ BÁC HỒ",
    subtitle:
      "Kho tài liệu phong phú, chọn lọc về cuộc đời, sự nghiệp và tư tưởng, đạo đức, phong cách Hồ Chí Minh.",
    bannerUrl: "/images/room-7-banner.png",
    accent: "#C2185B",
    enabled: true,
    sort_order: 7,
  },
];

// ==== Nội dung điền sẵn (cố định, ít thay đổi) ====

let _id = 0;
const nid = () => `seed-${++_id}`;

const item = (
  room_slug: string,
  section: string,
  data: Partial<Item> & { sort_order: number }
): Item => ({
  id: nid(),
  room_slug,
  section,
  title: null,
  body: null,
  media_url: null,
  media_type: "none",
  meta: {},
  created_at: "2024-01-01T00:00:00.000Z",
  ...data,
});

// Phòng 1 – Dòng thời gian cuộc đời Bác
const TIMELINE: Item[] = [
  { year: "1890", body: "Sinh ngày 19/5/1890 tại Nghệ An", icon: "home" },
  { year: "1901", body: "Rời Tổ quốc tìm đường cứu nước", icon: "boat" },
  { year: "1911", body: "Ra đi tìm đường cứu nước tại bến Nhà Rồng", icon: "ship" },
  {
    year: "1920",
    body: "Đọc Sơ thảo lần thứ nhất Luận cương về vấn đề dân tộc và thuộc địa của Lênin",
    icon: "book",
  },
  { year: "1930", body: "Thành lập Đảng Cộng sản Việt Nam", icon: "flag" },
  {
    year: "1945",
    body: "Lãnh đạo Cách mạng Tháng Tám thành công, khai sinh nước Việt Nam Dân chủ Cộng hòa",
    icon: "star",
  },
  { year: "1969", body: "Chủ tịch Hồ Chí Minh từ trần ngày 02/9/1969", icon: "lotus" },
].map((t, i) =>
  item("tieu-su", "timeline", {
    body: t.body,
    meta: { year: t.year, icon: t.icon },
    sort_order: i + 1,
  })
);

// Phòng 1 – Hành trình tìm đường cứu nước
const JOURNEY: Item[] = [
  "1911 – Bến Nhà Rồng (Việt Nam)",
  "1911 – Singapore",
  "1912 – Pháp",
  "1917 – Liên Xô",
  "1920 – Anh",
  "1923 – Thái Lan",
  "1924 – Quảng Châu (Trung Quốc)",
  "1941 – Cao Bằng (Việt Nam)",
].map((t, i) =>
  item("tieu-su", "journey", { body: t, sort_order: i + 1 })
);

// Phòng 3 – 5 Điều Bác Hồ dạy (5 khung cố định)
const TEACHINGS: Item[] = [
  { title: "YÊU TỔ QUỐC, YÊU ĐỒNG BÀO", icon: "flag", accent: "#C8102E" },
  { title: "HỌC TẬP TỐT, LAO ĐỘNG TỐT", icon: "book", accent: "#C08A1E" },
  { title: "ĐOÀN KẾT TỐT, KỶ LUẬT TỐT", icon: "people", accent: "#2E7D32" },
  { title: "GIỮ GÌN VỆ SINH THẬT TỐT", icon: "hand", accent: "#1565C0" },
  { title: "KHIÊM TỐN, THẬT THÀ, DŨNG CẢM", icon: "lotus", accent: "#6A1B9A" },
].map((t, i) =>
  item("nam-dieu", "teaching", {
    title: t.title,
    meta: { icon: t.icon, accent: t.accent, order: i + 1 },
    sort_order: i + 1,
  })
);

export const SEED_ITEMS: Item[] = [...TIMELINE, ...JOURNEY, ...TEACHINGS];

/** Số ô "trưng bày" gợi ý cho từng phân mục để hiển thị lưới giống ảnh mẫu. */
export const SLOT_HINTS: Record<string, number> = {
  "cau-chuyen:story": 12,
  "bac-voi-tphcm:place": 10,
  "lam-theo-loi-bac:good_deed_photo": 10,
  "lam-theo-loi-bac:diary": 4,
  "lam-theo-loi-bac:story_media": 6,
  "cb-gv-nv:display": 10,
};

/** Danh mục của Thư viện số (Phòng 7). */
export const LIBRARY_CATEGORIES = [
  { key: "sach", label: "SÁCH ĐIỆN TỬ", note: "Kho sách điện tử về Bác Hồ và Chủ nghĩa yêu nước", icon: "book", accent: "#2E7D32" },
  { key: "truyen", label: "TRUYỆN TRANH", note: "Những câu chuyện tranh sinh động về Bác Hồ", icon: "comic", accent: "#C2185B" },
  { key: "bai-hat", label: "BÀI HÁT", note: "Các bài hát ca ngợi Bác Hồ kính yêu", icon: "music", accent: "#E8871E" },
  { key: "tho", label: "THƠ", note: "Những vần thơ hay viết về Bác Hồ", icon: "feather", accent: "#6A1B9A" },
  { key: "tai-lieu-gv", label: "TÀI LIỆU GIÁO VIÊN", note: "Tài liệu tham khảo cho giáo viên", icon: "teacher", accent: "#1565C0" },
] as const;
