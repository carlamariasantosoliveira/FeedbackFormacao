export interface FontOption {
  id: string;
  label: string;
  cssValue: string;
}

export interface FontSizeOption {
  value: string;
  label: string;
}

export const DEFAULT_FEEDBACK_FONT = 'Calibri, Carlito, sans-serif';
export const DEFAULT_FEEDBACK_SIZE = '14px';

export const FEEDBACK_FONT_OPTIONS: readonly FontOption[] = [
  {
    id: 'calibri',
    label: 'Calibri',
    cssValue: 'Calibri, Carlito, sans-serif',
  },
  {
    id: 'sans',
    label: 'Padrão (Sans)',
    cssValue: '"Plus Jakarta Sans", sans-serif',
  },
] as const;

export const FEEDBACK_SIZE_OPTIONS: readonly FontSizeOption[] = [
  { value: '12px', label: '12 px' },
  { value: '14px', label: '14 px' },
  { value: '16px', label: '16 px' },
  { value: '18px', label: '18 px' },
  { value: '20px', label: '20 px' },
] as const;

const SAFE_FONT_FAMILIES = new Map<string, string>([
  ['calibri', 'Calibri, Carlito, sans-serif'],
  ['carlito', 'Calibri, Carlito, sans-serif'],
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
  const pxMatch = /^(\d+(?:\.\d+)?)px$/.exec(trimmed);
  if (pxMatch) {
    const n = Math.round(Number(pxMatch[1]));
    if (n >= 10 && n <= 32) {
      return `${n}px`;
    }
    return null;
  }
  const ptMatch = /^(\d+(?:\.\d+)?)pt$/.exec(trimmed);
  if (ptMatch) {
    const px = Math.round(Number(ptMatch[1]) * (96 / 72));
    if (px >= 10 && px <= 32) {
      return `${px}px`;
    }
  }
  return null;
}

/**
 * Strictly keeps only safe font-family and font-size declarations from an inline style string.
 * Rejects colors, backgrounds, positioning, url(), expression(), and any arbitrary CSS.
 */
export function sanitizeInlineStyle(rawStyle: string): string {
  if (!rawStyle) return '';
  if (/url\s*\(|expression\s*\(|javascript:/i.test(rawStyle)) {
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
      if (safeFont) {
        kept.push(`font-family: ${safeFont}`);
      }
    } else if (prop === 'font-size') {
      const safeSize = normalizeAllowedFontSize(val);
      if (safeSize) {
        kept.push(`font-size: ${safeSize}`);
      }
    }
  }

  return kept.join('; ');
}

/**
 * Cleans HTML pasted from Word, Google Docs, PDFs, or AI chats:
 * strips external fonts/sizes/colors/classes while keeping semantic text structure
 * (paragraphs, line breaks, bold, italic, underline, lists, and safe links).
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

  // Normalize h1-h6 headings pasted from external editors into bold paragraphs
  cleaned = cleaned.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '<p><strong>$1</strong></p>');

  // Unwrap empty <span> wrappers that no longer have attributes
  cleaned = cleaned.replace(/<span>([\s\S]*?)<\/span>/gi, '$1');

  return cleaned.trim();
}

/**
 * Strips all inline font/size overrides inside existing feedback HTML and applies a uniform
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

  // Unwrap outer uniform wrapper if already applied previously so we don't nest wrappers
  stripped = stripped.replace(/^<div[^>]*data-uniform="true"[^>]*>([\s\S]*)<\/div>$/i, '$1').trim();

  // Unwrap redundant nested spans
  let prev = '';
  while (prev !== stripped) {
    prev = stripped;
    stripped = stripped.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  }

  return `<div data-uniform="true" style="font-family: ${safeFont}; font-size: ${safeSize};">${stripped}</div>`;
}
