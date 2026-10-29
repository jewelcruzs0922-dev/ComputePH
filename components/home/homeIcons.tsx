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

function detailedBase(className?: string) {
  return {
    className: className ?? "h-5 w-5",
    viewBox: "0 0 256 256",
    fill: "currentColor",
    "aria-hidden": true,
  };
}

export function DetailedBriefcaseIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path
        d="M224 118.31V200a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-81.69A191.14 191.14 0 0 0 128 144a191.1 191.1 0 0 0 96-25.69"
        opacity=".2"
      />
      <path d="M104 112a8 8 0 0 1 8-8h32a8 8 0 0 1 0 16h-32a8 8 0 0 1-8-8m128-40v128a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V72a16 16 0 0 1 16-16h40v-8a24 24 0 0 1 24-24h48a24 24 0 0 1 24 24v8h40a16 16 0 0 1 16 16M96 56h64v-8a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8ZM40 72v41.62A184.1 184.1 0 0 0 128 136a184 184 0 0 0 88-22.39V72Zm176 128v-68.37A200.25 200.25 0 0 1 128 152a200.2 200.2 0 0 1-88-20.36V200z" />
    </svg>
  );
}

export function DetailedBankIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path d="M232 96H24l104-64Z" opacity=".2" />
      <path d="M24 104h24v64H32a8 8 0 0 0 0 16h192a8 8 0 0 0 0-16h-16v-64h24a8 8 0 0 0 4.19-14.81l-104-64a8 8 0 0 0-8.38 0l-104 64A8 8 0 0 0 24 104m40 0h32v64H64Zm80 0v64h-32v-64Zm48 64h-32v-64h32ZM128 41.39L203.74 88H52.26ZM248 208a8 8 0 0 1-8 8H16a8 8 0 0 1 0-16h224a8 8 0 0 1 8 8" />
    </svg>
  );
}

export function DetailedCoinsIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path
        d="M240 132c0 19.88-35.82 36-80 36c-19.6 0-37.56-3.17-51.47-8.44C146.76 156.85 176 142 176 124V96.72c36.52 3.34 64 17.86 64 35.28m-64-48c0-19.88-35.82-36-80-36S16 64.12 16 84s35.82 36 80 36s80-16.12 80-36"
        opacity=".2"
      />
      <path d="M184 89.57V84c0-25.08-37.83-44-88-44S8 58.92 8 84v40c0 20.89 26.25 37.49 64 42.46V172c0 25.08 37.83 44 88 44s88-18.92 88-44v-40c0-20.7-25.42-37.32-64-42.43M232 132c0 13.22-30.79 28-72 28c-3.73 0-7.43-.13-11.08-.37C170.49 151.77 184 139 184 124v-18.26c29.87 4.45 48 16.53 48 26.26M72 150.25v-23.79A184 184 0 0 0 96 128a184 184 0 0 0 24-1.54v23.79A163 163 0 0 1 96 152a163 163 0 0 1-24-1.75m96-40.32V124c0 8.39-12.41 17.4-32 22.87V123.5c12.91-3.13 23.84-7.79 32-13.57M96 56c41.21 0 72 14.78 72 28s-30.79 28-72 28s-72-14.78-72-28s30.79-28 72-28m-72 68v-14.07c8.16 5.78 19.09 10.44 32 13.57v23.37C36.41 141.4 24 132.39 24 124m64 48v-4.17c2.63.1 5.29.17 8 .17c3.88 0 7.67-.13 11.39-.35a122 122 0 0 0 12.61 3.76v23.46c-19.59-5.47-32-14.48-32-22.87m48 26.25V174.4a179.5 179.5 0 0 0 24 1.6a184 184 0 0 0 24-1.54v23.79a165.5 165.5 0 0 1-48 0m64-3.38V171.5c12.91-3.13 23.84-7.79 32-13.57V172c0 8.39-12.41 17.4-32 22.87" />
    </svg>
  );
}

export function FilledBriefcaseIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path d="M152 112a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8m80-40v128a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V72a16 16 0 0 1 16-16h40v-8a24 24 0 0 1 24-24h48a24 24 0 0 1 24 24v8h40a16 16 0 0 1 16 16M96 56h64v-8a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8Zm120 57.61V72H40v41.61A184 184 0 0 0 128 136a184 184 0 0 0 88-22.39" />
    </svg>
  );
}

