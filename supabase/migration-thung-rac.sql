-- =====================================================================
--  NÂNG CẤP: Thêm chức năng "Thùng rác" (xóa mềm)
--  Chạy 1 lần trong: Supabase Dashboard > SQL Editor
-- =====================================================================

-- Thêm cột đánh dấu thời điểm xóa (NULL = đang hiển thị; có giá trị = trong thùng rác)
alter table public.items
  add column if not exists deleted_at timestamptz;

create index if not exists items_deleted_idx on public.items (deleted_at);
