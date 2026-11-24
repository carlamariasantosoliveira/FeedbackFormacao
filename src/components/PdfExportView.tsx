import { useEffect } from 'react';
import { ArrowLeft, FileText, Printer } from 'lucide-react';
import type { StudentRecord } from '../types.ts';
import { StudentReportCard } from './StudentReportCard.tsx';

interface PdfExportViewProps {
  students: StudentRecord[];
  title: string;
  documentTitle: string;
  onBackToPanel: () => void;
}

export function PdfExportView({
  students,
  title,
  documentTitle,
  onBackToPanel,
}: PdfExportViewProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = documentTitle;
    const timer = window.setTimeout(() => {
      window.print();
    }, 300);

    return () => {
      window.clearTimeout(timer);
      document.title = prevTitle;
    };
  }, [documentTitle]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFF]">
      <header className="no-print sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-3.5 border-b border-blue-100 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToPanel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-[#0F2D6B] border border-blue-100 rounded-xl hover:bg-blue-50/70 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Voltar ao Painel</span>
          </button>
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#0B3B8C] truncate flex items-center gap-1.5">
              <FileText className="h-4 w-4 shrink-0 text-[#0464D9]" aria-hidden="true" />
              <span className="truncate">{title}</span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Na janela de impressão, seleciona «Guardar como PDF» como destino.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0464D9] hover:bg-[#0041A8] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          <span>
            Guardar como PDF ({students.length} {students.length === 1 ? 'formando' : 'formandos'})
          </span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center gap-8 px-4 sm:px-6 py-8 sm:py-10">
        {students.length === 0 ? (
          <div className="bg-white border border-blue-100 rounded-2xl p-10 text-center text-slate-600 max-w-md">
            Não existem formandos selecionados para exportar em PDF.
          </div>
        ) : (
          students.map((student, idx) => (
            <StudentReportCard
              key={student.id}
              student={student}
              pageBreakAfter={idx < students.length - 1}
              alwaysShowCourseHeader
              alwaysShowFooter
              emptyMessage="Este formando ainda não tem feedback nem avaliação registada."
            />
          ))
        )}
      </main>
    </div>
  );
}
