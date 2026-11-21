export interface FontOption {
  id: string;
  label: string;
  cssValue: string;
}

export interface FontSizeOption {
  value: string;
  label: string;
}

export interface WordColorSwatch {
  label: string;
  value: string;
}

export interface WordStylePreset {
  id: string;
  label: string;
  previewText: string;
  tag: 'p' | 'h1' | 'h2' | 'h3';
  style: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    lineHeight: string;
    marginBottom: string;
  };
}

export type TextCaseMode = 'sentence' | 'lower' | 'upper' | 'capitalize';

export const DEFAULT_FEEDBACK_FONT = 'Calibri, Carlito, sans-serif';
export const DEFAULT_FEEDBACK_SIZE = '11pt';

export const FEEDBACK_FONT_OPTIONS: readonly FontOption[] = [
  { id: 'calibri', label: 'Calibri', cssValue: 'Calibri, Carlito, sans-serif' },
  { id: 'arial', label: 'Arial', cssValue: 'Arial, Arimo, Helvetica, sans-serif' },
  { id: 'times', label: 'Times New Roman', cssValue: '"Times New Roman", Tinos, Times, serif' },
  { id: 'georgia', label: 'Georgia', cssValue: 'Georgia, serif' },
  { id: 'verdana', label: 'Verdana', cssValue: 'Verdana, sans-serif' },
  { id: 'sans', label: 'Plus Jakarta Sans', cssValue: '"Plus Jakarta Sans", sans-serif' },
] as const;

export const FEEDBACK_SIZE_OPTIONS: readonly FontSizeOption[] = [
  { value: '8pt', label: '8' },
  { value: '9pt', label: '9' },
  { value: '10pt', label: '10' },
  { value: '11pt', label: '11' },
  { value: '12pt', label: '12' },
  { value: '14pt', label: '14' },
  { value: '16pt', label: '16' },
  { value: '18pt', label: '18' },
  { value: '20pt', label: '20' },
  { value: '22pt', label: '22' },
  { value: '24pt', label: '24' },
  { value: '28pt', label: '28' },
  { value: '36pt', label: '36' },
] as const;

export const WORD_TEXT_COLORS: readonly WordColorSwatch[] = [
  { label: 'Automático (Escuro)', value: '#1a1a2e' },
  { label: 'Azul Marinho', value: '#0B3B8C' },
  { label: 'Azul Word', value: '#1D4ED8' },
  { label: 'Roxo', value: '#6D28D9' },
  { label: 'Verde', value: '#15803D' },
  { label: 'Laranja', value: '#C2410C' },
  { label: 'Vermelho', value: '#B91C1C' },
  { label: 'Cinzento', value: '#475569' },
] as const;

export const WORD_HIGHLIGHT_COLORS: readonly WordColorSwatch[] = [
  { label: 'Sem realce', value: 'transparent' },
  { label: 'Amarelo', value: '#FEF08A' },
  { label: 'Verde claro', value: '#BBF7D0' },
  { label: 'Azul claro', value: '#BAE6FD' },
  { label: 'Rosa claro', value: '#FBCFE8' },
  { label: 'Lavanda', value: '#E9D5FF' },
] as const;

export const LINE_SPACING_OPTIONS: readonly { value: string; label: string }[] = [
  { value: '1.0', label: '1,0' },
  { value: '1.15', label: '1,15' },
  { value: '1.5', label: '1,5' },
  { value: '2.0', label: '2,0' },
] as const;

export const WORD_STYLE_PRESETS: readonly WordStylePreset[] = [
  {
    id: 'normal',
    label: 'Normal',
    previewText: 'AaBbCcDd',
    tag: 'p',
    style: {
      fontFamily: DEFAULT_FEEDBACK_FONT,
      fontSize: '11pt',
      fontWeight: '400',
      fontStyle: 'normal',
      color: '#1a1a2e',
      lineHeight: '1.5',
      marginBottom: '8px',
    },
  },
  {
    id: 'no-spacing',
    label: 'Sem Espaç...',
    previewText: 'AaBbCcDd',
    tag: 'p',
    style: {
      fontFamily: DEFAULT_FEEDBACK_FONT,
      fontSize: '11pt',
      fontWeight: '400',
      fontStyle: 'normal',
      color: '#1a1a2e',
      lineHeight: '1.15',
      marginBottom: '0px',
    },
  },
  {
    id: 'heading-1',
    label: 'Cabeçalho 1',
    previewText: 'AaB',
    tag: 'h1',
    style: {
      fontFamily: DEFAULT_FEEDBACK_FONT,
      fontSize: '16pt',
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#0B3B8C',
      lineHeight: '1.25',
      marginBottom: '6px',
    },
  },
  {
    id: 'heading-2',
    label: 'Cabeçalho 2',
    previewText: 'AaBb',
    tag: 'h2',
    style: {
      fontFamily: DEFAULT_FEEDBACK_FONT,
      fontSize: '13pt',
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#1D4ED8',
      lineHeight: '1.3',
      marginBottom: '4px',
    },
  },
  {
    id: 'heading-3',
    label: 'Cabeçalho 3',
    previewText: 'AaBbCcD',
    tag: 'h3',
    style: {
      fontFamily: DEFAULT_FEEDBACK_FONT,
      fontSize: '12pt',
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#3B82F6',
      lineHeight: '1.3',
      marginBottom: '4px',
    },
  },
  {
    id: 'title',
    label: 'Título',
    previewText: 'AaB',
    tag: 'h1',
    style: {
      fontFamily: DEFAULT_FEEDBACK_FONT,
      fontSize: '20pt',
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#0F2D6B',
      lineHeight: '1.2',
      marginBottom: '8px',
    },
  },
  {
    id: 'subtitle',
    label: 'Subtítulo',
    previewText: 'AaBbCc',
    tag: 'p',
    style: {
      fontFamily: DEFAULT_FEEDBACK_FONT,
      fontSize: '12pt',
      fontWeight: '400',
      fontStyle: 'italic',
      color: '#475569',
      lineHeight: '1.4',
      marginBottom: '6px',
    },
  },
] as const;

