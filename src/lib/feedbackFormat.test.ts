import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanPastedFeedbackHtml,
  DEFAULT_FEEDBACK_FONT,
  DEFAULT_FEEDBACK_SIZE,
  normalizeAllowedFontFamily,
  normalizeAllowedFontSize,
  sanitizeInlineStyle,
  uniformizeFeedbackHtml,
} from './feedbackFormat';

test('normalizeAllowedFontFamily maps Calibri and Carlito safely and rejects arbitrary fonts', () => {
  assert.equal(normalizeAllowedFontFamily('Calibri'), DEFAULT_FEEDBACK_FONT);
  assert.equal(normalizeAllowedFontFamily('Calibri, sans-serif'), DEFAULT_FEEDBACK_FONT);
  assert.equal(normalizeAllowedFontFamily('Carlito'), DEFAULT_FEEDBACK_FONT);
  assert.equal(normalizeAllowedFontFamily('"Plus Jakarta Sans", sans-serif'), '"Plus Jakarta Sans", sans-serif');
  assert.equal(normalizeAllowedFontFamily('Comic Sans MS'), null);
});

test('normalizeAllowedFontSize validates px and converts pt safely within 10-32px bounds', () => {
  assert.equal(normalizeAllowedFontSize('14px'), '14px');
  assert.equal(normalizeAllowedFontSize('18px'), '18px');
  assert.equal(normalizeAllowedFontSize('12pt'), '16px');
  assert.equal(normalizeAllowedFontSize('999px'), null);
  assert.equal(normalizeAllowedFontSize('4px'), null);
});

test('sanitizeInlineStyle strips dangerous or extraneous CSS while keeping font-family and font-size', () => {
  assert.equal(
    sanitizeInlineStyle('font-family: Calibri; font-size: 16px; color: red; background: yellow; position: fixed;'),
    'font-family: Calibri, Carlito, sans-serif; font-size: 16px'
  );
  assert.equal(sanitizeInlineStyle('background: url(javascript:alert(1)); font-size: 14px'), '');
  assert.equal(sanitizeInlineStyle('color: #333; margin: 12px;'), '');
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

test('uniformizeFeedbackHtml resets mixed fonts/sizes and wraps cleanly in Calibri 14px', () => {
  const mixed =
    '<div data-uniform="true" style="font-family: Arial; font-size: 20px;"><p><span style="font-size: 18px">Texto</span> <strong>importante</strong></p></div>';
  const out = uniformizeFeedbackHtml(mixed, DEFAULT_FEEDBACK_FONT, '14px');
  assert.equal(
    out,
    '<div data-uniform="true" style="font-family: Calibri, Carlito, sans-serif; font-size: 14px;"><p>Texto <strong>importante</strong></p></div>'
  );
});
