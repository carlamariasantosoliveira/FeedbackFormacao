import assert from 'node:assert/strict';
import test from 'node:test';
import type { StudentRecord } from '../types.ts';
import {
  buildPdfDocumentTitle,
  hasAnyCriterionData,
  selectStudentsForPdfExport,
} from './pdfReportHelpers.ts';

function makeStudent(overrides: Partial<StudentRecord>): StudentRecord {
  return {
    id: 'id-1',
    activityType: 'projeto',
    name: 'Ana Ferreira',
    projectTitle: 'Projeto A',
    targetAudience: 'Docentes',
    password: 'Abc12',
    feedback: '',
    criterios: ['', '', '', '', '', ''],
    criterioObservacoes: ['', '', '', '', '', ''],
    nota: '',
    updatedAt: '2026-11-23T00:00:00.000Z',
    ...overrides,
  };
}

test('selectStudentsForPdfExport filters single, area, and all scopes accurately', () => {
  const list = [
    makeStudent({ id: 'c2', activityType: 'cenario', name: 'Zé Silva' }),
    makeStudent({ id: 'p2', activityType: 'projeto', name: 'Bruno Dias' }),
    makeStudent({ id: 'p1', activityType: 'projeto', name: 'Ana Costa' }),
    makeStudent({ id: 'c1', activityType: 'cenario', name: 'Beatriz Lopes' }),
  ];

  assert.deepEqual(
    selectStudentsForPdfExport(list, 'single', { activeActivity: 'projeto', targetStudentId: 'c1' }).map((s) => s.id),
    ['c1']
  );

  assert.deepEqual(
    selectStudentsForPdfExport(list, 'area', { activeActivity: 'projeto' }).map((s) => s.id),
    ['p1', 'p2']
  );

  assert.deepEqual(
    selectStudentsForPdfExport(list, 'all', { activeActivity: 'cenario' }).map((s) => s.id),
    ['p1', 'p2', 'c1', 'c2']
  );
});

test('buildPdfDocumentTitle builds clean descriptive PDF filenames', () => {
  const s = makeStudent({ name: 'Dulce Lopes' });
  assert.match(buildPdfDocumentTitle('single', [s], 'projeto'), /^Feedback-Dulce-Lopes-\d{4}-\d{2}-\d{2}$/);
  assert.match(buildPdfDocumentTitle('area', [s], 'cenario'), /^Feedbacks-cenario-aprendizagem-\d{4}-\d{2}-\d{2}$/);
  assert.match(buildPdfDocumentTitle('all', [s], 'projeto'), /^Feedbacks-Todos-Formandos-\d{4}-\d{2}-\d{2}$/);
});

test('hasAnyCriterionData returns true when either a score or an observation is present', () => {
  assert.equal(hasAnyCriterionData(makeStudent({})), false);
  assert.equal(hasAnyCriterionData(makeStudent({ criterios: [9, '', '', '', '', ''] })), true);
  assert.equal(
    hasAnyCriterionData(makeStudent({ criterioObservacoes: ['', 'Boa fundamentação', '', '', '', ''] })),
    true
  );
});
