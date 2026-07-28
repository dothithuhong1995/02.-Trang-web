import type { Item, Room } from "@/lib/types";
import { SectionHeading } from "@/components/shared";
import { ItemImage, MediaTile, EmptyNote } from "@/components/Media";
import { Icon } from "@/components/icons";
import { AddItemSlot, EditControls } from "@/components/ItemEditor";

const PHOTO = {
  roomSlug: "lam-theo-loi-bac",
  section: "good_deed_photo",
  heading: "Thêm ảnh việc tốt",
  body: true,
  bodyLabel: "Chú thích (không bắt buộc)",
  media: "image" as const,
};
const DIARY = {
  roomSlug: "lam-theo-loi-bac",
  section: "diary",
  heading: "Thêm nhật ký việc tốt",
  title: true,
  titleLabel: "Tiêu đề",
  body: true,
  bodyLabel: "Nội dung nhật ký",
  media: "none" as const,
};
const STORY = {
  roomSlug: "lam-theo-loi-bac",
  section: "story_media",
  heading: "Thêm câu chuyện (ảnh/video)",
  title: true,
  body: true,
  media: "any" as const,
};

export function Room5({
  grouped,
  isAdmin,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
  isAdmin: boolean;
}) {
  const photos = grouped["good_deed_photo"] ?? [];
  const diary = grouped["diary"] ?? [];
  const stories = grouped["story_media"] ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. ẢNH VIỆC TỐT */}
        <section className="panel p-5">
          <SectionHeading icon="camera" color="#C8102E">
            1. Ảnh việc tốt
          </SectionHeading>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((p) => (
              <figure
                key={p.id}
                className="relative aspect-square overflow-hidden rounded-xl bg-cream ring-1 ring-gold/20"
              >
                {isAdmin && <EditControls config={PHOTO} item={p} />}
                <ItemImage item={p} />
              </figure>
            ))}
            {isAdmin && (
              <AddItemSlot
                config={{ ...PHOTO, nextOrder: photos.length + 1 }}
                className="upload-slot aspect-square"
                label="Thêm ảnh"
              />
            )}
            {!isAdmin && photos.length === 0 && (
              <EmptyNote text="Chưa có ảnh." />
            )}
          </div>
        </section>

        {/* 2. NHẬT KÝ VIỆC TỐT */}
        <section className="panel p-5">
          <SectionHeading icon="diary" color="#2E7D32">
            2. Nhật ký việc tốt
          </SectionHeading>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {diary.map((d) => (
              <article
                key={d.id}
                className="relative rounded-xl border-t-4 border-green-700 bg-green-50/60 p-3 shadow-soft"
              >
                {isAdmin && <EditControls config={DIARY} item={d} />}
                <Icon name="diary" className="mb-1 h-5 w-5 text-green-700" />
                {d.title && (
                  <h4 className="text-sm font-bold text-green-900">{d.title}</h4>
                )}
                {d.body && (
                  <p className="mt-1 line-clamp-4 text-xs text-[#3a4a2a]">
                    {d.body}
                  </p>
                )}
              </article>
            ))}
            {isAdmin && (
              <AddItemSlot
                config={{ ...DIARY, nextOrder: diary.length + 1 }}
                className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-green-700/40 bg-green-50/40 text-green-800 hover:bg-green-50"
                label="Thêm nhật ký"
              />
            )}
            {!isAdmin && diary.length === 0 && (
              <EmptyNote text="Chưa có nhật ký." />
            )}
          </div>
          <p className="mt-3 text-center text-sm font-semibold italic text-green-800">
            “Việc nhỏ mỗi ngày – Ý nghĩa lớn mai sau”
          </p>
        </section>
      </div>

      {/* 3. KỂ CHUYỆN THEO GƯƠNG BÁC */}
      <section className="panel p-5">
        <SectionHeading icon="chat" color="#1565C0">
          3. Kể chuyện theo gương Bác
        </SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stories.map((s) => (
            <article
              key={s.id}
              className="relative flex flex-col overflow-hidden rounded-xl bg-white/80 shadow-soft ring-1 ring-gold/20"
            >
              {isAdmin && <EditControls config={STORY} item={s} />}
              <div className="relative aspect-square w-full overflow-hidden bg-cream">
                <MediaTile item={s} />
              </div>
              {s.title && (
                <p className="p-2 text-center text-xs font-semibold text-[#4a2f10]">
                  {s.title}
                </p>
              )}
            </article>
          ))}
          {isAdmin && (
            <AddItemSlot
              config={{ ...STORY, nextOrder: stories.length + 1 }}
              className="upload-slot aspect-square"
              label="Thêm ảnh hoặc video"
            />
          )}
          {!isAdmin && stories.length === 0 && (
            <EmptyNote text="Chưa có câu chuyện." />
          )}
        </div>
      </section>
    </div>
  );
}
