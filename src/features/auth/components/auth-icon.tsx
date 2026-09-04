type InterestIconName =
  | "natureza"
  | "cultura"
  | "gastronomia"
  | "familia"
  | "romance"
  | "economia"
  | "sozinho"
  | "casal"
  | "google"
  | "arrow"
  | "check"
  | "calendar";

type IconProps = {
  name: InterestIconName;
  className?: string;
};

export function AuthIcon({ name, className = "h-5 w-5" }: IconProps) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "natureza":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.5 3.5 4 6.5 4 9a4 4 0 11-8 0c0-2.5 1.5-5.5 4-9z"
          />
          <path strokeLinecap="round" d="M12 12v9" />
        </svg>
      );
    case "cultura":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5"
          />
        </svg>
      );
    case "gastronomia":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 3v7a2 2 0 002 2h0a2 2 0 002-2V3M10 12v9M16 3v18M16 3c1.5 2 2 4 2 6s-.5 3-2 4"
          />
        </svg>
      );
    case "familia":
      return (
        <svg {...common}>
          <circle cx="8" cy="7" r="2.5" />
          <circle cx="16" cy="7" r="2.5" />
          <circle cx="12" cy="14" r="2" />
          <path
            strokeLinecap="round"
            d="M3.5 20c.5-2.5 2.5-4 4.5-4s3.2 1 4 2.5c.8-1.5 2-2.5 4-2.5s4 1.5 4.5 4"
          />
        </svg>
      );
    case "romance":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"
          />
        </svg>
      );
    case "economia":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18M8 7h5.5a2.5 2.5 0 010 5H9a2.5 2.5 0 000 5h6"
          />
        </svg>
      );
    case "sozinho":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3" />
          <path strokeLinecap="round" d="M5 20c1-3.5 3.5-5 7-5s6 1.5 7 5" />
        </svg>
      );
    case "casal":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20s-6-4-6-9a3.5 3.5 0 016-2 3.5 3.5 0 016 2c0 5-6 9-6 9z"
          />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M13 6l6 6-6 6"
          />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path strokeLinecap="round" d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "google":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#EA4335"
            d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.7 14.5 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.8H12z"
          />
        </svg>
      );
    default:
      return null;
  }
}