export function FilledBankIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path d="M248 208a8 8 0 0 1-8 8H16a8 8 0 0 1 0-16h224a8 8 0 0 1 8 8M16.3 98.18a8 8 0 0 1 3.51-9l104-64a8 8 0 0 1 8.38 0l104 64A8 8 0 0 1 232 104h-24v64h16a8 8 0 0 1 0 16H32a8 8 0 0 1 0-16h16v-64H24a8 8 0 0 1-7.7-5.82M144 160a8 8 0 0 0 16 0v-48a8 8 0 0 0-16 0Zm-48 0a8 8 0 0 0 16 0v-48a8 8 0 0 0-16 0Z" />
    </svg>
  );
}

export function FilledCoinsIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path d="M184 89.57V84c0-25.08-37.83-44-88-44S8 58.92 8 84v40c0 20.89 26.25 37.49 64 42.46V172c0 25.08 37.83 44 88 44s88-18.92 88-44v-40c0-20.7-25.42-37.32-64-42.43m-128 57.3C36.41 141.4 24 132.39 24 124v-14.07c8.16 5.78 19.09 10.44 32 13.57Zm80-23.37c12.91-3.13 23.84-7.79 32-13.57V124c0 8.39-12.41 17.4-32 22.87Zm-16 71.37c-19.59-5.47-32-14.48-32-22.87v-4.17c2.63.1 5.29.17 8 .17c3.88 0 7.67-.13 11.39-.35a122 122 0 0 0 12.61 3.76Zm0-44.62A163 163 0 0 1 96 152a163 163 0 0 1-24-1.75v-23.79A184 184 0 0 0 96 128a184 184 0 0 0 24-1.54Zm64 48a165.5 165.5 0 0 1-48 0V174.4a179.5 179.5 0 0 0 24 1.6a184 184 0 0 0 24-1.54ZM232 172c0 8.39-12.41 17.4-32 22.87V171.5c12.91-3.13 23.84-7.79 32-13.57Z" />
    </svg>
  );
}

export function FilledHandCoinsIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path d="M128.09 57.38a36 36 0 0 1 55.17-27.82a4 4 0 0 1-.56 7A52.06 52.06 0 0 0 152 84c0 1.17 0 2.34.12 3.49a4 4 0 0 1-6 3.76a36 36 0 0 1-18.03-33.87M240 160.61a24.47 24.47 0 0 1-13.6 22l-.44.2l-38.83 16.54a7 7 0 0 1-1.19.4l-64 16a8 8 0 0 1-1.94.25H16a16 16 0 0 1-16-16v-40a16 16 0 0 1 16-16h28.69l22.62-22.63A31.82 31.82 0 0 1 89.94 112H140a28 28 0 0 1 27.25 34.45l41.84-9.62A24.61 24.61 0 0 1 240 160.61m-16 0a8.61 8.61 0 0 0-10.87-8.3l-.31.08l-67 15.41a8.3 8.3 0 0 1-1.79.2H112a8 8 0 0 1 0-16h28a12 12 0 0 0 0-24H89.94a15.86 15.86 0 0 0-11.31 4.69L56 155.31V200h63l62.43-15.61l38-16.18a8.56 8.56 0 0 0 4.57-7.6M168 84a36 36 0 1 0 36-36a36 36 0 0 0-36 36" />
    </svg>
  );
}

export function FilledWalletIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path d="M216 64H56a8 8 0 0 1 0-16h136a8 8 0 0 0 0-16H56a24 24 0 0 0-24 24v128a24 24 0 0 0 24 24h160a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16m-36 80a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
    </svg>
  );
}

export function FilledReceiptIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path d="M216 40H40a16 16 0 0 0-16 16v152a8 8 0 0 0 11.58 7.15L64 200.94l28.42 14.21a8 8 0 0 0 7.16 0L128 200.94l28.42 14.21a8 8 0 0 0 7.16 0L192 200.94l28.42 14.21A8 8 0 0 0 232 208V56a16 16 0 0 0-16-16m-40 104H80a8 8 0 0 1 0-16h96a8 8 0 0 1 0 16m0-32H80a8 8 0 0 1 0-16h96a8 8 0 0 1 0 16" />
    </svg>
  );
}

export function FilledVaultIcon({ className }: IconProps) {
  return (
    <svg {...detailedBase(className)}>
      <path d="M216 40H40a16 16 0 0 0-16 16v136a16 16 0 0 0 16 16h16v16a8 8 0 0 0 16 0v-16h112v16a8 8 0 0 0 16 0v-16h16a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m-8 96h-28.91a36 36 0 1 1 0-16H208a8 8 0 0 1 0 16m-44-8a20 20 0 1 1-20-20a20 20 0 0 1 20 20" />
    </svg>
  );
}

