import { ArrowLeft, BookOpen, Database, LogOut, Printer } from 'lucide-react';
import type { ActivityType, StudentPublicRecord } from '../types.ts';
import { calcFinalScore } from '../lib/rubric.ts';
import { hasAnyCriterionData } from '../lib/pdfReportHelpers.ts';
import { StudentReportCard } from './StudentReportCard.tsx';

interface StudentFeedbackViewProps {
  student: StudentPublicRecord;
  isPreview?: boolean;
  onBackToPanel?: () => void;
  onOpenRubric: (activity: ActivityType) => void;
  onLogout: () => void;
}

export function StudentFeedbackView({
  student,
  isPreview = false,
  onBackToPanel,
  onOpenRubric,
  onLogout,
}: StudentFeedbackViewProps) {
  const finalScore = calcFinalScore(student.criterios, student.activityType);
  const hasFeedback = Boolean(student.feedback || finalScore !== null || hasAnyCriterionData(student));

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFF]">
      <header className="no-print sticky top-0 z-10 flex items-center justify-between gap-2 sm:gap-6 px-4 sm:px-8 py-3.5 border-b border-blue-100 bg-white/95 backdrop-blur-md">
        <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#0B3B8C] whitespace-nowrap shrink-0">
          FeedbackPrivado
        </span>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>Dados sincronizados</span>
          </span>
          <button
            type="button"
            onClick={() => onOpenRubric(student.activityType)}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0464D9] font-semibold cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Ver matriz de critérios</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenRubric(student.activityType)}
            aria-label="Ver matriz de critérios"
            title="Ver matriz de critérios"
            className="sm:hidden p-2 text-slate-600 hover:text-[#0464D9] border border-blue-100 rounded-lg cursor-pointer"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </button>
          {isPreview && onBackToPanel && (
            <button
              type="button"
              onClick={onBackToPanel}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0F2D6B] border border-blue-100 rounded-xl hover:bg-blue-50/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="sm:hidden">Painel</span>
              <span className="hidden sm:inline">Voltar ao Painel</span>
            </button>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F2D6B] border border-blue-100 rounded-xl hover:bg-blue-50/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 gap-5">
        <StudentReportCard student={student} />

        {hasFeedback && (
          <div className="no-print w-full max-w-[860px]">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#f0f4ff] text-[#1e40af] border border-blue-200 rounded-xl text-sm font-semibold hover:bg-[#dbeafe] hover:border-[#2563eb] transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
