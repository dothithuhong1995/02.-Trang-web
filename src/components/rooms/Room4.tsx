import type { Item, Room } from "@/lib/types";
import { SectionHeading } from "@/components/shared";
import { ItemImage, VideoBox, EmptyNote } from "@/components/Media";
import { Icon } from "@/components/icons";
import { AddItemSlot, EditControls } from "@/components/ItemEditor";

const PLACE = {
  roomSlug: "bac-voi-tphcm",
  section: "place",
  heading: "Thêm địa điểm",
  title: true,
  titleLabel: "Tên địa điểm",
  body: true,
  bodyLabel: "Mô tả",
  media: "image" as const,
};

const DEFAULT_QUOTE =
  "Bác Hồ luôn dành tình cảm đặc biệt cho đồng bào miền Nam, cho Sài Gòn – Gia Định – Chợ Lớn và toàn thể nhân dân.";

export function Room4({
  grouped,
  isAdmin,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
  isAdmin: boolean;
}) {
  const places = grouped["place"] ?? [];
  const video = (grouped["video"] ?? [])[0];
  const quote = (grouped["quote"] ?? [])[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Địa điểm */}
      <section className="panel p-5 md:p-6 lg:col-span-2">
        <SectionHeading icon="map-pin">
          1. Những dấu ấn của Bác Hồ tại Thành phố Hồ Chí Minh
        </SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {places.map((p) => (
            <article
              key={p.id}
              className="relative flex flex-col overflow-hidden rounded-xl bg-white/80 shadow-soft ring-1 ring-gold/20"
            >
              {isAdmin && <EditControls config={PLACE} item={p} />}
              <div className="relative aspect-square w-full overflow-hidden bg-cream">
                {p.media_url ? (
                  <ItemImage item={p} />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-flag-red/60">
                    <Icon name="map-pin" className="h-8 w-8" />
                  </span>
                )}
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-bold uppercase text-flag-red">
                  {p.title}
                </p>
                {p.body && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-[#6a4a1a]">
                    {p.body}
                  </p>
                )}
              </div>
            </article>
          ))}
          {isAdmin && (
            <AddItemSlot
              config={{ ...PLACE, nextOrder: places.length + 1 }}
              className="upload-slot aspect-square"
              label="Thêm địa điểm"
              hint="Nhấp để thêm hình ảnh và nội dung"
            />
          )}
          {!isAdmin && places.length === 0 && (
            <EmptyNote text="Chưa có địa điểm nào." />
          )}
        </div>
      </section>

      {/* Video + trích dẫn */}
      <section className="space-y-4">
        <div className="panel p-5">
          <SectionHeading icon="play">2. Video giới thiệu</SectionHeading>
          <div className="relative">
            {isAdmin && video && (
              <EditControls
                config={{
                  roomSlug: "bac-voi-tphcm",
                  section: "video",
                  heading: "Sửa video",
                  title: true,
                  media: "video",
                }}
                item={video}
              />
            )}
            <VideoBox item={video} />
          </div>
          {isAdmin && !video && (
            <div className="mt-3">
              <AddItemSlot
                config={{
                  roomSlug: "bac-voi-tphcm",
                  section: "video",
                  heading: "Thêm video giới thiệu",
                  title: true,
                  media: "video",
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/60 py-3 text-sm font-bold text-flag-red hover:bg-cream-dark"
                label="Thêm video"
              />
            </div>
          )}
        </div>

        <div className="panel relative p-5 text-center">
          {isAdmin && quote && (
            <EditControls
              config={{
                roomSlug: "bac-voi-tphcm",
                section: "quote",
                heading: "Sửa trích dẫn",
                body: true,
                media: "none",
              }}
              item={quote}
            />
          )}
          <span className="text-3xl text-gold">“</span>
          <p className="text-sm font-semibold italic text-flag-darkred">
            {quote?.body ?? DEFAULT_QUOTE}
          </p>
          {isAdmin && !quote && (
            <div className="mt-3">
              <AddItemSlot
                config={{
                  roomSlug: "bac-voi-tphcm",
                  section: "quote",
                  heading: "Thêm trích dẫn",
                  body: true,
                  media: "none",
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gold/60 py-2 text-xs font-bold text-flag-red hover:bg-cream-dark"
                label="Sửa trích dẫn"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
