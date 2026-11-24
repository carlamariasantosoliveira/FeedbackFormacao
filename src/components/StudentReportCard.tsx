import { Clock } from 'lucide-react';
import type { StudentPublicRecord } from '../types.ts';
import { hasAnyCriterionData } from '../lib/pdfReportHelpers.ts';
import {
  calcFinalScore,
  getActivityConfig,
  getInitials,
  getPerformanceLevel,
  parseScore,
  sanitizeFeedbackHtml,
} from '../lib/rubric.ts';
import { CourseBrand } from './CourseBrand.tsx';

interface StudentReportCardProps {
  student: StudentPublicRecord;
  pageBreakAfter?: boolean;
  alwaysShowCourseHeader?: boolean;
  alwaysShowFooter?: boolean;
  emptyMessage?: string;
}

export function StudentReportCard({
  student,
  pageBreakAfter = false,
  alwaysShowCourseHeader = false,
  alwaysShowFooter = false,
  emptyMessage = 'O teu feedback ainda não está disponível.',
}: StudentReportCardProps) {
  const activity = getActivityConfig(student.activityType);
  const criteria = activity.criteria;
  const finalScore = calcFinalScore(student.criterios, student.activityType);
  const hasCriterionData = hasAnyCriterionData(student);
  const hasFeedback = Boolean(student.feedback || finalScore !== null || hasCriterionData);
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

  const showCriteriaSection = hasAllCriteria || hasCriterionData;

  return (
    <article
      className={`print-container w-full max-w-[860px] bg-white border border-blue-100 rounded-[24px] p-6 sm:p-10 shadow-[0_18px_48px_rgba(37,99,235,0.08)] ${
        pageBreakAfter ? 'print-page-break' : ''
      }`}
    >
      {/* Course header */}
      <div
        className={`${
          alwaysShowCourseHeader ? 'block' : 'print-only'
        } mb-6 pb-4 border-b border-slate-200`}
      >
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
        <div className="py-12 text-center text-slate-500">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-[#f0f4ff] text-[#2563eb] flex items-center justify-center">
            <Clock className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-base font-medium text-[#1a1a2e] mb-1">{emptyMessage}</p>
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
                className="print-surface feedback-prose bg-[#f0f4ff] border border-blue-100 rounded-xl px-5 sm:px-6 py-5 leading-relaxed text-[#1a1a2e]"
                dangerouslySetInnerHTML={{
                  __html: sanitizeFeedbackHtml(student.feedback),
                }}
              />
            </section>
          )}

          {showCriteriaSection && (
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
                  const val = parseScore(student.criterios[idx]);
                  const lvl = val !== null ? getPerformanceLevel(val) : null;
                  const obs = student.criterioObservacoes?.[idx]?.trim() || '';
                  return (
                    <div key={criterion.id} className="print-avoid-break px-4 py-3.5 bg-white">
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
                          {val !== null ? `${val} / 10` : '— / 10'}
                        </div>
                      </div>
                      {lvl && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          <span className="font-semibold text-[#1e40af]">{lvl.label}:</span>{' '}
                          {criterion.descriptors[lvl.key]}
                        </p>
                      )}
                      {obs && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-[#f8faff] border-l-2 border-[#2563eb] text-xs text-[#1a1a2e] leading-relaxed whitespace-pre-line">
                          <span className="font-semibold text-[#1e40af]">Observação: </span>
                          {obs}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div
            className={`${
              alwaysShowFooter ? 'block' : 'print-only'
            } pt-4 border-t border-slate-200 text-center text-xs text-slate-500`}
          >
            Relatório de Feedback Individualizado ({activity.shortLabel}) · {student.name} · Gerado em{' '}
            {today}
          </div>
        </div>
      )}
    </article>
  );
}
