import type { Item, Room } from "@/lib/types";
import { ItemImage, EmptyNote } from "@/components/Media";
import { AddItemSlot, EditControls } from "@/components/ItemEditor";

const CONFIG = {
  roomSlug: "cau-chuyen",
  section: "story",
  heading: "Thêm câu chuyện",
  title: true,
  titleLabel: "Tên câu chuyện",
  body: true,
  bodyLabel: "Nội dung câu chuyện",
  media: "image" as const,
};

export function Room2({
  grouped,
  isAdmin,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
  isAdmin: boolean;
}) {
  const stories = grouped["story"] ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((s) => (
        <article
          key={s.id}
          className="panel group relative flex flex-col overflow-hidden"
        >
          {isAdmin && <EditControls config={CONFIG} item={s} />}
          {s.media_url && (
            <div className="relative aspect-video w-full overflow-hidden">
              <ItemImage item={s} />
            </div>
          )}
          <div className="flex flex-1 flex-col p-4">
            {s.title && (
              <h3 className="mb-1 font-extrabold text-flag-red">{s.title}</h3>
            )}
            {s.body && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#4a2f10]">
                {s.body}
              </p>
            )}
          </div>
        </article>
      ))}

      {isAdmin && (
        <AddItemSlot
          config={{ ...CONFIG, nextOrder: stories.length + 1 }}
          label="Thêm câu chuyện"
          hint="Nhấn để đăng câu chuyện"
        />
      )}

      {!isAdmin && stories.length === 0 && (
        <EmptyNote text="Chưa có câu chuyện nào. Vui lòng quay lại sau." />
      )}
    </div>
  );
}
