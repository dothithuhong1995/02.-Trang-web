import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bảng màu chủ đạo: đỏ cờ - vàng kim - nền kem
        flag: {
          red: "#C8102E",
          darkred: "#A00C24",
          deepred: "#7A0A1C",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8C86A",
          dark: "#B8941F",
        },
        cream: {
          DEFAULT: "#FBF3E4",
          dark: "#F3E6CC",
          deep: "#EAD9B8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(122, 10, 28, 0.35)",
        soft: "0 4px 20px -8px rgba(0,0,0,0.25)",
      },
      backgroundImage: {
        "cream-texture":
          "radial-gradient(circle at 20% 20%, rgba(212,175,55,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(200,16,46,0.06), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