const SAFE_FONT_FAMILIES = new Map<string, string>([
  ['calibri', 'Calibri, Carlito, sans-serif'],
  ['carlito', 'Calibri, Carlito, sans-serif'],
  ['arial', 'Arial, Arimo, Helvetica, sans-serif'],
  ['arimo', 'Arial, Arimo, Helvetica, sans-serif'],
  ['times new roman', '"Times New Roman", Tinos, Times, serif'],
  ['tinos', '"Times New Roman", Tinos, Times, serif'],
  ['georgia', 'Georgia, serif'],
  ['verdana', 'Verdana, sans-serif'],
  ['plus jakarta sans', '"Plus Jakarta Sans", sans-serif'],
]);

export function normalizeAllowedFontFamily(raw: string): string | null {
  const lowered = raw.toLowerCase();
  for (const [token, canonical] of SAFE_FONT_FAMILIES.entries()) {
    if (lowered.includes(token)) {
      return canonical;
    }
  }
  return null;
}

export function normalizeAllowedFontSize(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  const ptMatch = /^(\d+(?:\.\d+)?)pt$/.exec(trimmed);
  if (ptMatch) {
    const n = Math.round(Number(ptMatch[1]));
    if (n >= 8 && n <= 48) {
      return `${n}pt`;
    }
    return null;
  }
  const pxMatch = /^(\d+(?:\.\d+)?)px$/.exec(trimmed);
  if (pxMatch) {
    const n = Math.round(Number(pxMatch[1]));
    if (n >= 10 && n <= 64) {
      return `${n}px`;
    }
    return null;
  }
  return null;
}

export function stepFontSizePt(currentSize: string, delta: 1 | -1): string {
  const ptSizes = FEEDBACK_SIZE_OPTIONS.map((o) => Number.parseInt(o.value, 10));
  const numeric = Number.parseInt(currentSize, 10);
  const effectivePt = currentSize.endsWith('px')
    ? Math.round(numeric * (72 / 96))
    : Number.isFinite(numeric)
      ? numeric
      : 11;

  if (delta > 0) {
    const next = ptSizes.find((s) => s > effectivePt);
    return `${next ?? ptSizes[ptSizes.length - 1]}pt`;
  }
  const prev = [...ptSizes].reverse().find((s) => s < effectivePt);
  return `${prev ?? ptSizes[0]}pt`;
}

export function transformTextCase(text: string, mode: TextCaseMode): string {
  switch (mode) {
    case 'lower':
      return text.toLocaleLowerCase('pt-PT');
    case 'upper':
      return text.toLocaleUpperCase('pt-PT');
    case 'capitalize':
      return text
        .toLocaleLowerCase('pt-PT')
        .replace(/(^|\s)([^\s])/g, (_m, sep, ch) => `${sep}${ch.toLocaleUpperCase('pt-PT')}`);
    case 'sentence':
    default: {
      const lowered = text.toLocaleLowerCase('pt-PT');
      return lowered.replace(/(^\s*|[.!?]\s+)([^\s])/g, (_m, prefix, ch) => {
        return `${prefix}${ch.toLocaleUpperCase('pt-PT')}`;
      });
    }
  }
}

function sanitizeSafeColor(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.toLowerCase() === 'transparent') return 'transparent';
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return trimmed;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Strictly keeps only safe Word formatting CSS declarations from an inline style string.
 * Rejects positioning, url(), expression(), scripts, and arbitrary CSS.
 */
