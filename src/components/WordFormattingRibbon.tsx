import { useEffect, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Eraser,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  List,
  ListOrdered,
  Strikethrough,
  Subscript,
  Superscript,
} from 'lucide-react';
import {
  FEEDBACK_FONT_OPTIONS,
  FEEDBACK_SIZE_OPTIONS,
  LINE_SPACING_OPTIONS,
  WORD_HIGHLIGHT_COLORS,
  WORD_STYLE_PRESETS,
  WORD_TEXT_COLORS,
  type TextCaseMode,
  type WordStylePreset,
} from '../lib/feedbackFormat.ts';

interface WordFormattingRibbonProps {
  editorFont: string;
  editorSize: string;
  activeTextColor: string;
  activeHighlightColor: string;
  activeLineSpacing: string;
  onChangeFont: (font: string) => void;
  onChangeSize: (size: string) => void;
  onStepSize: (delta: 1 | -1) => void;
  onTransformCase: (mode: TextCaseMode) => void;
  onClearFormatting: () => void;
  onExecCommand: (command: string, value?: string) => void;
  onApplyTextColor: (color: string) => void;
  onApplyHighlightColor: (color: string) => void;
  onChangeLineSpacing: (spacing: string) => void;
  onApplyStylePreset: (preset: WordStylePreset) => void;
  onUniformizeAll: () => void;
}

