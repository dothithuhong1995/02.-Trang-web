# 🌐 HƯỚNG DẪN TRIỂN KHAI & SỬ DỤNG WEBSITE

# "Không gian Văn hóa Hồ Chí Minh"

Tài liệu này hướng dẫn **từng bước** để đưa website lên mạng (miễn phí) và sử dụng.
Bạn **không cần biết lập trình** — chỉ cần làm theo đúng thứ tự.

> ⏱️ Thời gian dự kiến: khoảng **30–45 phút** cho lần đầu.
> 💰 Chi phí: **0 đồng** (dùng gói miễn phí của Supabase và Vercel).

Website gồm 3 "mảnh ghép":

| Thành phần | Vai trò | Miễn phí? |
|---|---|---|
| **Mã nguồn** (thư mục này) | Giao diện & chức năng website | ✅ |
| **Supabase** | Lưu dữ liệu: bài viết, ảnh, video, tài khoản | ✅ (gói Free) |
| **Vercel** | "Máy chủ" chạy website, cho ra địa chỉ web | ✅ (gói Hobby) |

---

# PHẦN A — ĐƯA WEBSITE LÊN MẠNG

## Bước 0. Tạo 3 tài khoản (nếu chưa có)

Vào từng trang sau, bấm **Sign up** và đăng ký (nên dùng đăng nhập bằng Google cho nhanh):

1. **GitHub** — https://github.com (nơi lưu mã nguồn)
2. **Supabase** — https://supabase.com (cơ sở dữ liệu)
3. **Vercel** — https://vercel.com (chạy website)

> ℹ️ Tôi (trợ lý AI) **không thể tự tạo tài khoản thay bạn** vì cần email và mật khẩu của bạn. Bạn tự đăng ký ở bước này nhé.

---

## Bước 1. Tạo dự án Supabase

1. Đăng nhập https://supabase.com → bấm **New project**.
2. Điền:
   - **Name**: `khong-gian-van-hoa` (tùy ý)
   - **Database Password**: đặt một mật khẩu mạnh và **lưu lại** (phòng khi cần).
   - **Region**: chọn **Southeast Asia (Singapore)** cho gần Việt Nam.
3. Bấm **Create new project** và đợi 1–2 phút cho Supabase khởi tạo.

---

## Bước 2. Tạo cơ sở dữ liệu (chạy file SQL)

1. Trong dự án Supabase, ở menu bên trái chọn **SQL Editor**.
2. Bấm **+ New query**.
3. Mở tệp **`supabase/schema.sql`** trong thư mục mã nguồn này bằng Notepad (hoặc VS Code), **chọn tất cả (Ctrl+A) → sao chép (Ctrl+C)**.
4. **Dán (Ctrl+V)** toàn bộ vào ô SQL Editor của Supabase.
5. Bấm nút **Run** (hoặc Ctrl+Enter).
6. Thấy dòng **"Success. No rows returned"** là đã xong ✅

Việc này tạo sẵn: các bảng dữ liệu, 7 phòng, nội dung điền sẵn (dòng thời gian, 5 Điều Bác Hồ dạy...) và kho lưu ảnh/video.

---

## Bước 3. Tạo tài khoản Quản trị (Admin)

1. Menu bên trái Supabase → **Authentication** → **Users**.
2. Bấm **Add user** → **Create new user**.
3. Nhập:
   - **Email**: email bạn muốn dùng để đăng nhập quản trị (ví dụ `admin@truong.edu.vn`).
   - **Password**: mật khẩu đăng nhập (ghi nhớ kỹ).
   - ✅ Tích chọn **Auto Confirm User** (để không cần xác minh email).
4. Bấm **Create user**.

> 🔑 Đây chính là tài khoản bạn sẽ dùng để đăng nhập vào website và đăng nội dung.

---

## Bước 4. Lấy 3 "chìa khóa" kết nối (API keys)

1. Menu bên trái Supabase → **Project Settings** (biểu tượng bánh răng) → **API**.
2. Ghi lại 3 giá trị sau (sẽ dán vào Vercel ở Bước 6):

| Tên trong Vercel | Lấy ở đâu trong Supabase |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Mục **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Mục **Project API keys → `anon` `public`** |
| `SUPABASE_SERVICE_ROLE_KEY` | Mục **Project API keys → `service_role`** (bấm *Reveal* để hiện) |

> ⚠️ **Giữ bí mật** `service_role`. Không gửi cho ai, không đăng lên mạng.

---

## Bước 5. Đưa mã nguồn lên GitHub

**Cách dễ nhất (dùng GitHub Desktop — có giao diện, không cần gõ lệnh):**

1. Tải và cài **GitHub Desktop**: https://desktop.github.com
2. Mở GitHub Desktop → **File → Add local repository** → chọn thư mục mã nguồn này.
3. Nếu báo "chưa phải repository", bấm **Create a repository** → **Create repository**.
4. Bấm **Publish repository**.
   - **Bỏ tích** "Keep this code private" nếu muốn công khai, hoặc để nguyên (riêng tư) — đều được.
5. Xong! Mã nguồn đã ở trên GitHub.

> 💡 Tệp `.gitignore` đã được cấu hình để **không** đẩy `node_modules` và các khóa bí mật lên mạng.

---

## Bước 6. Deploy lên Vercel

1. Đăng nhập https://vercel.com → bấm **Add New… → Project**.
2. Bấm **Import** dòng chứa kho GitHub bạn vừa tạo (ví dụ `khong-gian-van-hoa`).
   - Lần đầu Vercel sẽ xin quyền truy cập GitHub — bấm **Install / Authorize**.