export function PremiumCaseIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}>
        <path d="M21 12.2986C20.9991 15.9743 20.9652 19.6877 19.682 20.8284C18.3639 22 16.2426 22 12 22C7.75734 22 5.63601 22 4.318 20.8284C3.03474 19.6877 3.00089 15.9743 3 12.2986" />
        <path d="M6.5 5C7.32344 4.97913 8.15925 4.45491 8.43944 3.68032C8.44806 3.65649 8.4569 3.62999 8.47457 3.57697L8.50023 3.5C8.54241 3.37344 8.56351 3.31014 8.58608 3.254C8.87427 2.53712 9.54961 2.05037 10.3208 2.00366C10.3812 2 10.4479 2 10.5814 2H13.4191C13.5525 2 13.6192 2 13.6796 2.00366C14.4508 2.05037 15.1262 2.53712 15.4144 3.254C15.4369 3.31014 15.458 3.37343 15.5002 3.5L15.5259 3.57697C15.5435 3.62968 15.5524 3.65656 15.561 3.68032C15.8412 4.45491 16.6766 4.97913 17.5 5" />
        <path d="M14 12.5H10C9.72386 12.5 9.5 12.7239 9.5 13V15.1615C9.5 15.3659 9.62448 15.5498 9.8143 15.6257L10.5144 15.9058C11.4681 16.2872 12.5319 16.2872 13.4856 15.9058L14.1857 15.6257C14.3755 15.5498 14.5 15.3659 14.5 15.1615V13C14.5 12.7239 14.2761 12.5 14 12.5Z" />
        <path d="M14.5 14.2501L20.6677 12.3998C21.2632 12.2211 21.5609 12.1317 21.7498 11.9176C21.7866 11.8759 21.8199 11.8312 21.8492 11.784C22 11.5415 22 11.2307 22 10.6089C22 8.15877 22 6.9337 21.327 6.10659C21.1977 5.94763 21.0524 5.80233 20.8934 5.67298C20.0663 5 18.8412 5 16.3911 5H7.60893C5.15877 5 3.9337 5 3.10659 5.67298C2.94763 5.80233 2.80233 5.94763 2.67298 6.10659C2 6.9337 2 8.15877 2 10.6089C2 11.2307 2 11.5415 2.15078 11.784C2.18015 11.8312 2.21341 11.8759 2.25021 11.9176C2.43915 12.1317 2.7369 12.2211 3.3324 12.3997L9.49988 14.25" />
      </g>
    </svg>
  );
}

export function PremiumBuildingsIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}>
        <path d="M22 22L2 22" />
        <path d="M17 22V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V22" />
        <path d="M21 22V11.5C21 10.0955 21 9.39331 20.6629 8.88886C20.517 8.67048 20.3295 8.48298 20.1111 8.33706C19.6067 8 18.9045 8 17.5 8" />
        <path d="M3 22V11.5C3 10.0955 3 9.39331 3.33706 8.88886C3.48298 8.67048 3.67048 8.48298 3.88886 8.33706C4.39331 8 5.09554 8 6.5 8" />
        <path d="M12 22V19" />
        <path d="M10 5H14" />
        <path d="M10 8H14" />
        <path d="M10 11H14" />
        <path d="M10 14H14" />
      </g>
    </svg>
  );
}

export function PremiumWalletIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}>
        <path strokeLinejoin="round" d="M6 10H10" />
        <path d="M20.8333 11H18.2308C16.4465 11 15 12.3431 15 14C15 15.6569 16.4465 17 18.2308 17H20.8333C20.9167 17 20.9583 17 20.9935 16.9979C21.5328 16.965 21.9623 16.5662 21.9977 16.0654C22 16.0327 22 15.994 22 15.9167V12.0833C22 12.006 22 11.9673 21.9977 11.9346C21.9623 11.4338 21.5328 11.035 20.9935 11.0021C20.9583 11 20.9167 11 20.8333 11Z" />
        <path d="M20.965 11C20.8873 9.1277 20.6366 7.97975 19.8284 7.17157C18.6569 6 16.7712 6 13 6H10C6.22876 6 4.34315 6 3.17157 7.17157C2 8.34315 2 10.2288 2 14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H13C16.7712 22 18.6569 22 19.8284 20.8284C20.6366 20.0203 20.8873 18.8723 20.965 17" />
        <path d="M5.81348 6.12127C5.8756 6.08085 5.93772 6.04042 5.99984 6L9.73532 3.52313C10.7873 2.82562 12.2124 2.82562 13.2644 3.52313L16.9998 6C17.0605 6.04026 17.1211 6.08051 17.1818 6.12077" />
        <path strokeLinejoin="round" d="M17.9912 14H18.0002" />
      </g>
    </svg>
  );
}

