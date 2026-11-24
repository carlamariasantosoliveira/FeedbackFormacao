import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BLUEPRINT_LIMITS,
  clampString,
  fromFirestoreCriteria,
  fromFirestoreObservations,
  generateRandomHexKey,
  hashStudentPassword,
  hashTeacherPassword,
  normalizeActivityType,
  normalizeCriteriaForFirestore,
  normalizeObservationsForFirestore,
} from './feedbackHelpers.ts';

test('hashStudentPassword and hashTeacherPassword produce deterministic 64-char hex digests', async () => {
  const h1 = await hashStudentPassword('Solar34');
  const h2 = await hashStudentPassword('  solar34  ');
  const h3 = await hashStudentPassword('Azul85');
  const t1 = await hashTeacherPassword('formacao*2020');
  const t2 = await hashTeacherPassword('formacao*2020');

  assert.equal(h1, h2);
  assert.notEqual(h1, h3);
  assert.equal(t1, t2);
  assert.match(h1, BLUEPRINT_LIMITS.HASH_PATTERN);
  assert.match(t1, BLUEPRINT_LIMITS.HASH_PATTERN);
});

test('generateRandomHexKey creates valid 64-char hex keys', () => {
  const k1 = generateRandomHexKey();
  const k2 = generateRandomHexKey();
  assert.notEqual(k1, k2);
  assert.match(k1, BLUEPRINT_LIMITS.HASH_PATTERN);
  assert.match(k2, BLUEPRINT_LIMITS.HASH_PATTERN);
});

test('normalizeCriteriaForFirestore and fromFirestoreCriteria round-trip cleanly for both activities', () => {
  const normalizedProjeto = normalizeCriteriaForFirestore([10, '', 8.5, null, 12, -1], 'projeto');
  assert.deepEqual(normalizedProjeto, [10, null, 8.5, null, null, null]);
  assert.deepEqual(fromFirestoreCriteria(normalizedProjeto, 'projeto'), [10, '', 8.5, '', '', '']);

  const normalizedCenario = normalizeCriteriaForFirestore([10, 8, '', 9, 8.5], 'cenario');
  assert.deepEqual(normalizedCenario, [10, 8, null, 9, 8.5]);
  assert.deepEqual(fromFirestoreCriteria(normalizedCenario, 'cenario'), [10, 8, '', 9, 8.5]);
});

test('normalizeObservationsForFirestore and fromFirestoreObservations clamp and preserve per-criterion notes', () => {
  const longNote = 'a'.repeat(BLUEPRINT_LIMITS.OBSERVATION_MAX + 50);
  const normalizedProjeto = normalizeObservationsForFirestore(['  Boa clareza  ', longNote], 'projeto');
  assert.equal(normalizedProjeto.length, 6);
  assert.equal(normalizedProjeto[0], 'Boa clareza');
  assert.equal(normalizedProjeto[1].length, BLUEPRINT_LIMITS.OBSERVATION_MAX);
  assert.equal(normalizedProjeto[5], '');
  assert.deepEqual(fromFirestoreObservations(normalizedProjeto, 'projeto'), normalizedProjeto);

  assert.deepEqual(fromFirestoreObservations(undefined, 'cenario'), ['', '', '', '', '']);
});

test('normalizeActivityType defaults legacy documents to projeto', () => {
  assert.equal(normalizeActivityType(undefined), 'projeto');
  assert.equal(normalizeActivityType(null), 'projeto');
  assert.equal(normalizeActivityType('projeto'), 'projeto');
  assert.equal(normalizeActivityType('cenario'), 'cenario');
});

test('clampString trims and enforces blueprint max length', () => {
  assert.equal(clampString('  Ana  ', 10), 'Ana');
  assert.equal(clampString('abcdef', 4), 'abcd');
});
