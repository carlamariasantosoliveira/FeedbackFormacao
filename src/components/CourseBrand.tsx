interface CourseBrandProps {
  compact?: boolean;
}

export function CourseBrand({ compact = false }: CourseBrandProps) {
  return (
    <div className={`inline-flex items-center text-left ${compact ? 'gap-3' : 'gap-4'}`}>
      <div
        className={`shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#EDE9FE] border border-blue-200/80 ${
          compact ? 'w-11 h-11' : 'w-16 h-16'
        }`}
        aria-hidden="true"
      >
        <span className="font-display font-extrabold text-[#0B3B8C] text-base">IA</span>
      </div>
      <div>
        <div
          className={`font-display font-extrabold tracking-tight text-[#0B3B8C] leading-tight ${
            compact ? 'text-base' : 'text-xl sm:text-2xl'
          }`}
        >
          Inteligência Artificial na Educação
        </div>
        <div
          className={`font-sans font-medium text-[#1D4ED8] leading-snug ${
            compact ? 'text-xs' : 'text-sm sm:text-base'
          }`}
        >
          Estratégias, Ferramentas e Práticas Pedagógicas
        </div>
      </div>
    </div>
  );
}