export function SolarShieldCheckIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167C21 10.8996 21 11.4234 21 11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.89856 21.5273C7.23896 20.3655 3 17.6294 3 11.9914C3 11.4234 3 10.8996 3 10.4167Z" />
        <path strokeLinejoin="round" d="M9.5 12.4L10.9286 14L14.5 10" />
      </g>
    </svg>
  );
}

export function SolarHealthIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path strokeLinejoin="round" d="M2 9.3175C2 13.0468 6.01943 16.991 8.96173 19.3786C10.2937 20.4595 10.9597 21 12 21C13.0403 21 13.7063 20.4596 15.0383 19.3787C17.9806 16.991 22 13.0468 22 9.31747C22 3.08748 16.4998 0.761498 12 5.57412C7.50016 0.761498 2 3.08748 2 9.3175Z" />
        <path d="M18.5 9.00002H16.5M16.5 9.00002L14.5 9.00002M16.5 9.00002L16.5 7M16.5 9.00002L16.5 11" />
      </g>
    </svg>
  );
}

export function SolarHomeIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z" />
        <path d="M12 15L12 18" />
      </g>
    </svg>
  );
}

export function SolarBillListIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M16.755 2H7.24502C6.08614 2 5.50671 2 5.03939 2.16261C4.15322 2.47096 3.45748 3.18719 3.15795 4.09946C3 4.58055 3 5.17705 3 6.37006V20.3742C3 21.2324 3.985 21.6878 4.6081 21.1176C4.97417 20.7826 5.52583 20.7826 5.8919 21.1176L6.375 21.5597C7.01659 22.1468 7.98341 22.1468 8.625 21.5597C9.26659 20.9726 10.2334 20.9726 10.875 21.5597C11.5166 22.1468 12.4834 22.1468 13.125 21.5597C13.7666 20.9726 14.7334 20.9726 15.375 21.5597C16.0166 22.1468 16.9834 22.1468 17.625 21.5597L18.1081 21.1176C18.4742 20.7826 19.0258 20.7826 19.3919 21.1176C20.015 21.6878 21 21.2324 21 20.3742V6.37006C21 5.17705 21 4.58055 20.842 4.09946C20.5425 3.18719 19.8468 2.47096 18.9606 2.16261C18.4933 2 17.9139 2 16.755 2Z" />
        <path d="M10.5 11L17 11" />
        <path d="M7 11H7.5" />
        <path d="M7 7.5H7.5" />
        <path d="M7 14.5H7.5" />
        <path d="M10.5 7.5H17" />
        <path d="M10.5 14.5H17" />
      </g>
    </svg>
  );
}

export function SolarGiftIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M22 12H2" />
        <path d="M12 2V22" />
        <path d="M13 12C13 14.2091 14.7909 16 17 16" />
        <path d="M11 12C11 14.2091 9.20914 16 7 16" />
        <path d="M12 10.0352C12 8.54529 13.014 7.24659 14.4594 6.88524C16.0631 6.48431 17.5158 7.93697 17.1148 9.5407C16.7535 10.9861 15.4548 12.0001 13.9649 12.0001H12V10.0352Z" />
        <path d="M12.0001 10.0352C12.0001 8.54529 10.9861 7.24659 9.5407 6.88524C7.93698 6.48431 6.48431 7.93697 6.88524 9.5407C7.24659 10.9861 8.54529 12.0001 10.0352 12.0001H12.0001V10.0352Z" />
        <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" />
      </g>
    </svg>
  );
}

export function SolarClockIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinejoin="round" d="M12 8V12L14.5 14.5" />
      </g>
    </svg>
  );
}

