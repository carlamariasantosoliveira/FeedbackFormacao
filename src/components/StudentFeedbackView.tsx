import { ArrowLeft, BookOpen, Clock, Database, LogOut, Printer } from 'lucide-react';
import type { ActivityType, StudentPublicRecord } from '../types.ts';
import {
  calcFinalScore,
  getActivityConfig,
  getInitials,
  getPerformanceLevel,
  parseScore,
  sanitizeFeedbackHtml,
} from '../lib/rubric.ts';
import { CourseBrand } from './CourseBrand.tsx';

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
  const activity = getActivityConfig(student.activityType);
  const criteria = activity.criteria;
  const finalScore = calcFinalScore(student.criterios, student.activityType);
  const hasFeedback = Boolean(student.feedback || finalScore !== null);
  const overallLevel = finalScore !== null ? getPerformanceLevel(Number(finalScore)) : null;

  const today = new Date().toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const hasAllCriteria =
    student.criterios &&
    student.criterios.length === criteria.length &&
    student.criterios.every((v) => parseScore(v) !== null);

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

      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 sm:py-12">
        <article className="print-container w-full max-w-[860px] bg-white border border-blue-100 rounded-[24px] p-6 sm:p-10 shadow-[0_18px_48px_rgba(37,99,235,0.08)]">
          {/* Course header visible on print */}
          <div className="print-only mb-6 pb-4 border-b border-slate-200">
            <CourseBrand compact />
          </div>

          {/* Student Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 mb-7 border-b border-slate-200">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className={`h-14 w-14 rounded-full text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm ${
                  student.activityType === 'cenario'
                    ? 'bg-gradient-to-br from-[#6A2BE2] to-[#9B63FA]'
                    : 'bg-gradient-to-br from-[#0041A8] to-[#0894EB]'
                }`}
              >
                {getInitials(student.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-2xl font-extrabold text-[#0B3B8C] tracking-tight">
                  {student.name}
                </h1>
                <div className="text-sm text-slate-500 mt-0.5 space-y-0.5">
                  <div>
                    <span
                      className={`font-semibold ${
                        student.activityType === 'cenario' ? 'text-[#6D28D9]' : 'text-[#0464D9]'
                      }`}
                    >
                      {activity.activityTitle}
                    </span>
                    {student.projectTitle && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span className="text-[#1a1a2e] font-medium">{student.projectTitle}</span>
                      </>
                    )}
                  </div>
                  {student.targetAudience && (
                    <div>
                      {activity.audienceShortLabel}: {student.targetAudience}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {finalScore !== null && overallLevel && (
              <div className="print-badge self-start sm:self-center sm:ml-auto bg-[#1a1a2e] text-white px-5 py-2.5 rounded-2xl flex flex-col items-center tabular-nums shrink-0">
                <span className="text-[0.68rem] uppercase tracking-wider text-white/75">
                  Nota Final · {overallLevel.label}
                </span>
                <span className="font-display text-2xl font-bold leading-tight">
                  {finalScore} / 10
                </span>
              </div>
            )}
          </div>

          {!hasFeedback ? (
            <div className="py-14 text-center text-slate-500">
              <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-[#f0f4ff] text-[#2563eb] flex items-center justify-center">
                <Clock className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-base font-medium text-[#1a1a2e] mb-1">
                O teu feedback ainda não está disponível.
              </p>
              <p className="text-sm">Volta mais tarde após a avaliação da formadora.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {student.feedback && (
                <section>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                    Comentários da Formadora
                  </h2>
                  <div
                    className="print-surface feedback-prose bg-[#f0f4ff] border border-blue-100 rounded-xl px-5 sm:px-6 py-5 text-[0.97rem] leading-relaxed text-[#1a1a2e]"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeFeedbackHtml(student.feedback),
                    }}
                  />
                </section>
              )}

              {hasAllCriteria && (
                <section>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Avaliação por Critérios ({activity.activityTitle})
                    </h2>
                    <span className="text-xs text-slate-500 tabular-nums">
                      Escala 0–10 · Ponderação 100%
                    </span>
                  </div>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {criteria.map((criterion, idx) => {
                      const val = parseScore(student.criterios[idx]) ?? 0;
                      const lvl = getPerformanceLevel(val);
                      return (
                        <div key={criterion.id} className="px-4 py-3.5 bg-white">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm min-w-0">
                              <span className="font-semibold text-[#1a1a2e]">
                                {criterion.number}. {criterion.name}
                              </span>
                              <span className="text-xs text-slate-500 font-mono tabular-nums">
                                ({criterion.weightPercent}%)
                              </span>
                            </div>
                            <div className="font-mono text-sm sm:text-base font-bold text-[#2563eb] tabular-nums whitespace-nowrap shrink-0">
                              {val} / 10
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            <span className="font-semibold text-[#1e40af]">
                              {lvl.label}:
                            </span>{' '}
                            {criterion.descriptors[lvl.key]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <div className="print-only pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
                Relatório de Feedback Individualizado ({activity.shortLabel}) · {student.name} · Gerado em {today}
              </div>

              <div className="no-print pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#f0f4ff] text-[#1e40af] border border-blue-200 rounded-xl text-sm font-semibold hover:bg-[#dbeafe] hover:border-[#2563eb] transition-colors cursor-pointer"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  <span>Imprimir / Guardar como PDF</span>
                </button>
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
