import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CRITERIA,
  calcFinalScore,
  calcPartialWeighted,
  generateStudentPassword,
  getInitials,
  getPerformanceLevel,
  sanitizeFeedbackHtml,
} from './rubric.ts';

test('PDF evaluation criteria weights sum exactly to 1.00 (100%)', () => {
  assert.equal(CRITERIA.length, 6);
  const sum = CRITERIA.reduce((acc, c) => acc + c.weight, 0);
  assert.ok(Math.abs(sum - 1.0) < 1e-9, `Expected weight sum 1.0, got ${sum}`);
  assert.deepEqual(
    CRITERIA.map((c) => c.weightPercent),
    [10, 20, 15, 25, 15, 15]
  );
});

test('calcFinalScore returns null for incomplete or invalid scores', () => {
  assert.equal(calcFinalScore([]), null);
  assert.equal(calcFinalScore([10, 10, 10, 10, 10]), null);
  assert.equal(calcFinalScore([10, 10, '', 10, 10, 10]), null);
  assert.equal(calcFinalScore([10, 11, 10, 10, 10, 10]), null);
  assert.equal(calcFinalScore([10, -1, 10, 10, 10, 10]), null);
});

test('calcFinalScore computes exact weighted average on 0–10 scale', () => {
  assert.equal(calcFinalScore([10, 10, 10, 10, 10, 10]), '10.00');
  assert.equal(calcFinalScore([0, 0, 0, 0, 0, 0]), '0.00');
  // 10*0.10 + 8*0.20 + 6*0.15 + 9*0.25 + 7*0.15 + 8*0.15 = 1 + 1.6 + 0.9 + 2.25 + 1.05 + 1.2 = 8.00
  assert.equal(calcFinalScore([10, 8, 6, 9, 7, 8]), '8.00');
  // 9.5*0.10 + 7.5*0.20 + 8*0.15 + 8.5*0.25 + 9*0.15 + 7*0.15 = 0.95 + 1.50 + 1.20 + 2.125 + 1.35 + 1.05 = 8.175 -> 8.18
  assert.equal(calcFinalScore([9.5, 7.5, 8, 8.5, 9, 7]), '8.18');
});

test('calcPartialWeighted handles partial scoring gracefully', () => {
  assert.equal(calcPartialWeighted([10, '', 10]), 2.5);
});

test('getPerformanceLevel maps PDF bands accurately', () => {
  assert.equal(getPerformanceLevel(10).key, 'excelente');
  assert.equal(getPerformanceLevel(9).key, 'bom');
  assert.equal(getPerformanceLevel(7).key, 'bom');
  assert.equal(getPerformanceLevel(6.5).key, 'satisfatorio');
  assert.equal(getPerformanceLevel(1).key, 'satisfatorio');
  assert.equal(getPerformanceLevel(0).key, 'insuficiente');
});

test('sanitizeFeedbackHtml removes scripts and inline event handlers while keeping safe markup', () => {
  const dirty =
    '<p onclick="alert(1)"><b>Pontos Fortes</b></p><script>evil()</script><a href="javascript:alert(2)">link</a>';
  const clean = sanitizeFeedbackHtml(dirty);
  assert.ok(!clean.includes('<script>'));
  assert.ok(!clean.includes('onclick'));
  assert.ok(!clean.includes('javascript:'));
  assert.ok(clean.includes('<b>Pontos Fortes</b>'));
});

test('getInitials and generateStudentPassword format cleanly', () => {
  assert.equal(getInitials('Ana Ferreira'), 'AF');
  assert.equal(getInitials('Maria Cristina Nunes'), 'MC');
  assert.equal(getInitials('  Carlos  '), 'C');
  const pwd = generateStudentPassword();
  assert.match(pwd, /^[A-Za-z]+\d{2}$/);
});