export function SolarMoonStarsIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round">
        <path d="M19.9 2.30719C19.739 1.8976 19.1615 1.8976 19.0006 2.30719L18.5702 3.40247C18.521 3.52752 18.4224 3.62651 18.2978 3.67583L17.2066 4.1078C16.7985 4.26934 16.7985 4.849 17.2066 5.01054L18.2978 5.44252C18.4224 5.49184 18.521 5.59082 18.5702 5.71587L19.0005 6.81115C19.1615 7.22074 19.739 7.22074 19.9 6.81116L20.3303 5.71587C20.3795 5.59082 20.4781 5.49184 20.6027 5.44252L21.6939 5.01054C22.102 4.849 22.102 4.26934 21.6939 4.1078L20.6027 3.67583C20.4781 3.62651 20.3795 3.52752 20.3303 3.40247L19.9 2.30719Z" />
        <path d="M16.0326 8.12967C15.8717 7.72009 15.2941 7.72009 15.1332 8.12967L14.9763 8.52902C14.9271 8.65407 14.8285 8.75305 14.7039 8.80237L14.3061 8.95987C13.898 9.12141 13.898 9.70107 14.3061 9.86261L14.7039 10.0201C14.8285 10.0694 14.9271 10.1684 14.9763 10.2935L15.1332 10.6928C15.2941 11.1024 15.8717 11.1024 16.0326 10.6928L16.1895 10.2935C16.2387 10.1684 16.3373 10.0694 16.4619 10.0201L16.8598 9.86261C17.2678 9.70107 17.2678 9.12141 16.8598 8.95987L16.4619 8.80237C16.3373 8.75305 16.2387 8.65407 16.1895 8.52902L16.0326 8.12967Z" />
        <path strokeLinejoin="round" strokeWidth={1.5} d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
      </g>
    </svg>
  );
}

export function SolarMoneyRollIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M9 19C6.19108 19 4.78661 19 3.77772 18.3259C3.34096 18.034 2.96596 17.659 2.67412 17.2223C2 16.2134 2 14.8089 2 12C2 9.19108 2 7.78661 2.67412 6.77772C2.96596 6.34096 3.34096 5.96596 3.77772 5.67412C4.78661 5 6.19108 5 9 5L15 5C17.8089 5 19.2134 5 20.2223 5.67412C20.659 5.96596 21.034 6.34096 21.3259 6.77772C22 7.78661 22 9.19108 22 12C22 14.8089 22 16.2134 21.3259 17.2223C21.034 17.659 20.659 18.034 20.2223 18.3259C19.2134 19 17.8089 19 15 19H9Z" />
        <path d="M9 9C7.34315 9 6 10.3431 6 12C6 13.6569 7.34315 15 9 15" />
        <path d="M15 9C16.6569 9 18 10.3431 18 12C18 13.6569 16.6569 15 15 15" />
        <path d="M9 5V18.5" />
        <path d="M15 5V18.5" />
      </g>
    </svg>
  );
}

export function PremiumBankIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 9.5L12 4l9 5.5M5 20h14M10 9h4m-8 8v-5m4 5v-5m4 5v-5m4 5v-5"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WorkLaptopIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.243 3.757A5.98 5.98 0 0 0 6 2a5.98 5.98 0 0 0-4.243 1.757m2.122 2.122A3 3 0 0 1 6 5a3 3 0 0 1 2.121.879M16 20h-4m0 0H4l-2-6h8zm7.5-11.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0ZM18 20h4v-3.653A13.95 13.95 0 0 0 16 15c-1.03 0-2.034.111-3 .322"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DeveloperIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.818 22v-2.857C6.662 17.592 5.633 16.416 4.682 15m9.772 7v-1.714c4.91 0 4.364-5.714 4.364-5.714s2.182 0 2.182-2.286l-2.182-3.428c0-4.572-3.709-6.816-7.636-6.857c-2.2-.023-3.957.53-5.27 1.499" />
        <path d="m13 7l2 2.5l-2 2.5M5 7L3 9.5L5 12m5-6l-2 7" />
      </g>
    </svg>
  );
}