export function sanitizeInlineStyle(rawStyle: string): string {
  if (!rawStyle) return '';
  if (/url\s*\(|expression\s*\(|javascript:|@import/i.test(rawStyle)) {
    return '';
  }

  const kept: string[] = [];
  const declarations = rawStyle.split(';');
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':');
    if (colonIdx === -1) continue;
    const prop = decl.slice(0, colonIdx).trim().toLowerCase();
    const val = decl.slice(colonIdx + 1).trim();

    if (prop === 'font-family') {
      const safeFont = normalizeAllowedFontFamily(val);
      if (safeFont) kept.push(`font-family: ${safeFont}`);
    } else if (prop === 'font-size') {
      const safeSize = normalizeAllowedFontSize(val);
      if (safeSize) kept.push(`font-size: ${safeSize}`);
    } else if (prop === 'color') {
      const safeColor = sanitizeSafeColor(val);
      if (safeColor) kept.push(`color: ${safeColor}`);
    } else if (prop === 'background-color' || prop === 'background') {
      const safeBg = sanitizeSafeColor(val);
      if (safeBg) kept.push(`background-color: ${safeBg}`);
    } else if (prop === 'text-align') {
      const lowered = val.toLowerCase();
      if (lowered === 'left' || lowered === 'center' || lowered === 'right' || lowered === 'justify') {
        kept.push(`text-align: ${lowered}`);
      }
    } else if (prop === 'line-height') {
      if (/^(?:1(?:\.\d{1,2})?|2(?:\.0{1,2})?)$/.test(val)) {
        kept.push(`line-height: ${val}`);
      }
    } else if (prop === 'margin-bottom' || prop === 'margin-top' || prop === 'padding-left') {
      if (/^\d+(?:\.\d+)?(?:px|pt)$/.test(val)) {
        kept.push(`${prop}: ${val}`);
      }
    } else if (prop === 'font-weight') {
      if (/^(?:normal|bold|400|500|600|700|800)$/.test(val.toLowerCase())) {
        kept.push(`font-weight: ${val.toLowerCase()}`);
      }
    } else if (prop === 'font-style') {
      if (val.toLowerCase() === 'normal' || val.toLowerCase() === 'italic') {
        kept.push(`font-style: ${val.toLowerCase()}`);
      }
    } else if (prop === 'text-decoration' || prop === 'text-decoration-line') {
      const lowered = val.toLowerCase();
      if (lowered === 'none' || lowered === 'underline' || lowered === 'line-through') {
        kept.push(`text-decoration: ${lowered}`);
      }
    }
  }

  return kept.join('; ');
}

/**
 * Cleans HTML pasted from Word, Google Docs, PDFs, or AI chats:
 * strips external fonts/sizes/colors/classes while keeping semantic text structure
 * (paragraphs, headings, line breaks, bold, italic, underline, strikethrough, sub/sup, lists, and safe links).
 */
export function cleanPastedFeedbackHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  let cleaned = rawHtml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<xml[\s\S]*?>[\s\S]*?<\/xml>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<\/?o:p[^>]*>/gi, '')
    .replace(/<\/?w:[^>]*>/gi, '')
    .replace(/<\/?font[^>]*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(?:style|class|id|dir|lang|align|valign|bgcolor|color)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Normalize pasted h4-h6 headings into bold paragraphs
  cleaned = cleaned.replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, '<p><strong>$1</strong></p>');

  // Unwrap empty <span> wrappers that no longer have attributes
  cleaned = cleaned.replace(/<span>([\s\S]*?)<\/span>/gi, '$1');

  return cleaned.trim();
}

/**
 * Strips conflicting inline styles inside existing feedback HTML and applies a uniform
 * font-family and font-size across all content, keeping paragraphs, bold, italic, underline, lists, and links.
 */
export function uniformizeFeedbackHtml(
  rawHtml: string,
  fontFamily: string = DEFAULT_FEEDBACK_FONT,
  fontSize: string = DEFAULT_FEEDBACK_SIZE
): string {
  if (!rawHtml.trim()) return '';

  const safeFont = normalizeAllowedFontFamily(fontFamily) ?? DEFAULT_FEEDBACK_FONT;
  const safeSize = normalizeAllowedFontSize(fontSize) ?? DEFAULT_FEEDBACK_SIZE;

  let stripped = cleanPastedFeedbackHtml(rawHtml);

  // Convert h1-h3 headings inside uniformized content to normal bold paragraphs if needed?
  // Keep h1-h3 tags clean or unwrap only div uniform wrapper so structure remains intact.
  stripped = stripped.replace(/^<div[^>]*data-uniform="true"[^>]*>([\s\S]*)<\/div>$/i, '$1').trim();

  // Unwrap redundant nested spans
  let prev = '';
  while (prev !== stripped) {
    prev = stripped;
    stripped = stripped.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  }

  return `<div data-uniform="true" style="font-family: ${safeFont}; font-size: ${safeSize};">${stripped}</div>`;
}
