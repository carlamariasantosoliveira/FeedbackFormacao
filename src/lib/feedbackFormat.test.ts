import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WORD_STYLE_PRESETS,
  cleanPastedFeedbackHtml,
  DEFAULT_FEEDBACK_FONT,
  normalizeAllowedFontFamily,
  normalizeAllowedFontSize,
  sanitizeInlineStyle,
  stepFontSizePt,
  transformTextCase,
  uniformizeFeedbackHtml,
} from './feedbackFormat';

test('normalizeAllowedFontFamily maps Word fonts safely and rejects arbitrary fonts', () => {
  assert.equal(normalizeAllowedFontFamily('Calibri'), DEFAULT_FEEDBACK_FONT);
  assert.equal(normalizeAllowedFontFamily('Arial'), 'Arial, Arimo, Helvetica, sans-serif');
  assert.equal(normalizeAllowedFontFamily('Times New Roman'), '"Times New Roman", Tinos, Times, serif');
  assert.equal(normalizeAllowedFontFamily('Georgia'), 'Georgia, serif');
  assert.equal(normalizeAllowedFontFamily('Comic Sans MS'), null);
});

test('normalizeAllowedFontSize validates pt and px within safe bounds', () => {
  assert.equal(normalizeAllowedFontSize('11pt'), '11pt');
  assert.equal(normalizeAllowedFontSize('36pt'), '36pt');
  assert.equal(normalizeAllowedFontSize('14px'), '14px');
  assert.equal(normalizeAllowedFontSize('999px'), null);
  assert.equal(normalizeAllowedFontSize('4pt'), null);
});

test('stepFontSizePt increases and decreases along Word pt scale', () => {
  assert.equal(stepFontSizePt('11pt', 1), '12pt');
  assert.equal(stepFontSizePt('11pt', -1), '10pt');
  assert.equal(stepFontSizePt('8pt', -1), '8pt');
  assert.equal(stepFontSizePt('36pt', 1), '36pt');
});

test('transformTextCase formats sentence, lower, upper, and capitalize modes', () => {
  assert.equal(transformTextCase('OLÁ MUNDO. BOM DIA!', 'lower'), 'olá mundo. bom dia!');
  assert.equal(transformTextCase('olá mundo', 'upper'), 'OLÁ MUNDO');
  assert.equal(transformTextCase('olá mundo', 'capitalize'), 'Olá Mundo');
  assert.equal(transformTextCase('OLÁ MUNDO. TUDO BEM?', 'sentence'), 'Olá mundo. Tudo bem?');
});

test('sanitizeInlineStyle keeps safe Word CSS props and drops dangerous/unknown CSS', () => {
  assert.equal(
    sanitizeInlineStyle(
      'font-family: Calibri; font-size: 11pt; color: #1D4ED8; background-color: #FEF08A; text-align: justify; line-height: 1.5; position: fixed;'
    ),
    'font-family: Calibri, Carlito, sans-serif; font-size: 11pt; color: #1D4ED8; background-color: #FEF08A; text-align: justify; line-height: 1.5'
  );
  assert.equal(sanitizeInlineStyle('background: url(javascript:alert(1)); font-size: 11pt'), '');
});

test('cleanPastedFeedbackHtml removes Word/Docs clutter while keeping semantic markup', () => {
  const dirty =
    '<p class="MsoNormal" style="font-family: Times New Roman; font-size: 11pt; color: gray;"><strong>Olá</strong>, <span style="background: yellow;">bom trabalho</span></p><ul><li style="margin: 0;">Ponto 1</li></ul>';
  const cleaned = cleanPastedFeedbackHtml(dirty);
  assert.equal(
    cleaned,
    '<p><strong>Olá</strong>, bom trabalho</p><ul><li>Ponto 1</li></ul>'
  );
});

test('uniformizeFeedbackHtml resets mixed fonts/sizes and wraps cleanly in Calibri 11pt', () => {
  const mixed =
    '<div data-uniform="true" style="font-family: Arial; font-size: 20pt;"><p><span style="font-size: 18pt">Texto</span> <strong>importante</strong></p></div>';
  const out = uniformizeFeedbackHtml(mixed, DEFAULT_FEEDBACK_FONT, '11pt');
  assert.equal(
    out,
    '<div data-uniform="true" style="font-family: Calibri, Carlito, sans-serif; font-size: 11pt;"><p>Texto <strong>importante</strong></p></div>'
  );
});

test('WORD_STYLE_PRESETS includes Normal, Sem Espacamento, Cabeçalho 1-3, Título, and Subtítulo', () => {
  const ids = WORD_STYLE_PRESETS.map((s) => s.id);
  assert.deepEqual(ids, [
    'normal',
    'no-spacing',
    'heading-1',
    'heading-2',
    'heading-3',
    'title',
    'subtitle',
  ]);
});