export function WorkPersonIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.2 7c0-2.3 1.6-4.1 3.9-4.4c1-.1 2 0 3 .3c2 .6 3.1 2.3 3.1 4.4v3c0 2.7-1.7 4.8-4.4 5.2c-2.8.4-5.6-1.2-5.6-4.2z" />
        <path d="M11.4 5.4c1.4-1 3.2-1.3 4.9-.7c1.3.4 2.3 1.4 2.7 2.7" />
        <path d="M16.5 2.6c-.2 1.4.2 2.4 1.2 3.2" />
        <path d="M11.2 7.6c-1 0-1.7.6-1.7 1.5s.7 1.5 1.7 1.5" />
        <path d="M20.9 7.6c1 0 1.7.6 1.7 1.5s-.7 1.5-1.7 1.5" />
        <path d="M14.2 13.9v1.7M17.8 13.9v1.7" />
        <path d="M8 22.2c.8-3.5 3.1-5.5 6.3-5.5h3.4c3.2 0 5.5 2 6.3 5.5" />
        <path d="M13 17.4l3 2.2 3-2.2" />
        <path d="M16 19.6l-1.1 3.8 1.1 1.1 1.1-1.1z" fill="currentColor" stroke="none" />
        <path d="M9.7 21.4h12.6l1 6H8.7z" />
        <circle cx="16" cy="24.3" r="1.1" />
        <path d="M7 28.5h18" />
        <g transform="translate(27 6.3)">
          <circle r="3.2" />
          <circle r="1.3" />
          <path d="M0-3.2V-4.4M0 3.2V4.4M-3.2 0H-4.4M3.2 0H4.4M-2.26-2.26l-.85-.85M2.26 2.26l.85.85M-2.26 2.26l-.85.85M2.26-2.26l.85-.85" />
        </g>
        <g transform="translate(5.3 13) scale(.65)">
          <circle r="3.2" />
          <circle r="1.3" />
          <path d="M0-3.2V-4.4M0 3.2V4.4M-3.2 0H-4.4M3.2 0H4.4M-2.26-2.26l-.85-.85M2.26 2.26l.85.85M-2.26 2.26l-.85.85M2.26-2.26l.85-.85" />
        </g>
        <g transform="translate(27.5 18.5) scale(.5)">
          <circle r="3.2" />
          <circle r="1.3" />
          <path d="M0-3.2V-4.4M0 3.2V4.4M-3.2 0H-4.4M3.2 0H4.4M-2.26-2.26l-.85-.85M2.26 2.26l.85.85M-2.26 2.26l-.85.85M2.26-2.26l.85-.85" />
        </g>
      </g>
    </svg>
  );
}

export function HandCoinIcon({ className }: IconProps) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.191 4.155h-1.668a1.1 1.1 0 0 0-.409 2.123l1.693.677a1.1 1.1 0 0 1-.407 2.122h-1.67m1.231-4.922V2.963m0 7.178V9.077" />
        <path d="M10.321 6.616a5.64 5.64 0 1 0 11.28 0a5.64 5.64 0 0 0-11.28 0M15.2 17.42l6.217-1.986l.043-.012a1.474 1.474 0 0 1 .989 2.751c-12.137 6.284-9.041 6-21.7 1.783" />
        <path d="M.75 12.256h2.2a10.62 10.62 0 0 1 6.986 2.528l.041.036h4.1a1.542 1.542 0 0 1 .008 3.085l-6.234.031" />
      </g>
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

export function BanknoteIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={2}>
      <rect
        x="2.5"
        y="6"
        width="19"
        height="12"
        rx="2.5"
        fill="currentColor"
        fillOpacity={0.18}
      />
      <circle cx="12" cy="12" r="2.8" />
      <path d="M6 9.5v5M18 9.5v5" />
    </svg>
  );
}

export function AlarmClockIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={2}>
      <circle
        cx="12"
        cy="13"
        r="7"
        fill="currentColor"
        fillOpacity={0.18}
      />
      <path d="M12 9v4l2.5 1.5" />
      <path d="M5 4.5 7.5 7M19 4.5 16.5 7M4.5 20h4M15.5 20h4" />
    </svg>
  );
}

export function IdCardIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={2}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        fill="currentColor"
        fillOpacity={0.18}
      />
      <circle cx="8.5" cy="11" r="2.1" />
      <path d="M5.5 15.5c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4" />
      <path d="M14 10h4M14 13h4M14 16h2.5" />
    </svg>
  );
}

export function ReceiptIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={2}>
      <path
        d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"
        fill="currentColor"
        fillOpacity={0.18}
      />
      <path d="M9 7h6M9 10h6M9 13h4M9 16h2" />
    </svg>
  );
}

export function HouseKeyIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={2}>
      <path
        d="M4 11.5 12 4l8 7.5V21H4V11.5Z"
        fill="currentColor"
        fillOpacity={0.18}
      />
      <path d="M6 9.5V21h12V9.5" />
      <path d="M10 21v-6h4v6" />
      <circle cx="12" cy="16" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function PercentTagIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={2}>
      <path
        d="M3 12.5V4h8.5L21 13.5 13.5 21 3 12.5Z"
        fill="currentColor"
        fillOpacity={0.18}
      />
      <circle cx="7.8" cy="8.6" r="1.4" fill="currentColor" />
      <circle cx="13.8" cy="14.6" r="1.4" fill="currentColor" />
      <path d="M8.5 15.5 15.5 8.5" />
    </svg>
  );
}
