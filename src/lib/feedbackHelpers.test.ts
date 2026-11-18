import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BLUEPRINT_LIMITS,
  clampString,
  fromFirestoreCriteria,
  generateRandomHexKey,
  hashStudentPassword,
  hashTeacherPassword,
  normalizeCriteriaForFirestore,
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

test('normalizeCriteriaForFirestore and fromFirestoreCriteria round-trip cleanly', () => {
  const normalized = normalizeCriteriaForFirestore([10, '', 8.5, null, 12, -1]);
  assert.deepEqual(normalized, [10, null, 8.5, null, null, null]);

  const restored = fromFirestoreCriteria(normalized);
  assert.deepEqual(restored, [10, '', 8.5, '', '', '']);
});

test('clampString trims and enforces blueprint max length', () => {
  assert.equal(clampString('  Ana  ', 10), 'Ana');
  assert.equal(clampString('abcdef', 4), 'abcd');
});
