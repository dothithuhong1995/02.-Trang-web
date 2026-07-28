# Không gian Văn hóa Hồ Chí Minh

Website triển lãm số cho **Trường Tiểu học Nguyễn Viết Xuân** — Trang chủ + 7 phòng triển lãm,
có hệ quản trị nội dung (CMS): upload ảnh/video, đổi banner/logo, thêm/sửa/xóa nội dung, quản lý phòng.

> 👉 **Người dùng nhà trường:** xem hướng dẫn đưa web lên mạng & sử dụng tại **[HUONG-DAN-TRIEN-KHAI.md](./HUONG-DAN-TRIEN-KHAI.md)**.

## Công nghệ
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** cho giao diện
- **Supabase** (PostgreSQL + Storage + Auth) làm backend/CMS
- Triển khai trên **Vercel**

## Chạy ở máy (development)
```bash
npm install
npm run dev        # http://localhost:3000
```
Chưa cấu hình Supabase → chạy ở **chế độ xem thử** với dữ liệu mẫu (không đăng nhập/ghi được).
Cấu hình đầy đủ: sao chép `.env.example` thành `.env.local` và điền khóa Supabase.

## Biến môi trường
| Biến | Ý nghĩa |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL dự án Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Khóa công khai (đọc dữ liệu) |
| `SUPABASE_SERVICE_ROLE_KEY` | Khóa máy chủ (ghi dữ liệu, upload) — **bí mật** |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Email tài khoản Admin |

## Cấu trúc thư mục
```
src/
  app/                 # Trang: /, /phong/[slug], /admin, /tim-kiem, actions.ts
  components/          # Header, thẻ phòng, trình soạn thảo, 7 phòng (rooms/)
  lib/                 # data.ts, seed.ts, types.ts, auth.ts, supabase/
public/images/         # Banner 7 phòng + hero + logo (Admin thay được qua CMS)
supabase/schema.sql    # Tạo bảng, RLS, storage, dữ liệu điền sẵn
```

## Cơ sở dữ liệu
- `settings` — cấu hình chung (khóa/giá trị)
- `rooms` — các phòng triển lãm
- `items` — mọi mục nội dung (phân theo `room_slug` + `section`)

Xem chi tiết và dữ liệu mẫu trong [`supabase/schema.sql`](./supabase/schema.sql).

## Phân quyền (hiện tại)
- **Admin**: đăng nhập → toàn quyền thêm/sửa/xóa nội dung, đổi giao diện, quản lý phòng.
- **Khách**: xem, tìm kiếm, tải tài liệu — không cần đăng nhập.

> Vai trò **Biên tập viên (giáo viên)** đã có sẵn cấu trúc để mở rộng: tạo thêm user trong
> Supabase và bỏ trống `NEXT_PUBLIC_ADMIN_EMAIL` để mọi tài khoản đăng nhập đều biên tập được,
> hoặc bổ sung bảng phân quyền theo nhu cầu.
