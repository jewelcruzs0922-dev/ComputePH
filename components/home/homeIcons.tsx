type IconProps = { className?: string };

function base(className?: string) {
  return {
    className: className ?? "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

export function CalculatorIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h4" />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 12.5V4h8.5L21 13.5 13.5 21 3 12.5z" />
      <circle cx="8" cy="8.5" r="1.4" />
    </svg>
  );
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
    </svg>
  );
}

export function BankIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 9l9-5 9 5" />
      <path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18" />
    </svg>
  );
}

export function CoinsIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <ellipse cx="12" cy="6.5" rx="7.5" ry="3" />
      <path d="M4.5 6.5v11c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-11" />
      <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function BulbIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 1 3.5 10.8c-.6.5-.9 1.1-.9 1.7v.5h-5.2v-.5c0-.6-.3-1.2-.9-1.7A6 6 0 0 1 12 3z" />
    </svg>
  );
}

export function DocIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 20.5 4.7 13.2a4.9 4.9 0 0 1 0-7 4.9 4.9 0 0 1 7 0l.3.3.3-.3a4.9 4.9 0 0 1 7 0 4.9 4.9 0 0 1 0 7L12 20.5z" />
    </svg>
  );
}

export function HouseIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V21h12V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}
