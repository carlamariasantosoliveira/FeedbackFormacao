export function HeroLaptopIllustration() {
  return (
    <svg
      viewBox="0 0 340 215"
      className="w-[240px] sm:w-[275px] md:w-[300px] h-auto shrink-0 drop-shadow-[0_14px_24px_rgba(37,99,235,0.14)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-screen-grad" x1="88" y1="20" x2="245" y2="148" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="52%" stopColor="#3B5BF5" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="hero-chip-grad" x1="138" y1="52" x2="196" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="hero-leaf-left" x1="36" y1="20" x2="86" y2="122" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        <linearGradient id="hero-leaf-right" x1="252" y1="30" x2="296" y2="132" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="hero-base-grad" x1="64" y1="142" x2="285" y2="178" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="172" cy="186" rx="135" ry="14" fill="#CBD5E1" fillOpacity="0.45" />

      {/* Left botanical leaves behind laptop */}
      <path
        d="M84 128C60 112 42 74 52 24C74 44 92 84 86 128Z"
        fill="url(#hero-leaf-left)"
      />
      <path
        d="M82 132C56 126 30 98 28 60C54 70 76 96 84 132Z"
        fill="#16A34A"
        fillOpacity="0.9"
      />
      <path
        d="M90 124C76 92 78 52 94 20C106 50 106 90 92 124Z"
        fill="#4ADE80"
        fillOpacity="0.75"
      />

      {/* Right botanical leaves behind laptop */}
      <path
        d="M254 124C254 88 272 52 298 32C302 68 284 108 256 126Z"
        fill="url(#hero-leaf-right)"
      />
      <path
        d="M258 130C278 118 304 92 312 62C288 68 266 96 256 128Z"
        fill="#10B981"
        fillOpacity="0.9"
      />
      <path
        d="M248 122C242 94 252 62 270 38C276 68 268 100 250 124Z"
        fill="#6EE7B7"
        fillOpacity="0.8"
      />

      {/* Laptop lid / bezel */}
      <g transform="rotate(-3.5 170 95)">
        <rect x="82" y="20" width="174" height="122" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2.5" />
        <rect x="89" y="27" width="160" height="108" rx="6" fill="url(#hero-screen-grad)" />

        {/* Subtle circuit trace lines on screen */}
        <g stroke="#93C5FD" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round">
          <path d="M138 64H114L104 54" />
          <path d="M138 82H106" />
          <path d="M138 98H116L106 108" />
          <path d="M200 64H224L234 54" />
          <path d="M200 82H232" />
          <path d="M200 98H222L232 108" />
          <path d="M156 50V36" />
          <path d="M182 50V36" />
          <path d="M156 114V128" />
          <path d="M182 114V128" />
          <circle cx="103" cy="53" r="2.2" fill="#93C5FD" fillOpacity="0.65" />
          <circle cx="105" cy="82" r="2.2" fill="#93C5FD" fillOpacity="0.65" />
          <circle cx="235" cy="53" r="2.2" fill="#93C5FD" fillOpacity="0.65" />
          <circle cx="233" cy="82" r="2.2" fill="#93C5FD" fillOpacity="0.65" />
          <circle cx="233" cy="109" r="2.2" fill="#93C5FD" fillOpacity="0.65" />
        </g>

        {/* Central glowing IA square badge */}
        <rect
          x="136"
          y="48"
          width="66"
          height="66"
          rx="14"
          fill="url(#hero-chip-grad)"
          fillOpacity="0.4"
          stroke="#BFDBFE"
          strokeWidth="2.2"
        />
        <text
          x="169"
          y="91"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="30"
          fontWeight="800"
          fontFamily="Plus Jakarta Sans, sans-serif"
          letterSpacing="-0.5"
        >
          IA
        </text>
      </g>

      {/* Laptop keyboard base (angled perspective) */}
      <path
        d="M84 142L260 132L292 162C296 166 293 171 286 172L104 183C97 183 92 179 90 174L84 142Z"
        fill="url(#hero-base-grad)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
      <path
        d="M96 146L252 137L272 155L112 165L96 146Z"
        fill="#94A3B8"
        fillOpacity="0.4"
      />
      {/* Trackpad */}
      <path
        d="M170 165L206 163L212 170L176 172L170 165Z"
        fill="#94A3B8"
        fillOpacity="0.45"
      />

      {/* Stacked colorful books on the bottom-left */}
      <g transform="translate(26, 126)">
        {/* Bottom blue book */}
        <rect x="0" y="34" width="68" height="14" rx="4" fill="#2563EB" />
        <rect x="6" y="37" width="56" height="8" rx="2" fill="#EFF6FF" />
        <rect x="0" y="34" width="12" height="14" rx="3" fill="#1D4ED8" />

        {/* Middle cyan book */}
        <rect x="4" y="20" width="64" height="14" rx="4" fill="#0EA5E9" />
        <rect x="10" y="23" width="52" height="8" rx="2" fill="#F0F9FF" />
        <rect x="4" y="20" width="12" height="14" rx="3" fill="#0284C7" />

        {/* Top orange book */}
        <rect x="2" y="6" width="62" height="14" rx="4" fill="#F97316" />
        <rect x="8" y="9" width="50" height="8" rx="2" fill="#FFF7ED" />
        <rect x="2" y="6" width="12" height="14" rx="3" fill="#EA580C" />
      </g>

      {/* Purple pencil cup with orange & yellow pencils on the bottom-right */}
      <g transform="translate(262, 108)">
        {/* Pencils */}
        <rect x="11" y="4" width="5" height="32" rx="1.5" transform="rotate(-12 11 4)" fill="#FBBF24" />
        <polygon points="11,4 13.5,-2 16,4" transform="rotate(-12 11 4)" fill="#FDBA74" />
        <rect x="22" y="0" width="5" height="36" rx="1.5" transform="rotate(8 22 0)" fill="#F97316" />
        <polygon points="22,0 24.5,-6 27,0" transform="rotate(8 22 0)" fill="#FED7AA" />
        {/* Cup body */}
        <path d="M6 26H34L30 56C29.6 59 27.2 61 24.5 61H15.5C12.8 61 10.4 59 10 56L6 26Z" fill="#7C3AED" />
        <ellipse cx="20" cy="26" rx="14" ry="3.5" fill="#9F67FA" />
      </g>
    </svg>
  );
}
