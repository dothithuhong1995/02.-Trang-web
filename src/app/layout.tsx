import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";
import { AdminProvider } from "@/components/AdminProvider";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `Không gian Văn hóa Hồ Chí Minh - ${settings.schoolName}`,
      template: `%s | Không gian Văn hóa Hồ Chí Minh`,
    },
    description:
      "Không gian Văn hóa Hồ Chí Minh trực tuyến của " +
      settings.schoolName +
      " - 7 phòng triển lãm về cuộc đời, sự nghiệp và tư tưởng, đạo đức, phong cách Hồ Chí Minh.",
    icons: { icon: "/images/logo-placeholder.svg" },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
