export function BackdropWaves() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {/* Base sky-white canvas with soft top-left glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 16% 14%, rgba(191, 219, 254, 0.45) 0%, rgba(247, 250, 255, 0) 42%), radial-gradient(circle at 86% 24%, rgba(224, 231, 255, 0.45) 0%, rgba(247, 250, 255, 0) 44%), linear-gradient(180deg, #F8FBFF 0%, #F4F8FF 68%, #EEF4FF 100%)',
        }}
      />

      {/* Top-right 4x3 sky-blue dot grid */}
      <svg
        className="hidden sm:block absolute top-10 right-8 w-20 h-16 opacity-80"
        viewBox="0 0 84 64"
        fill="none"
      >
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={10 + col * 20}
              cy={10 + row * 20}
              r="2.4"
              fill="#38A1F8"
            />
          ))
        )}
      </svg>

      {/* Subtle right-side outline graduation cap watermark motif */}
      <svg
        className="hidden lg:block absolute right-14 top-[38%] w-28 h-24 opacity-45 -rotate-6"
        viewBox="0 0 110 88"
        fill="none"
      >
        <path
          d="M55 14L100 32L55 50L10 32L55 14Z"
          stroke="#93C5FD"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="M28 40V58C28 65 40 71 55 71C70 71 82 65 82 58V40"
          stroke="#93C5FD"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M93 36V61"
          stroke="#93C5FD"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="93" cy="65" r="3.5" fill="#93C5FD" />
      </svg>

      {/* Bottom layered flowing blue-to-purple waves */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[210px] sm:h-[270px] lg:h-[310px]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-back-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CEE4FF" stopOpacity="0.65" />
            <stop offset="52%" stopColor="#DCE6FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C7B8FF" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="wave-mid-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4CA0FF" stopOpacity="0.78" />
            <stop offset="48%" stopColor="#8EC5FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9D74FB" stopOpacity="0.82" />
          </linearGradient>
          <linearGradient id="wave-front-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2A84F6" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#5BB0FF" stopOpacity="0.88" />
            <stop offset="72%" stopColor="#9C7AF8" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.96" />
          </linearGradient>
        </defs>

        {/* Back soft translucent wave */}
        <path
          d="M0,120 C240,55 480,170 760,175 C1040,180 1240,85 1440,65 L1440,320 L0,320 Z"
          fill="url(#wave-back-grad)"
        />
        {/* Middle wave */}
        <path
          d="M0,195 C220,130 470,220 740,225 C1010,230 1230,130 1440,150 L1440,320 L0,320 Z"
          fill="url(#wave-mid-grad)"
        />
        {/* Front vivid blue-to-purple wave */}
        <path
          d="M0,248 C200,205 400,295 690,292 C980,289 1200,210 1440,228 L1440,320 L0,320 Z"
          fill="url(#wave-front-grad)"
        />
      </svg>
    </div>
  );
}
