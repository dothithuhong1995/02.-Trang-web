-- =====================================================================
--  KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH — Lược đồ cơ sở dữ liệu Supabase
--  Chạy toàn bộ file này 1 lần trong: Supabase Dashboard > SQL Editor
--  (Xem hướng dẫn chi tiết trong HUONG-DAN-TRIEN-KHAI.md)
-- =====================================================================

-- ---------- 1. BẢNG ----------

-- Cấu hình chung dạng khóa - giá trị
create table if not exists public.settings (
  key   text primary key,
  value text
);

-- Các phòng triển lãm
create table if not exists public.rooms (
  slug       text primary key,
  idx        int  not null default 0,
  card_title text not null default '',
  title      text not null default '',
  subtitle   text not null default '',
  banner_url text not null default '',
  accent     text not null default '#C8102E',
  enabled    boolean not null default true,
  sort_order int not null default 0
);

-- Mọi mục nội dung trong các phòng
create table if not exists public.items (
  id         uuid primary key default gen_random_uuid(),
  room_slug  text not null,
  section    text not null,
  title      text,
  body       text,
  media_url  text,
  media_type text not null default 'none',
  meta       jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists items_room_section_idx
  on public.items (room_slug, section, sort_order);

-- ---------- 2. BẢO MẬT (RLS) ----------
-- Ai cũng ĐỌC được (khách xem web). Chỉ tài khoản đăng nhập (Admin) mới GHI.

alter table public.settings enable row level security;
alter table public.rooms    enable row level security;
alter table public.items    enable row level security;

-- settings
drop policy if exists "settings_read"  on public.settings;
drop policy if exists "settings_write" on public.settings;
create policy "settings_read"  on public.settings for select using (true);
create policy "settings_write" on public.settings for all
  to authenticated using (true) with check (true);

-- rooms
drop policy if exists "rooms_read"  on public.rooms;
drop policy if exists "rooms_write" on public.rooms;
create policy "rooms_read"  on public.rooms for select using (true);
create policy "rooms_write" on public.rooms for all
  to authenticated using (true) with check (true);

-- items
drop policy if exists "items_read"  on public.items;
drop policy if exists "items_write" on public.items;
create policy "items_read"  on public.items for select using (true);
create policy "items_write" on public.items for all
  to authenticated using (true) with check (true);

-- ---------- 3. KHO LƯU TRỮ TỆP (Storage) ----------
-- Tạo bucket công khai "media" để chứa ảnh/video/tài liệu tải lên.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
drop policy if exists "media_auth_write"  on storage.objects;
drop policy if exists "media_auth_update" on storage.objects;
drop policy if exists "media_auth_delete" on storage.objects;

create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media_auth_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "media_auth_update" on storage.objects
  for update to authenticated using (bucket_id = 'media');
create policy "media_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ---------- 4. DỮ LIỆU CẤU HÌNH MẶC ĐỊNH ----------

insert into public.settings (key, value) values
  ('schoolName',      'TRƯỜNG TIỂU HỌC NGUYỄN VIẾT XUÂN'),
  ('schoolSubtitle',  'PHƯỜNG AN NHƠN – THÀNH PHỐ HỒ CHÍ MINH'),
  ('logoUrl',         '/images/logo-placeholder.svg'),
  ('heroUrl',         '/images/home-hero.jpeg'),
  ('heroTitleTop',    'KHÔNG GIAN VĂN HÓA'),
  ('heroTitleMain',   'HỒ CHÍ MINH'),
  ('heroBadge',       'TRÊN KHÔNG GIAN SỐ 4D'),
  ('heroQuote',       'Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu hay không, chính là nhờ một phần lớn ở công học tập của các em.'),
  ('heroQuoteAuthor', 'Hồ Chí Minh'),
  ('qrUrl',           ''),
  ('footerNote',      'Quét mã QR để khám phá không gian văn hóa Hồ Chí Minh trên không gian số 4D'),
  ('footerQuote',     '“Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh là việc làm thường xuyên, tự giác, suốt đời.”')
on conflict (key) do nothing;

-- ---------- 5. BẢY PHÒNG ----------

insert into public.rooms (slug, idx, card_title, title, subtitle, banner_url, accent, enabled, sort_order) values
  ('tieu-su', 1, E'TIỂU SỬ\nCHỦ TỊCH\nHỒ CHÍ MINH', E'TIỂU SỬ\nCHỦ TỊCH HỒ CHÍ MINH',
   'Cuộc đời và hành trình tìm đường cứu nước, giải phóng dân tộc, vì độc lập – tự do – hạnh phúc của Nhân dân.',
   '/images/room-1-banner.jpeg', '#C8102E', true, 1),
  ('cau-chuyen', 2, E'NHỮNG\nCÂU CHUYỆN\nVỀ BÁC', E'NHỮNG CÂU CHUYỆN\nvề Bác',
   'Những câu chuyện giản dị mà sâu sắc về Bác Hồ, thể hiện tình yêu thương bao la và tấm gương đạo đức sáng ngời.',
   '/images/room-2-banner.png', '#E8871E', true, 2),
  ('nam-dieu', 3, E'5 ĐIỀU\nBÁC HỒ DẠY', '5 ĐIỀU BÁC HỒ DẠY',
   'Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các cháu. – Hồ Chí Minh',
   '/images/room-3-banner.jpeg', '#2E7D32', true, 3),
  ('bac-voi-tphcm', 4, E'BÁC HỒ VỚI\nTHÀNH PHỐ\nHỒ CHÍ MINH', E'BÁC HỒ\nvới\nTHÀNH PHỐ HỒ CHÍ MINH',
   'Những dấu ấn của Bác Hồ tại Thành phố Hồ Chí Minh.',
   '/images/room-4-banner.png', '#1565C0', true, 4),
  ('lam-theo-loi-bac', 5, E'EM LÀM THEO\nLỜI BÁC', E'HỌC SINH LÀM THEO\nLỜI BÁC',
   'Những việc tốt, nhật ký và câu chuyện học sinh làm theo lời Bác.',
   '/images/room-5-banner.png', '#6A1B9A', true, 5),
  ('cb-gv-nv', 6, E'CB-GV-NV\nHỌC TẬP VÀ LÀM THEO\nTẤM GƯƠNG ĐẠO ĐỨC\nHỒ CHÍ MINH', E'CB-GV-NV HỌC TẬP VÀ LÀM THEO\nTẤM GƯƠNG ĐẠO ĐỨC HỒ CHÍ MINH',
   'Không gian trưng bày các hoạt động học tập và làm theo Bác của cán bộ, giáo viên, nhân viên nhà trường.',
   '/images/room-6-banner.png', '#00838F', true, 6),
  ('thu-vien-so', 7, 'THƯ VIỆN SỐ', E'THƯ VIỆN SỐ\nVỀ BÁC HỒ',
   'Kho tài liệu phong phú, chọn lọc về cuộc đời, sự nghiệp và tư tưởng, đạo đức, phong cách Hồ Chí Minh.',
   '/images/room-7-banner.png', '#C2185B', true, 7)
on conflict (slug) do nothing;

-- ---------- 6. NỘI DUNG ĐIỀN SẴN ----------

-- Phòng 1 — Dòng thời gian
insert into public.items (room_slug, section, body, meta, sort_order) values
  ('tieu-su','timeline','Sinh ngày 19/5/1890 tại Nghệ An', '{"year":"1890","icon":"home"}', 1),
  ('tieu-su','timeline','Rời Tổ quốc tìm đường cứu nước', '{"year":"1901","icon":"boat"}', 2),
  ('tieu-su','timeline','Ra đi tìm đường cứu nước tại bến Nhà Rồng', '{"year":"1911","icon":"ship"}', 3),
  ('tieu-su','timeline','Đọc Sơ thảo lần thứ nhất Luận cương về vấn đề dân tộc và thuộc địa của Lênin', '{"year":"1920","icon":"book"}', 4),
  ('tieu-su','timeline','Thành lập Đảng Cộng sản Việt Nam', '{"year":"1930","icon":"flag"}', 5),
  ('tieu-su','timeline','Lãnh đạo Cách mạng Tháng Tám thành công, khai sinh nước Việt Nam Dân chủ Cộng hòa', '{"year":"1945","icon":"star"}', 6),
  ('tieu-su','timeline','Chủ tịch Hồ Chí Minh từ trần ngày 02/9/1969', '{"year":"1969","icon":"lotus"}', 7);

-- Phòng 1 — Hành trình tìm đường cứu nước
insert into public.items (room_slug, section, body, sort_order) values
  ('tieu-su','journey','1911 – Bến Nhà Rồng (Việt Nam)', 1),
  ('tieu-su','journey','1911 – Singapore', 2),
  ('tieu-su','journey','1912 – Pháp', 3),
  ('tieu-su','journey','1917 – Liên Xô', 4),
  ('tieu-su','journey','1920 – Anh', 5),
  ('tieu-su','journey','1923 – Thái Lan', 6),
  ('tieu-su','journey','1924 – Quảng Châu (Trung Quốc)', 7),
  ('tieu-su','journey','1941 – Cao Bằng (Việt Nam)', 8);

-- Phòng 3 — 5 Điều Bác Hồ dạy
insert into public.items (room_slug, section, title, meta, sort_order) values
  ('nam-dieu','teaching','YÊU TỔ QUỐC, YÊU ĐỒNG BÀO',        '{"icon":"flag","accent":"#C8102E","order":1}', 1),
  ('nam-dieu','teaching','HỌC TẬP TỐT, LAO ĐỘNG TỐT',        '{"icon":"book","accent":"#C08A1E","order":2}', 2),
  ('nam-dieu','teaching','ĐOÀN KẾT TỐT, KỶ LUẬT TỐT',        '{"icon":"people","accent":"#2E7D32","order":3}', 3),
  ('nam-dieu','teaching','GIỮ GÌN VỆ SINH THẬT TỐT',         '{"icon":"hand","accent":"#1565C0","order":4}', 4),
  ('nam-dieu','teaching','KHIÊM TỐN, THẬT THÀ, DŨNG CẢM',    '{"icon":"lotus","accent":"#6A1B9A","order":5}', 5);