3. Ở phần **Environment Variables**, thêm **4 biến** sau (bấm *Add* từng dòng):

   | Name (Key) | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | *dán Project URL từ Bước 4* |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *dán anon public key* |
   | `SUPABASE_SERVICE_ROLE_KEY` | *dán service_role key* |
   | `NEXT_PUBLIC_ADMIN_EMAIL` | *email Admin bạn tạo ở Bước 3* |

4. Bấm **Deploy** và đợi 1–3 phút.
5. Khi hiện **Congratulations** 🎉, bấm vào ảnh xem trước hoặc nút **Visit** để mở website.

Địa chỉ web của bạn sẽ dạng: `https://ten-du-an.vercel.app`

> 🔁 **Sau này muốn sửa giao diện/mã nguồn?** Chỉ cần sửa rồi bấm **Push** trong GitHub Desktop — Vercel sẽ tự động cập nhật lại website. Còn **thay đổi nội dung, ảnh, banner** thì làm ngay trên website (Phần B), **không cần** đụng tới đây.

---

## Bước 7. Đăng nhập quản trị

1. Mở website của bạn, kéo xuống chân trang → bấm **"Đăng nhập quản trị"**
   (hoặc vào thẳng `https://ten-du-an.vercel.app/admin/dang-nhap`).
2. Nhập **email và mật khẩu Admin** (tạo ở Bước 3) → **Đăng nhập**.
3. Vào **Bảng điều khiển** để chỉnh thông tin trường, hoặc vào từng phòng để thêm nội dung.

✅ **Hoàn tất!** Website đã sẵn sàng dùng nhiều năm.

---

# PHẦN B — SỬ DỤNG HÀNG NGÀY (dành cho Admin)

Sau khi **đăng nhập**, bạn sẽ thấy thanh đỏ *"● Chế độ Quản trị"* ở trên cùng.

### ➕ Thêm nội dung vào một phòng
- Vào phòng bất kỳ (vd: *Những câu chuyện về Bác*).
- Bấm ô có dấu **“+”** (vd *"Thêm câu chuyện"*).
- Điền tiêu đề, nội dung, chọn ảnh/video → **Lưu**.

### ✏️ Sửa / 🗑️ Xóa một mục
- Di chuột vào mục cần sửa → bấm biểu tượng **✏️ (sửa)** hoặc **🗑️ (xóa)** ở góc.

### 🎞️ Thêm video
- Trong ô video: **dán link YouTube** (khuyến nghị, nhẹ và nhanh) **hoặc** tải tệp video lên.

### 🖼️ Đổi banner, logo, thông tin trường
- Vào **Bảng điều khiển** (nút ở thanh đỏ) → phần *"Thông tin trường & Giao diện"*.
- Tải logo/banner mới, sửa tên trường, câu trích dẫn... → **Lưu thông tin**.

### 🏛️ Thêm / ẩn / xóa phòng
- **Bảng điều khiển** → *"Quản lý phòng"*.
- Mở một phòng để đổi tên, màu, banner; hoặc bấm **“+ Thêm phòng mới”**.

### 👀 Khách tham quan (học sinh, phụ huynh)
- **Không cần đăng nhập.** Chỉ cần mở địa chỉ web là xem được mọi phòng, tìm kiếm và tải tài liệu.

---

# PHẦN C — CHẠY THỬ TRÊN MÁY TÍNH (không bắt buộc)

Nếu muốn xem thử trên máy trước khi đưa lên mạng:

1. Cài **Node.js** (bản LTS): https://nodejs.org
2. Mở **Command Prompt / PowerShell** tại thư mục này, gõ:
   ```bash
   npm install
   npm run dev
   ```
3. Mở trình duyệt vào `http://localhost:3000`.

> Khi chưa điền khóa Supabase, website chạy ở **chế độ xem thử**: hiển thị đầy đủ giao diện và nội dung mẫu, nhưng **chưa** đăng nhập/đăng nội dung được. Muốn đầy đủ chức năng, tạo tệp `.env.local` (sao chép từ `.env.example`) và điền 4 khóa như Bước 4 & 6.

---

# PHẦN D — BẢO TRÌ & XỬ LÝ SỰ CỐ

**Chi phí:** Gói miễn phí Supabase cho ~500MB cơ sở dữ liệu và 1GB lưu ảnh/tệp — đủ cho nhiều năm nếu **ưu tiên dán link YouTube** cho video (không tốn dung lượng).

**Sao lưu:** Supabase → *Database → Backups* có bản sao lưu tự động hằng ngày (gói Free giữ trong thời gian giới hạn).

**Một số sự cố thường gặp:**

| Hiện tượng | Cách xử lý |
|---|---|
| Đăng nhập báo sai mật khẩu | Kiểm tra đã tạo user ở Bước 3 và tích *Auto Confirm*. Có thể *Reset password* trong Supabase → Authentication. |
| Ảnh tải lên không hiện | Kiểm tra đã chạy đủ file `schema.sql` (tạo kho "media"). Chạy lại file đó cũng không sao. |
| Website lỗi sau khi deploy | Vào Vercel → *Settings → Environment Variables* kiểm tra đủ 4 biến, đúng chính tả, rồi *Redeploy*. |
| Quên địa chỉ web | Xem trong Vercel → dự án của bạn → *Domains*. |

---

📌 **Tóm tắt siêu ngắn:** Supabase (chạy `schema.sql` + tạo user) → GitHub (đẩy mã nguồn) → Vercel (import + 4 biến môi trường + Deploy) → Đăng nhập `/admin/dang-nhap` → Thêm nội dung.

Chúc nhà trường có một Không gian Văn hóa Hồ Chí Minh thật đẹp và ý nghĩa! 🌸
