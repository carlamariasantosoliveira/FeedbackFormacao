import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CRITERIA,
  SCENARIO_CRITERIA,
  calcFinalScore,
  calcPartialWeighted,
  generateStudentPassword,
  getInitials,
  getPerformanceLevel,
  sanitizeFeedbackHtml,
} from './rubric.ts';

test('PDF evaluation criteria weights sum exactly to 1.00 (100%) for both activities', () => {
  assert.equal(CRITERIA.length, 6);
  const projectSum = CRITERIA.reduce((acc, c) => acc + c.weight, 0);
  assert.ok(Math.abs(projectSum - 1.0) < 1e-9, `Expected weight sum 1.0, got ${projectSum}`);
  assert.deepEqual(
    CRITERIA.map((c) => c.weightPercent),
    [10, 20, 15, 25, 15, 15]
  );

  assert.equal(SCENARIO_CRITERIA.length, 5);
  const scenarioSum = SCENARIO_CRITERIA.reduce((acc, c) => acc + c.weight, 0);
  assert.ok(Math.abs(scenarioSum - 1.0) < 1e-9, `Expected scenario weight sum 1.0, got ${scenarioSum}`);
  assert.deepEqual(
    SCENARIO_CRITERIA.map((c) => c.weightPercent),
    [10, 20, 10, 20, 40]
  );
});

test('calcFinalScore returns null for incomplete or invalid scores', () => {
  assert.equal(calcFinalScore([]), null);
  assert.equal(calcFinalScore([10, 10, 10, 10, 10]), null);
  assert.equal(calcFinalScore([10, 10, '', 10, 10, 10]), null);
  assert.equal(calcFinalScore([10, 11, 10, 10, 10, 10]), null);
  assert.equal(calcFinalScore([10, -1, 10, 10, 10, 10]), null);
  assert.equal(calcFinalScore([10, 10, 10, 10], 'cenario'), null);
  assert.equal(calcFinalScore([10, 10, '', 10, 10], 'cenario'), null);
});

test('calcFinalScore computes exact weighted average on 0–10 scale for both activities', () => {
  assert.equal(calcFinalScore([10, 10, 10, 10, 10, 10]), '10.00');
  assert.equal(calcFinalScore([0, 0, 0, 0, 0, 0]), '0.00');
  // 10*0.10 + 8*0.20 + 6*0.15 + 9*0.25 + 7*0.15 + 8*0.15 = 8.00
  assert.equal(calcFinalScore([10, 8, 6, 9, 7, 8]), '8.00');
  // 9.5*0.10 + 7.5*0.20 + 8*0.15 + 8.5*0.25 + 9*0.15 + 7*0.15 = 8.175 -> 8.18
  assert.equal(calcFinalScore([9.5, 7.5, 8, 8.5, 9, 7]), '8.18');

  // Cenário: 10*0.10 + 8*0.20 + 10*0.10 + 9*0.20 + 8*0.40 = 1.0 + 1.6 + 1.0 + 1.8 + 3.2 = 8.60
  assert.equal(calcFinalScore([10, 8, 10, 9, 8], 'cenario'), '8.60');
  assert.equal(calcFinalScore([10, 10, 10, 10, 10], 'cenario'), '10.00');
});

test('calcPartialWeighted handles partial scoring gracefully', () => {
  assert.equal(calcPartialWeighted([10, '', 10]), 2.5);
  // Cenário: 10*0.10 + 8*0.40 = 4.20
  assert.equal(calcPartialWeighted([10, '', '', '', 8], 'cenario'), 4.2);
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
