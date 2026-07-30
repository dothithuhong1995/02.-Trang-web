import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getItemsGrouped, getRoom } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { RoomBanner } from "@/components/Media";
import { HomeButton } from "@/components/shared";
import { AdminBar } from "@/components/AdminBar";
import { Room1 } from "@/components/rooms/Room1";
import { Room2 } from "@/components/rooms/Room2";
import { Room3 } from "@/components/rooms/Room3";
import { Room4 } from "@/components/rooms/Room4";
import { Room5 } from "@/components/rooms/Room5";
import { Room6 } from "@/components/rooms/Room6";
import { Room7 } from "@/components/rooms/Room7";
import type { Item, Room } from "@/lib/types";

// Dựng động theo từng request để nút thêm/sửa (chỉ hiện khi Admin đăng nhập)
// luôn xuất hiện đúng theo phiên hiện tại.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) return { title: "Không tìm thấy phòng" };
  return { title: room.title.replace(/\n/g, " ") };
}

const ROOM_COMPONENTS: Record<
  string,
  (props: {
    room: Room;
    grouped: Record<string, Item[]>;
    isAdmin: boolean;
  }) => React.ReactNode
> = {
  "tieu-su": Room1,
  "cau-chuyen": Room2,
  "nam-dieu": Room3,
  "bac-voi-tphcm": Room4,
  "lam-theo-loi-bac": Room5,
  "cb-gv-nv": Room6,
  "thu-vien-so": Room7,
};

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [room, grouped, admin] = await Promise.all([
    getRoom(slug),
    getItemsGrouped(slug),
    isAdmin(),
  ]);

  if (!room) notFound();

  const Content = ROOM_COMPONENTS[slug];

  return (
    <>
      <AdminBar isAdmin={admin} />
      <RoomBanner src={room.bannerUrl} alt={room.title.replace(/\n/g, " ")} />

      <main className="mx-auto max-w-7xl px-3 py-6">
        {Content ? (
          <Content room={room} grouped={grouped} isAdmin={admin} />
        ) : (
          <GenericRoom room={room} grouped={grouped} isAdmin={admin} />
        )}
        <HomeButton />
      </main>
    </>
  );
}

/** Bố cục mặc định cho phòng do Admin tự thêm (chưa có bố cục riêng). */
function GenericRoom({
  grouped,
  isAdmin: admin,
}: {
  room: Room;
  grouped: Record<string, Item[]>;
  isAdmin: boolean;
}) {
  const items = grouped["display"] ?? [];
  return (
    <section className="panel p-6">
      <p className="text-sm text-[#6a4a1a]">
        {items.length === 0
          ? "Nội dung đang được cập nhật."
          : `${items.length} mục nội dung.`}
      </p>
    </section>
  );
}
