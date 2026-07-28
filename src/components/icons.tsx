import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { name: string };

/** Bộ icon dạng nét, dùng currentColor để dễ đổi màu. */
export function Icon({ name, ...props }: IconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      );
    case "boat":
      return (
        <svg {...common}>
          <path d="M3 17h18l-2 4H5l-2-4Z" />
          <path d="M12 3v10" />
          <path d="M12 5l6 6H6l6-6Z" />
        </svg>
      );
    case "ship":
      return (
        <svg {...common}>
          <path d="M3 15l1.5 4.5a2 2 0 0 0 1.9 1.5h11.2a2 2 0 0 0 1.9-1.5L21 15" />
          <path d="M5 15V9h14v6" />
          <path d="M9 9V5h6v4" />
          <path d="M12 2v3" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M12 6c-2-1.5-5-1.5-7 0v12c2-1.5 5-1.5 7 0 2-1.5 5-1.5 7 0V6c-2-1.5-5-1.5-7 0Z" />
          <path d="M12 6v12" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V4" />
          <path d="M5 4c3-1.5 6 1.5 9 0s5-1 5-1v9s-2 .5-5 2-6-1.5-9 0" />
        </svg>
      );
    case "star":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z" />
        </svg>
      );
    case "lotus":
      return (
        <svg {...common}>
          <path d="M12 4c1.5 2 1.5 5 0 8-1.5-3-1.5-6 0-8Z" />
          <path d="M12 12c2-2 5-2.5 8-2-.5 3-3 5-8 6-5-1-7.5-3-8-6 3-.5 6 0 8 2Z" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="8" cy="9" r="2.2" />
          <circle cx="16" cy="9" r="2.2" />
          <path d="M4 19c0-2.5 2-4 4-4s4 1.5 4 4" />
          <path d="M12 19c0-2.5 2-4 4-4s4 1.5 4 4" />
        </svg>
      );
    case "hand":
      return (
        <svg {...common}>
          <path d="M7 12V6.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M10 11V5.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M13 11V6.5a1.5 1.5 0 0 1 3 0V13" />
          <path d="M16 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4.5 15a1.6 1.6 0 0 1 2.6-1.8L8 14" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
      );
    case "play":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M8 5v14l11-7L8 5Z" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "map-pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="13" r="3.2" />
        </svg>
      );
    case "diary":
      return (
        <svg {...common}>
          <path d="M6 3h11a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-4 3V5Z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m4 18 5-5 4 4 3-3 4 4" />
        </svg>
      );
    case "comic":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M12 4v16M3 12h9" />
        </svg>
      );
    case "music":
      return (
        <svg {...common}>
          <path d="M9 18V5l10-2v13" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="16" r="2" />
        </svg>
      );
    case "feather":
      return (
        <svg {...common}>
          <path d="M20 4c-6 0-11 4-11 10v4l-4 2" />
          <path d="M20 4c0 6-4 11-10 11H5" />
          <path d="M14 8 8 14" />
        </svg>
      );
    case "teacher":
      return (
        <svg {...common}>
          <circle cx="9" cy="6" r="2.4" />
          <path d="M5 20v-2a4 4 0 0 1 4-4" />
          <rect x="12" y="9" width="9" height="7" rx="1" />
          <path d="M16.5 16v3" />
        </svg>
      );
    case "folder":
      return (
        <svg {...common}>
          <path d="M4 6h6l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3" />
          <path d="M10 12H3M6 8l-3 4 3 4" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
