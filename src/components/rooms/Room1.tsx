"use client";

import type { Item, Room } from "@/lib/types";
import { useIsAdmin } from "@/components/AdminProvider";
import { SectionHeading } from "@/components/shared";
import { Icon } from "@/components/icons";
import { VideoBox } from "@/components/Media";
import { AddItemSlot, EditControls } from "@/components/ItemEditor";

export function Room1({
  grouped,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
}) {
  const isAdmin = useIsAdmin();
  const timeline = grouped["timeline"] ?? [];
  const journey = grouped["journey"] ?? [];
  const video = (grouped["video"] ?? [])[0];

  return (
    <div className="space-y-6">
      {/* 1. DÒNG THỜI GIAN */}
      <section className="panel p-5 md:p-6">
        <SectionHeading icon="home">1. Dòng thời gian cuộc đời Bác</SectionHeading>
        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:gap-y-8 lg:grid-cols-7 lg:overflow-visible">
          {timeline.map((t) => {
            const year = String((t.meta as Record<string, unknown>)?.year ?? "");
            const icon = String((t.meta as Record<string, unknown>)?.icon ?? "star");
            return (
              <div
                key={t.id}
                className="relative flex min-w-[150px] flex-col items-center text-center lg:min-w-0"
              >
                {isAdmin && (
                  <EditControls
                    config={{
                      roomSlug: "tieu-su",
                      section: "timeline",
                      heading: "Sửa mốc thời gian",
                      year: true,
                      body: true,
                      media: "none",
                    }}
                    item={t}
                  />
                )}
                <span className="text-lg font-extrabold text-flag-red">{year}</span>
                <span className="my-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-flag-red bg-white text-flag-red shadow-soft">
                  <Icon name={icon} className="h-7 w-7" />
                </span>
                <p className="text-xs font-medium leading-snug text-[#4a2f10]">
                  {t.body}
                </p>
              </div>
            );
          })}
          {isAdmin && (
            <div className="flex min-w-[150px] items-center justify-center lg:min-w-0">
              <AddItemSlot
                config={{
                  roomSlug: "tieu-su",
                  section: "timeline",
                  heading: "Thêm mốc thời gian",
                  year: true,
                  body: true,
                  media: "none",
                  nextOrder: timeline.length + 1,
                }}
                className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-gold/60 text-flag-red hover:bg-cream-dark"
                label="Thêm mốc"
              />
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2. HÀNH TRÌNH */}
        <section className="panel p-5 md:p-6">
          <SectionHeading icon="map-pin">2. Hành trình tìm đường cứu nước</SectionHeading>
          <ol className="space-y-2.5">
            {journey.map((j, i) => (
              <li key={j.id} className="group flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-flag-red text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-[#4a2f10]">{j.body}</span>
                {isAdmin && (
                  <span className="relative ml-auto">
                    <EditControls
                      config={{
                        roomSlug: "tieu-su",
                        section: "journey",
                        heading: "Sửa điểm đến",
                        body: true,
                        media: "none",
                      }}
                      item={j}
                    />
                  </span>
                )}
              </li>
            ))}
          </ol>
          {isAdmin && (
            <div className="mt-4">
              <AddItemSlot
                config={{
                  roomSlug: "tieu-su",
                  section: "journey",
                  heading: "Thêm điểm đến",
                  body: true,
                  media: "none",
                  nextOrder: journey.length + 1,
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/60 py-3 text-sm font-bold text-flag-red hover:bg-cream-dark"
                label="Thêm điểm đến"
              />
            </div>
          )}
        </section>

        {/* 3. VIDEO */}
        <section className="panel p-5 md:p-6">
          <SectionHeading icon="play">3. Video giới thiệu</SectionHeading>
          <div className="relative">
            {isAdmin && video && (
              <EditControls
                config={{
                  roomSlug: "tieu-su",
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
            <div className="mt-4">
              <AddItemSlot
                config={{
                  roomSlug: "tieu-su",
                  section: "video",
                  heading: "Thêm video giới thiệu",
                  title: true,
                  media: "video",
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/60 py-3 text-sm font-bold text-flag-red hover:bg-cream-dark"
                label="Thêm video (YouTube hoặc tải lên)"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
