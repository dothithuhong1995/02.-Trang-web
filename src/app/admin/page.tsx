import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getRooms, getSettings } from "@/lib/data";
import { saveSettingsAction, saveRoomAction } from "@/app/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { DeleteRoomButton } from "@/components/admin/DeleteRoomButton";
import { Icon } from "@/components/icons";

export const metadata = { title: "Bảng điều khiển quản trị" };
export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-gold/40 bg-cream/40 px-3 py-2 text-sm outline-none focus:border-flag-red focus:ring-1 focus:ring-flag-red";
const fileInput =
  "w-full rounded-lg border border-gold/40 bg-cream/40 px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-flag-red file:px-3 file:py-1 file:text-white";
const label = "mb-1 block text-xs font-bold uppercase tracking-wide text-[#6a4a1a]";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/dang-nhap");
  const [settings, rooms] = await Promise.all([getSettings(), getRooms()]);

  return (
    <div className="min-h-screen">
      {/* Thanh trên */}
      <div className="bg-flag-darkred text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Icon name="settings" className="h-6 w-6 text-gold-light" />
          <div>
            <h1 className="text-lg font-extrabold">Bảng điều khiển quản trị</h1>
            <p className="text-xs opacity-80">Không gian Văn hóa Hồ Chí Minh</p>
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link href="/" className="underline hover:text-gold-light">
              Xem website
            </Link>
            <Link href="/admin/thung-rac" className="underline hover:text-gold-light">
              Thùng rác
            </Link>
            <Link
              href="/admin/dang-xuat"
              className="rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25"
            >
              Đăng xuất
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Liên kết nhanh */}
        <section>
          <h2 className="mb-3 text-lg font-extrabold text-flag-red">
            Vào phòng để thêm / sửa nội dung
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {rooms.map((r) => (
              <Link
                key={r.slug}
                href={`/phong/${r.slug}`}
                className="flex items-center gap-3 rounded-xl border border-gold/30 bg-white/70 p-3 hover:shadow-card"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                  style={{ backgroundColor: r.accent }}
                >
                  {String(r.index).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold leading-tight text-[#4a2f10]">
                  {r.cardTitle.replace(/\n/g, " ")}
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-2 text-sm text-[#6a4a1a]">
            Mẹo: Khi đã đăng nhập, vào từng phòng bạn sẽ thấy nút{" "}
            <b>“+”</b> để thêm và biểu tượng ✏️ để sửa từng mục.
          </p>
        </section>

        {/* Thông tin chung & giao diện */}
        <section className="panel bg-white/80 p-6">
          <h2 className="mb-4 text-lg font-extrabold text-flag-red">
            Thông tin trường & Giao diện trang chủ
          </h2>
          <ActionForm action={saveSettingsAction} submitLabel="Lưu thông tin" className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className={label}>Tên trường</span>
                <input name="schoolName" defaultValue={settings.schoolName} className={input} />
              </div>
              <div>
                <span className={label}>Địa chỉ / phụ đề</span>
                <input name="schoolSubtitle" defaultValue={settings.schoolSubtitle} className={input} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <span className={label}>Dòng tiêu đề trên (hero)</span>
                <input name="heroTitleTop" defaultValue={settings.heroTitleTop} className={input} />
              </div>
              <div>
                <span className={label}>Tiêu đề chính</span>
                <input name="heroTitleMain" defaultValue={settings.heroTitleMain} className={input} />
              </div>
              <div>
                <span className={label}>Nhãn huy hiệu</span>
                <input name="heroBadge" defaultValue={settings.heroBadge} className={input} />
              </div>
            </div>

            <div>
              <span className={label}>Câu trích dẫn (hero)</span>
              <textarea name="heroQuote" defaultValue={settings.heroQuote} rows={2} className={input} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className={label}>Tác giả trích dẫn</span>
                <input name="heroQuoteAuthor" defaultValue={settings.heroQuoteAuthor} className={input} />
              </div>
              <div>
                <span className={label}>Ghi chú mã QR (chân trang chủ)</span>
                <input name="footerNote" defaultValue={settings.footerNote} className={input} />
              </div>
            </div>
            <div>
              <span className={label}>Khẩu hiệu chân trang</span>
              <textarea name="footerQuote" defaultValue={settings.footerQuote} rows={2} className={input} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <span className={label}>Logo trường</span>
                <div className="mb-2 flex items-center gap-2">
                  <Image src={settings.logoUrl} alt="logo" width={40} height={40} className="h-10 w-10 rounded-full object-contain" />
                  <span className="text-xs text-[#8a6a2a]">Ảnh hiện tại</span>
                </div>
                <input type="file" name="logoFile" accept="image/*" className={fileInput} />
              </div>
              <div>
                <span className={label}>Banner trang chủ (hero)</span>
                <input type="file" name="heroFile" accept="image/*" className={fileInput} />
                <p className="mt-1 text-[11px] text-[#8a6a2a]">Ảnh ngang, ví dụ 1400×390px.</p>
              </div>
              <div>
                <span className={label}>Mã QR</span>
                {settings.qrUrl ? (
                  <Image src={settings.qrUrl} alt="qr" width={40} height={40} className="mb-2 h-10 w-10 object-contain" />
                ) : (
                  <p className="mb-2 text-xs text-[#8a6a2a]">Chưa có</p>
                )}
                <input type="file" name="qrFile" accept="image/*" className={fileInput} />
              </div>
            </div>

          </ActionForm>
        </section>

        {/* Quản lý phòng */}
        <section className="panel bg-white/80 p-6">
          <h2 className="mb-1 text-lg font-extrabold text-flag-red">Quản lý phòng</h2>
          <p className="mb-4 text-sm text-[#6a4a1a]">
            Đổi banner, tên, màu sắc từng phòng. Có thể ẩn/hiện hoặc thêm phòng mới.
          </p>

          <div className="space-y-4">
            {rooms.map((r) => (
              <details key={r.slug} className="rounded-xl border border-gold/30 bg-cream/40">
                <summary className="flex cursor-pointer items-center gap-3 p-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold text-white"
                    style={{ backgroundColor: r.accent }}
                  >
                    {String(r.index).padStart(2, "0")}
                  </span>
                  <span className="font-semibold text-[#4a2f10]">
                    {r.cardTitle.replace(/\n/g, " ")}
                  </span>
                  {!r.enabled && (
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-[11px] text-gray-600">
                      Đang ẩn
                    </span>
                  )}
                </summary>
                <div className="border-t border-gold/30 p-4">
                  <RoomForm room={r} />
                  <div className="mt-3 flex justify-end">
                    <DeleteRoomButton slug={r.slug} name={r.cardTitle.replace(/\n/g, " ")} />
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Thêm phòng mới */}
          <details className="mt-5 rounded-xl border-2 border-dashed border-flag-red/40 bg-white/60">
            <summary className="cursor-pointer p-3 font-bold text-flag-red">
              + Thêm phòng mới
            </summary>
            <div className="border-t border-gold/30 p-4">
              <RoomForm isNew />
            </div>
          </details>
        </section>
      </div>
    </div>
  );
}

function RoomForm({
  room,
  isNew,
}: {
  room?: import("@/lib/types").Room;
  isNew?: boolean;
}) {
  return (
    <ActionForm
      action={saveRoomAction}
      submitLabel={isNew ? "Tạo phòng" : "Lưu phòng"}
      className="space-y-3"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <span className={label}>Mã phòng (slug, không dấu)</span>
          <input
            name="slug"
            defaultValue={room?.slug}
            readOnly={!isNew}
            required
            placeholder="vd: phong-moi"
            className={`${input} ${!isNew ? "bg-gray-100 text-gray-500" : ""}`}
          />
        </div>
        <div>
          <span className={label}>Thứ tự (số)</span>
          <input name="sort_order" type="number" defaultValue={room?.sort_order ?? 8} className={input} />
        </div>
      </div>
      <input type="hidden" name="idx" defaultValue={room?.index ?? 8} />
      <div>
        <span className={label}>Tên trên thẻ trang chủ (xuống dòng bằng Enter)</span>
        <textarea name="card_title" defaultValue={room?.cardTitle} rows={2} className={input} />
      </div>
      <div>
        <span className={label}>Tiêu đề lớn trong phòng</span>
        <textarea name="title" defaultValue={room?.title} rows={2} className={input} />
      </div>
      <div>
        <span className={label}>Mô tả ngắn (phụ đề)</span>
        <textarea name="subtitle" defaultValue={room?.subtitle} rows={2} className={input} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <span className={label}>Màu nhấn</span>
          <input name="accent" type="color" defaultValue={room?.accent ?? "#C8102E"} className="h-10 w-full rounded-lg border border-gold/40" />
        </div>
        <div>
          <span className={label}>Ảnh banner phòng</span>
          <input type="file" name="bannerFile" accept="image/*" className={fileInput} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-[#4a2f10]">
        <input type="checkbox" name="enabled" defaultChecked={room?.enabled ?? true} />
        Hiển thị phòng này
      </label>
    </ActionForm>
  );
}
