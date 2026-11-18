import { ClipboardList, GraduationCap, BookOpenCheck } from 'lucide-react';
import { CourseBrand } from './CourseBrand.tsx';

interface HomeScreenProps {
  onSelectTeacher: () => void;
  onSelectStudent: () => void;
  onOpenRubric: () => void;
}

export function HomeScreen({
  onSelectTeacher,
  onSelectStudent,
  onOpenRubric,
}: HomeScreenProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-12 bg-white">
      <div className="w-full max-w-2xl flex flex-col items-center text-center">
        <div className="mb-7">
          <CourseBrand />
        </div>

        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#1a1a2e] tracking-tight mb-8 text-balance">
          Feedback Individualizado: Projeto de Intervenção
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[560px]">
          <button
            type="button"
            onClick={onSelectTeacher}
            className="group relative overflow-hidden rounded-2xl border border-[#1e40af] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#3b82f6] px-8 py-9 text-center text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(37,99,235,0.32)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e40af] cursor-pointer"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <GraduationCap className="h-7 w-7 text-amber-300" aria-hidden="true" />
            </div>
            <span className="block font-display text-2xl font-bold mb-2">
              Sou Formador
            </span>
            <span className="block text-sm text-white/90 leading-relaxed">
              Aceder ao painel para gerir formandos e escrever feedback.
            </span>
          </button>

          <button
            type="button"
            onClick={onSelectStudent}
            className="group relative overflow-hidden rounded-2xl border border-[#1e40af] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#3b82f6] px-8 py-9 text-center text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(37,99,235,0.32)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e40af] cursor-pointer"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <ClipboardList className="h-7 w-7 text-amber-200" aria-hidden="true" />
            </div>
            <span className="block font-display text-2xl font-bold mb-2">
              Sou Formando
            </span>
            <span className="block text-sm text-white/90 leading-relaxed">
              Ver o meu feedback com a password recebida pelo formador.
            </span>
          </button>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onOpenRubric}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#2563eb] transition-colors underline underline-offset-4 cursor-pointer py-2 px-3"
          >
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
            <span>Consultar Critérios de Avaliação do Projeto de Intervenção</span>
          </button>
        </div>
      </div>
    </main>
  );
}
