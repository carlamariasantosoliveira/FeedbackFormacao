import { ArrowRight, GraduationCap } from 'lucide-react';
import { BackdropWaves } from './BackdropWaves.tsx';
import { HeroLaptopIllustration } from './HeroLaptopIllustration.tsx';

interface HomeScreenProps {
  onSelectTeacher: () => void;
  onSelectStudent: () => void;
}

export function HomeScreen({
  onSelectTeacher,
  onSelectStudent,
}: HomeScreenProps) {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-8 pb-20 sm:pb-28 overflow-x-hidden">
      <BackdropWaves />

      <div className="relative z-10 w-full max-w-[1080px] flex flex-col items-center">
        {/* Top Hero Lockup: Laptop Illustration + Single-Line Title/Subtitle */}
        <header className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-7 mb-10 sm:mb-14 text-center md:text-left">
          <HeroLaptopIllustration />

          <div className="min-w-0">
            <h1 className="font-display text-[1.7rem] sm:text-[2.25rem] lg:text-[2.65rem] lg:whitespace-nowrap font-extrabold text-[#0B3B8C] tracking-[-0.025em] leading-[1.12] text-balance">
              Inteligência Artificial na Educação
            </h1>
            <p className="mt-2 text-[0.98rem] sm:text-[1.25rem] lg:text-[1.35rem] font-medium text-[#1D4ED8] leading-snug text-balance">
              Estratégias, Ferramentas e{' '}
              <span className="relative inline-block pb-2">
                Práticas Pedagógicas
                <svg
                  viewBox="0 0 220 14"
                  className="absolute left-0 -bottom-0.5 w-full h-3.5 text-[#6366F1]"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10.5C68 3.5 148 3 217 9"
                    stroke="currentColor"
                    strokeWidth="4.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </p>
          </div>
        </header>

        {/* Two Role Cards matching the visual mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[940px]">
          {/* Left Card: Sou Formador (Royal Blue -> Cyan Gradient) */}
          <button
            type="button"
            onClick={onSelectTeacher}
            className="group relative flex items-center gap-4 sm:gap-6 overflow-hidden rounded-[24px] border-[3px] border-white bg-gradient-to-br from-[#0041A8] via-[#0464D9] to-[#0894EB] px-6 sm:px-8 py-7 pb-10 text-left text-white shadow-[0_18px_44px_rgba(3,98,214,0.28)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(3,98,214,0.36)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0041A8] cursor-pointer min-h-[192px] sm:min-h-[208px]"
          >
            {/* Internal subtle fluid bottom wave */}
            <svg
              viewBox="0 0 400 120"
              className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-24 opacity-25"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,48 C85,12 185,84 290,56 C345,42 378,24 400,18 L400,120 L0,120 Z"
                fill="#7DD3FC"
              />
            </svg>

            <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-[0_8px_20px_rgba(0,40,120,0.18)]">
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-[#0B63D6]" strokeWidth={1.9} aria-hidden="true" />
            </div>

            <div className="relative z-10 flex-1 min-w-0">
              <span className="block font-display text-[1.5rem] sm:text-[1.8rem] font-extrabold tracking-tight leading-tight mb-2 whitespace-nowrap">
                Sou Formador
              </span>
              <span className="block pr-11 text-[0.92rem] sm:text-[0.98rem] text-white/95 leading-[1.45] font-normal">
                Aceder ao painel para gerir formandos e escrever feedback.
              </span>
            </div>

            <span
              className="absolute bottom-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0464D9] shadow-sm transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </span>
          </button>

          {/* Right Card: Sou Formando (Vibrant Purple/Violet Gradient) */}
          <button
            type="button"
            onClick={onSelectStudent}
            className="group relative flex items-center gap-4 sm:gap-6 overflow-hidden rounded-[24px] border-[3px] border-white bg-gradient-to-br from-[#6A2BE2] via-[#7E3DF2] to-[#9B63FA] px-6 sm:px-8 py-7 pb-10 text-left text-white shadow-[0_18px_44px_rgba(124,58,237,0.28)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(124,58,237,0.38)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6A2BE2] cursor-pointer min-h-[192px] sm:min-h-[208px]"
          >
            {/* Internal subtle fluid bottom wave */}
            <svg
              viewBox="0 0 400 120"
              className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-24 opacity-25"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,62 C110,20 220,88 320,46 C358,30 384,22 400,20 L400,120 L0,120 Z"
                fill="#DDD6FE"
              />
            </svg>

            <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-[0_8px_20px_rgba(76,29,149,0.2)]">
              {/* Custom Checklist Clipboard Icon matching mockup */}
              <svg
                viewBox="0 0 40 40"
                className="h-8 w-8 sm:h-10 sm:w-10 text-[#6D28D9]"
                fill="none"
                aria-hidden="true"
              >
                <rect x="9" y="7" width="22" height="27" rx="3.5" stroke="currentColor" strokeWidth="2.3" />
                <rect x="15" y="4.5" width="10" height="4.5" rx="1.8" fill="white" stroke="currentColor" strokeWidth="2.1" />
                <path d="M13.5 16L15.2 17.7L18 14.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.5 16.3H26.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M13.5 21.8L15.2 23.5L18 20.3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.5 22.1H26.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M13.5 27.6L15.2 29.3L18 26.1" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.5 27.9H26.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="relative z-10 flex-1 min-w-0">
              <span className="block font-display text-[1.5rem] sm:text-[1.8rem] font-extrabold tracking-tight leading-tight mb-2 whitespace-nowrap">
                Sou Formando
              </span>
              <span className="block pr-11 text-[0.92rem] sm:text-[0.98rem] text-white/95 leading-[1.45] font-normal">
                Ver o meu feedback com a password recebida pelo formador.
              </span>
            </div>

            <span
              className="absolute bottom-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#7C3AED] shadow-sm transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
