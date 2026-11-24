import type { ActivityType, StudentPublicRecord } from '../types.ts';
import { getActivityConfig, parseScore } from './rubric.ts';

export type PdfExportScope = 'single' | 'area' | 'all';

export function selectStudentsForPdfExport<T extends StudentPublicRecord>(
  students: readonly T[],
  scope: PdfExportScope,
  options: {
    activeActivity: ActivityType;
    targetStudentId?: string | null;
  }
): T[] {
  if (scope === 'single') {
    if (!options.targetStudentId) return [];
    const found = students.find((s) => s.id === options.targetStudentId);
    return found ? [found] : [];
  }

  if (scope === 'area') {
    return students
      .filter((s) => s.activityType === options.activeActivity)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
  }

  // 'all': group by Projeto first, then Cenário, sorted alphabetically within each area
  return students.slice().sort((a, b) => {
    if (a.activityType !== b.activityType) {
      return a.activityType === 'projeto' ? -1 : 1;
    }
    return a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' });
  });
}

export function buildPdfDocumentTitle(
  scope: PdfExportScope,
  students: readonly StudentPublicRecord[],
  activeActivity: ActivityType
): string {
  const dateStamp = new Date().toISOString().slice(0, 10);
  if (scope === 'single' && students.length === 1) {
    const cleanName = students[0].name.trim().replace(/\s+/g, '-');
    return `Feedback-${cleanName}-${dateStamp}`;
  }
  if (scope === 'area') {
    const cfg = getActivityConfig(activeActivity);
    return `Feedbacks-${cfg.csvSlug}-${dateStamp}`;
  }
  return `Feedbacks-Todos-Formandos-${dateStamp}`;
}

export function hasAnyCriterionData(student: StudentPublicRecord): boolean {
  const hasScore = Array.isArray(student.criterios) && student.criterios.some((v) => parseScore(v) !== null);
  const hasObs =
    Array.isArray(student.criterioObservacoes) &&
    student.criterioObservacoes.some((obs) => typeof obs === 'string' && obs.trim().length > 0);
  return hasScore || hasObs;
}
