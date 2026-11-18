interface CourseBrandProps {
  compact?: boolean;
}

export function CourseBrand({ compact = false }: CourseBrandProps) {
  return (
    <div className={`inline-flex items-center gap-4 text-left ${compact ? 'gap-3' : 'gap-4'}`}>
      <div
        className={`shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] border border-blue-200/80 ${
          compact ? 'w-12 h-12' : 'w-16 h-16 sm:w-20 sm:h-20'
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 64 64"
          className={compact ? 'w-8 h-8' : 'w-12 h-12 sm:w-14 sm:h-14'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Laptop base */}
          <rect x="9" y="19" width="40" height="28" rx="3.5" fill="#1e40af" />
          <rect x="12.5" y="22.5" width="33" height="21" rx="1.5" fill="#f8fafc" />
          <path d="M4 48.5C4 47.4 4.9 46.5 6 46.5H52C53.1 46.5 54 47.4 54 48.5V50C54 51.7 52.7 53 51 53H7C5.3 53 4 51.7 4 50V48.5Z" fill="#2563eb" />
          {/* AI Assistant Face */}
          <circle cx="29" cy="33" r="7" fill="#1e3a8a" />
          <circle cx="26.2" cy="32" r="1.35" fill="#93c5fd" />
          <circle cx="31.8" cy="32" r="1.35" fill="#93c5fd" />
          <path d="M26.2 35.8H31.8" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round" />
          {/* Graduation Cap */}
          <path d="M29 7L41 12.2L29 17.5L17 12.2L29 7Z" fill="#1a1a2e" />
          <path d="M21.5 14.5V18.8C21.5 20.3 24.8 21.5 29 21.5C33.2 21.5 36.5 20.3 36.5 18.8V14.5" fill="#1e40af" />
          <path d="M39.5 13.2V19.5" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="39.5" cy="20.4" r="1.3" fill="#f59e0b" />
          {/* Lightbulb accent */}
          <circle cx="53.5" cy="13" r="5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.3" />
          <path d="M53.5 10.6V13.3M52.1 15.2H54.9" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div
          className={`font-sans font-semibold tracking-tight text-[#1e3a8a] leading-tight ${
            compact ? 'text-base' : 'text-xl sm:text-2xl'
          }`}
        >
          Inteligência Artificial na Educação:
        </div>
        <div
          className={`font-sans text-slate-600 leading-snug ${
            compact ? 'text-xs' : 'text-sm sm:text-base'
          }`}
        >
          Estratégias, Ferramentas e Práticas Pedagógicas
        </div>
      </div>
    </div>
  );
}