export function WordFormattingRibbon({
  editorFont,
  editorSize,
  activeTextColor,
  activeHighlightColor,
  activeLineSpacing,
  onChangeFont,
  onChangeSize,
  onStepSize,
  onTransformCase,
  onClearFormatting,
  onExecCommand,
  onApplyTextColor,
  onApplyHighlightColor,
  onChangeLineSpacing,
  onApplyStylePreset,
  onUniformizeAll,
}: WordFormattingRibbonProps) {
  const [openMenu, setOpenMenu] = useState<'case' | 'textColor' | 'highlight' | 'spacing' | null>(null);
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenu) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (ribbonRef.current && !ribbonRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  return (
    <div
      ref={ribbonRef}
      className="bg-[#F5F8FE] border border-slate-200 border-b-0 rounded-t-xl p-2.5 select-none"
      onMouseDown={(e) => {
        // Keep editor focus intact when clicking toolbar buttons (allow native <select> interaction)
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== 'SELECT' && tag !== 'OPTION') {
          e.preventDefault();
        }
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Top Row: Tipo de Letra + Parágrafo */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-2.5">
          {/* Group 1: Tipo de Letra */}
          <div className="flex flex-col gap-1.5 lg:pr-3 lg:border-r border-slate-200">
            {/* Row 1: Font, Size, A^, Av, Aa, Limpar formatação */}
            <div className="flex flex-wrap items-center gap-1">
              <label htmlFor="word-font-select" className="sr-only">
                Tipo de letra
              </label>
              <select
                id="word-font-select"
                aria-label="Tipo de letra"
                value={editorFont}
                onChange={(e) => onChangeFont(e.target.value)}
                className="h-7 px-2 text-xs font-medium text-[#1a1a2e] bg-white border border-slate-300 rounded-md outline-none focus:border-[#0464D9] cursor-pointer"
                title="Tipo de letra"
              >
                {FEEDBACK_FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.cssValue}>
                    {font.label}
                  </option>
                ))}
              </select>

            <label htmlFor="word-size-select" className="sr-only">
              Tamanho do tipo de letra
            </label>
            <select
              id="word-size-select"
              aria-label="Tamanho do tipo de letra"
              value={editorSize}
              onChange={(e) => onChangeSize(e.target.value)}
              className="h-7 w-14 px-1.5 text-xs font-medium text-[#1a1a2e] bg-white border border-slate-300 rounded-md outline-none focus:border-[#0464D9] cursor-pointer tabular-nums"
              title="Tamanho do tipo de letra"
            >
              {FEEDBACK_SIZE_OPTIONS.map((sz) => (
                <option key={sz.value} value={sz.value}>
                  {sz.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onStepSize(1)}
              aria-label="Aumentar tamanho do tipo de letra"
              title="Aumentar tamanho do tipo de letra"
              className="h-7 px-1.5 text-xs font-bold text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              A<sup className="text-[9px] text-[#0464D9]">▲</sup>
            </button>
            <button
              type="button"
              onClick={() => onStepSize(-1)}
              aria-label="Diminuir tamanho do tipo de letra"
              title="Diminuir tamanho do tipo de letra"
              className="h-7 px-1.5 text-xs font-bold text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              A<sup className="text-[9px] text-[#0464D9]">▼</sup>
            </button>

            {/* Aa Case menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === 'case' ? null : 'case'))}
                aria-label="Maiúsculas e minúsculas"
                title="Maiúsculas e minúsculas (Aa)"
                aria-expanded={openMenu === 'case'}
                className="h-7 px-1.5 inline-flex items-center gap-0.5 text-xs font-semibold text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
              >
                <span>Aa</span>
                <ChevronDown className="h-3 w-3 text-slate-500" aria-hidden="true" />
              </button>
              {openMenu === 'case' && (
                <div className="absolute left-0 top-full mt-1 z-30 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      onTransformCase('sentence');
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-[#1a1a2e] cursor-pointer"
                  >
                    1.ª letra da frase maiúscula
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTransformCase('lower');
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-[#1a1a2e] cursor-pointer"
                  >
                    minúsculas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTransformCase('upper');
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-[#1a1a2e] cursor-pointer"
                  >
                    MAIÚSCULAS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTransformCase('capitalize');
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-[#1a1a2e] cursor-pointer"
                  >
                    Cada Palavra Em Maiúscula
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClearFormatting}
              aria-label="Limpar toda a formatação"
              title="Limpar toda a formatação (volta a Calibri 11)"
              className="h-7 px-1.5 inline-flex items-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <Eraser className="h-3.5 w-3.5 text-[#7C3AED]" aria-hidden="true" />
            </button>
          </div>

          {/* Row 2: N, I, S, abc, x₂, x², Realce, Cor da letra */}
          <div className="flex flex-wrap items-center gap-0.5">
            <button
              type="button"
              onClick={() => onExecCommand('bold')}
              aria-label="Negrito"
              title="Negrito (Ctrl+B)"
              className="h-7 w-7 inline-flex items-center justify-center text-xs font-extrabold text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              N
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('italic')}
              aria-label="Itálico"
              title="Itálico (Ctrl+I)"
              className="h-7 w-7 inline-flex items-center justify-center text-xs italic font-serif font-semibold text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('underline')}
              aria-label="Sublinhado"
              title="Sublinhado (Ctrl+U)"
              className="h-7 w-7 inline-flex items-center justify-center text-xs underline font-semibold text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              S
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('strikeThrough')}
              aria-label="Rasurado"
              title="Rasurado"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <Strikethrough className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('subscript')}
              aria-label="Subscrito"
              title="Subscrito"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <Subscript className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('superscript')}
              aria-label="Sobrescrito"
              title="Sobrescrito"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <Superscript className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" aria-hidden="true" />

            {/* Highlight color picker */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => onApplyHighlightColor(activeHighlightColor === 'transparent' ? '#FEF08A' : activeHighlightColor)}
                aria-label="Cor do realce do texto"
                title="Realçar texto selecionado"
                className="h-7 pl-1.5 pr-1 flex flex-col items-center justify-center rounded-l hover:bg-blue-100/80 transition-colors cursor-pointer"
              >
                <Highlighter className="h-3.5 w-3.5 text-[#1a1a2e]" aria-hidden="true" />
                <span
                  className="w-3.5 h-1 rounded-xs mt-0.5 border border-slate-300"
                  style={{
                    backgroundColor:
                      activeHighlightColor === 'transparent' ? '#FEF08A' : activeHighlightColor,
                  }}
                />
              </button>
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === 'highlight' ? null : 'highlight'))}
                aria-label="Escolher cor do realce"
                aria-expanded={openMenu === 'highlight'}
                className="h-7 px-0.5 rounded-r hover:bg-blue-100/80 cursor-pointer"
              >
                <ChevronDown className="h-3 w-3 text-slate-500" aria-hidden="true" />
              </button>

              {openMenu === 'highlight' && (
                <div className="absolute left-0 top-full mt-1 z-30 w-44 bg-white border border-slate-200 rounded-lg shadow-lg p-2">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Cor do Realce</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {WORD_HIGHLIGHT_COLORS.map((swatch) => (
                      <button
                        key={swatch.value}
                        type="button"
                        onClick={() => {
                          onApplyHighlightColor(swatch.value);
                          setOpenMenu(null);
                        }}
                        title={swatch.label}
                        className="flex items-center justify-center h-6 rounded border border-slate-300 text-[10px] hover:scale-105 transition-transform cursor-pointer"
                        style={{
                          backgroundColor: swatch.value === 'transparent' ? '#ffffff' : swatch.value,
                        }}
                      >
                        {swatch.value === 'transparent' ? 'Sem' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Text color picker */}
            <div className="relative flex items-center ml-0.5">
              <button
                type="button"
                onClick={() => onApplyTextColor(activeTextColor)}
                aria-label="Cor do tipo de letra"
                title="Cor do tipo de letra"
                className="h-7 pl-1.5 pr-1 flex flex-col items-center justify-center rounded-l hover:bg-blue-100/80 transition-colors cursor-pointer"
              >
                <span className="text-xs font-extrabold leading-none text-[#1a1a2e]">A</span>
                <span
                  className="w-3.5 h-1 rounded-xs mt-0.5"
                  style={{ backgroundColor: activeTextColor }}
                />
              </button>
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === 'textColor' ? null : 'textColor'))}
                aria-label="Escolher cor do tipo de letra"
                aria-expanded={openMenu === 'textColor'}
                className="h-7 px-0.5 rounded-r hover:bg-blue-100/80 cursor-pointer"
              >
                <ChevronDown className="h-3 w-3 text-slate-500" aria-hidden="true" />
              </button>

              {openMenu === 'textColor' && (
                <div className="absolute left-0 top-full mt-1 z-30 w-44 bg-white border border-slate-200 rounded-lg shadow-lg p-2">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Cor da Letra</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {WORD_TEXT_COLORS.map((swatch) => (
                      <button
                        key={swatch.value}
                        type="button"
                        onClick={() => {
                          onApplyTextColor(swatch.value);
                          setOpenMenu(null);
                        }}
                        title={swatch.label}
                        aria-label={swatch.label}
                        className="h-6 w-full rounded border border-slate-200 hover:scale-105 transition-transform cursor-pointer"
                        style={{ backgroundColor: swatch.value }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group 2: Parágrafo */}
        <div className="flex flex-col gap-1.5">
          {/* Row 1: Bullets, Numbering, Outdent, Indent, Uniformizar */}
          <div className="flex flex-wrap items-center gap-0.5">
            <button
              type="button"
              onClick={() => onExecCommand('insertUnorderedList')}
              aria-label="Marcas"
              title="Marcas (Lista com pontos)"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('insertOrderedList')}
              aria-label="Numeração"
              title="Numeração (Lista 1, 2, 3)"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <ListOrdered className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('outdent')}
              aria-label="Diminuir avanço"
              title="Diminuir avanço"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <IndentDecrease className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('indent')}
              aria-label="Aumentar avanço"
              title="Aumentar avanço"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <IndentIncrease className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onUniformizeAll}
              className="ml-1 h-7 px-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0464D9] bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap"
              title="Uniformiza todo o texto com a letra e tamanho selecionados"
            >
              <span>Uniformizar</span>
            </button>
          </div>

          {/* Row 2: Align Left, Center, Right, Justify, Line Spacing */}
          <div className="flex flex-wrap items-center gap-0.5">
            <button
              type="button"
              onClick={() => onExecCommand('justifyLeft')}
              aria-label="Alinhar à esquerda"
              title="Alinhar à esquerda"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <AlignLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('justifyCenter')}
              aria-label="Centrar"
              title="Centrar"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <AlignCenter className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('justifyRight')}
              aria-label="Alinhar à direita"
              title="Alinhar à direita"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <AlignRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onExecCommand('justifyFull')}
              aria-label="Justificar"
              title="Justificar"
              className="h-7 w-7 inline-flex items-center justify-center text-[#1a1a2e] rounded hover:bg-blue-100/80 transition-colors cursor-pointer"
            >
              <AlignJustify className="h-4 w-4" aria-hidden="true" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" aria-hidden="true" />

            {/* Espaçamento entre linhas */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === 'spacing' ? null : 'spacing'))}
                aria-label="Espaçamento entre linhas e parágrafos"
                title="Espaçamento entre linhas"
                aria-expanded={openMenu === 'spacing'}
                className="h-7 px-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#1a1a2e] bg-white border border-slate-200 rounded hover:bg-blue-50 transition-colors cursor-pointer tabular-nums"
              >
                <span>↕ {activeLineSpacing.replace('.', ',')}</span>
                <ChevronDown className="h-3 w-3 text-slate-500" aria-hidden="true" />
              </button>
              {openMenu === 'spacing' && (
                <div className="absolute left-0 top-full mt-1 z-30 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-xs">
                  {LINE_SPACING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChangeLineSpacing(opt.value);
                        setOpenMenu(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 cursor-pointer tabular-nums ${
                        activeLineSpacing === opt.value
                          ? 'font-bold text-[#0464D9] bg-blue-50/50'
                          : 'text-[#1a1a2e]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Bottom Row: Group 3 - Estilos rápidos (Normal, Sem Espaç., Cabeçalho 1/2/3, Título, Subtítulo) */}
        <div className="border-t border-slate-200/80 pt-2">
          <div
            role="group"
            aria-label="Estilos de texto"
            className="flex md:grid md:grid-cols-7 items-stretch gap-1.5 overflow-x-auto pb-0.5 md:pb-0"
          >
            {WORD_STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyStylePreset(preset)}
                title={`Aplicar estilo ${preset.label}`}
                className="shrink-0 w-[86px] md:w-auto bg-white border border-slate-200 hover:border-[#0464D9] hover:bg-blue-50/30 rounded-md px-1.5 py-1 flex flex-col items-center justify-between text-center transition-colors cursor-pointer"
              >
                <span
                  className="block w-full truncate leading-tight py-0.5"
                  style={{
                    fontFamily: preset.style.fontFamily,
                    fontSize:
                      preset.id === 'title'
                        ? '15px'
                        : preset.id === 'heading-1'
                          ? '14px'
                          : preset.id === 'heading-2'
                            ? '13px'
                            : '12px',
                    fontWeight: preset.style.fontWeight,
                    fontStyle: preset.style.fontStyle,
                    color: preset.style.color,
                  }}
                >
                  {preset.previewText}
                </span>
                <span className="block w-full truncate text-[10px] text-slate-600 font-medium">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
