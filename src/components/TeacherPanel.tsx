import { useEffect, useMemo, useRef, useState } from 'react';
import type { ClipboardEvent as ReactClipboardEvent } from 'react';
import {
  AlignLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Database,
  Download,
  Eye,
  KeyRound,
  LogOut,
  Plus,
  Save,
  Search,
  Trash2,
  UserCheck,
} from 'lucide-react';
import type { ActivityType, ScoreInput, StudentRecord } from '../types.ts';
import {
  DEFAULT_FEEDBACK_FONT,
  DEFAULT_FEEDBACK_SIZE,
  FEEDBACK_FONT_OPTIONS,
  FEEDBACK_SIZE_OPTIONS,
  cleanPastedFeedbackHtml,
  uniformizeFeedbackHtml,
} from '../lib/feedbackFormat.ts';
import {
  ACTIVITIES,
  ACTIVITY_ORDER,
  PERFORMANCE_LEVELS,
  calcFinalScore,
  calcPartialWeighted,
  getActivityConfig,
  getInitials,
  getPerformanceLevel,
  parseScore,
  sanitizeFeedbackHtml,
} from '../lib/rubric.ts';
import { AddStudentModal } from './AddStudentModal.tsx';
import { ChangePasswordModal } from './ChangePasswordModal.tsx';
import { ConfirmModal } from './ConfirmModal.tsx';

interface TeacherPanelProps {
  students: StudentRecord[];
  loading?: boolean;
  activeActivity: ActivityType;
  onChangeActivity: (activity: ActivityType) => void;
  selectedId: string | null;
  onSelectStudent: (id: string) => void;
  onAddStudent: (payload: {
    activityType: ActivityType;
    name: string;
    password?: string;
    projectTitle?: string;
    targetAudience?: string;
  }) => Promise<StudentRecord>;
  onSaveFeedback: (
    id: string,
    payload: {
      projectTitle: string;
      targetAudience: string;
      feedback: string;
      criterios: ScoreInput[];
    }
  ) => Promise<StudentRecord>;
  onDeleteStudent: (id: string) => Promise<void>;
  onPreviewStudent: (student: StudentRecord) => void;
  onOpenRubric: (activity: ActivityType) => void;
  onChangeTeacherPassword: (currentPwd: string, newPwd: string) => Promise<void>;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

type FilterTab = 'all' | 'done' | 'pending';

export function TeacherPanel({
  students,
  loading = false,
  activeActivity,
  onChangeActivity,
  selectedId,
  onSelectStudent,
  onAddStudent,
  onSaveFeedback,
  onDeleteStudent,
  onPreviewStudent,
  onOpenRubric,
  onChangeTeacherPassword,
  onLogout,
  onToast,
}: TeacherPanelProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [expandedCritId, setExpandedCritId] = useState<string | null>(null);

  const activityConfig = getActivityConfig(activeActivity);
  const criteria = activityConfig.criteria;

  const countsByActivity = useMemo(
    () => ({
      projeto: students.filter((s) => s.activityType === 'projeto').length,
      cenario: students.filter((s) => s.activityType === 'cenario').length,
    }),
    [students]
  );

  const areaStudents = useMemo(
    () => students.filter((s) => s.activityType === activeActivity),
    [students, activeActivity]
  );

  const selectedStudent = useMemo(
    () => areaStudents.find((s) => s.id === selectedId) || null,
    [areaStudents, selectedId]
  );

  const [projectTitle, setProjectTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [scores, setScores] = useState<ScoreInput[]>(() => criteria.map(() => ''));
  const [editorFont, setEditorFont] = useState(DEFAULT_FEEDBACK_FONT);
  const [editorSize, setEditorSize] = useState(DEFAULT_FEEDBACK_SIZE);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    setExpandedCritId(null);
    if (!selectedStudent) {
      setProjectTitle('');
      setTargetAudience('');
      setScores(criteria.map(() => ''));
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      setDirty(false);
      setCopiedPwd(false);
      return;
    }
    setProjectTitle(selectedStudent.projectTitle || '');
    setTargetAudience(selectedStudent.targetAudience || '');
    const nextScores: ScoreInput[] = criteria.map((_, idx) => {
      const val = selectedStudent.criterios?.[idx];
      return val === undefined || val === null ? '' : val;
    });
    setScores(nextScores);
    if (editorRef.current) {
      editorRef.current.innerHTML = selectedStudent.feedback || '';
    }
    setDirty(false);
    setCopiedPwd(false);
  }, [selectedStudent?.id, activeActivity, criteria]);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return areaStudents.filter((s) => {
      const hasFeedback = Boolean(s.feedback || s.nota);
      if (filter === 'done' && !hasFeedback) return false;
      if (filter === 'pending' && hasFeedback) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.projectTitle.toLowerCase().includes(q) ||
        s.targetAudience.toLowerCase().includes(q) ||
        s.password.toLowerCase().includes(q)
      );
    });
  }, [areaStudents, search, filter]);

  const stats = useMemo(() => {
    const total = areaStudents.length;
    const done = areaStudents.filter((s) => Boolean(s.feedback || s.nota)).length;
    return { total, done, pending: total - done };
  }, [areaStudents]);

  const finalScore = useMemo(
    () => calcFinalScore(scores, activeActivity),
    [scores, activeActivity]
  );
  const partialScore = useMemo(
    () => calcPartialWeighted(scores, activeActivity),
    [scores, activeActivity]
  );
  const filledCount = useMemo(
    () => scores.filter((v) => parseScore(v) !== null).length,
    [scores]
  );

  function saveEditorSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) return;
    const range = sel.getRangeAt(0);
    if (editorRef.current.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }

  function execFormat(command: string) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    saveEditorSelection();
    setDirty(true);
  }

  function applyTextStyle(prop: 'fontFamily' | 'fontSize', value: string, nextFont: string, nextSize: string) {
    const editor = editorRef.current;
    if (!editor) return;

    const sel = window.getSelection();
    let activeRange: Range | null = null;
    if (sel && sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      activeRange = sel.getRangeAt(0);
    } else if (savedRangeRef.current && editor.contains(savedRangeRef.current.commonAncestorContainer)) {
      activeRange = savedRangeRef.current;
    }

    if (activeRange && !activeRange.collapsed) {
      const span = document.createElement('span');
      span.style[prop] = value;
      const fragment = activeRange.extractContents();
      fragment.querySelectorAll('span').forEach((child) => {
        child.style[prop] = '';
      });
      span.appendChild(fragment);
      activeRange.insertNode(span);

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
      savedRangeRef.current = newRange.cloneRange();
      setDirty(true);
      return;
    }

    if (editor.innerHTML.trim()) {
      editor.innerHTML = uniformizeFeedbackHtml(editor.innerHTML, nextFont, nextSize);
      setDirty(true);
      onToast('Formatação aplicada a todo o texto.');
    }
  }

  function handleFontChange(nextFont: string) {
    setEditorFont(nextFont);
    applyTextStyle('fontFamily', nextFont, nextFont, editorSize);
  }

  function handleSizeChange(nextSize: string) {
    setEditorSize(nextSize);
    applyTextStyle('fontSize', nextSize, editorFont, nextSize);
  }

  function handleUniformizeAll() {
    const editor = editorRef.current;
    if (!editor) return;
    if (!editor.innerHTML.trim()) {
      onToast('Escreve ou cola primeiro o feedback para uniformizar.');
      return;
    }
    editor.innerHTML = uniformizeFeedbackHtml(editor.innerHTML, editorFont, editorSize);
    setDirty(true);
    onToast('Texto uniformizado com letra e tamanho iguais.');
  }

  function handleEditorPaste(e: ReactClipboardEvent<HTMLDivElement>) {
    const htmlData = e.clipboardData.getData('text/html');
    const plainData = e.clipboardData.getData('text/plain');
    if (!htmlData && !plainData) return;

    e.preventDefault();
    let toInsert = '';
    if (htmlData) {
      toInsert = cleanPastedFeedbackHtml(htmlData);
    } else {
      const escaped = plainData
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      toInsert = escaped
        .split(/\r?\n/)
        .map((line) => (line.trim() ? `<p>${line}</p>` : '<p><br></p>'))
        .join('');
    }
    document.execCommand('insertHTML', false, toInsert);
    saveEditorSelection();
    setDirty(true);
  }

  function insertTemplate() {
    if (!editorRef.current) return;
    const currentText = editorRef.current.innerText.trim();
    if (!currentText) {
      editorRef.current.innerHTML = uniformizeFeedbackHtml(
        activityConfig.templateHtml,
        editorFont,
        editorSize
      );
    } else {
      editorRef.current.innerHTML = `${editorRef.current.innerHTML}<br>${activityConfig.templateHtml}`;
    }
    setDirty(true);
    onToast('Estrutura de feedback inserida.');
  }

  function updateScore(index: number, raw: string) {
    setScores((prev) => {
      const next = [...prev];
      if (raw === '') {
        next[index] = '';
      } else {
        const num = Number(raw);
        if (Number.isFinite(num)) {
          next[index] = Math.max(0, Math.min(10, num));
        }
      }
      return next;
    });
    setDirty(true);
  }

  function setQuickScore(index: number, value: number) {
    setScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setDirty(true);
  }

  async function handleSave(): Promise<StudentRecord | null> {
    if (!selectedStudent) return null;
    setSaving(true);
    try {
      const html = sanitizeFeedbackHtml(editorRef.current?.innerHTML || '');
      const updated = await onSaveFeedback(selectedStudent.id, {
        projectTitle,
        targetAudience,
        feedback: html,
        criterios: scores,
      });
      setDirty(false);
      onToast('Feedback e avaliação guardados na base de dados.');
      return updated;
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Erro ao guardar.');
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handlePreview() {
    const saved = await handleSave();
    if (saved) {
      onPreviewStudent(saved);
    }
  }

  async function handleCopyPassword(pwd: string) {
    try {
      await navigator.clipboard.writeText(pwd);
      setCopiedPwd(true);
      onToast('Password copiada.');
      setTimeout(() => setCopiedPwd(false), 2000);
    } catch {
      onToast(`Password: ${pwd}`);
    }
  }

  function handleExportCsv() {
    const headers = [
      'Nome',
      activityConfig.titleFieldLabel,
      activityConfig.audienceShortLabel,
      'Password',
      ...criteria.map((c) => `${c.number}. ${c.name} (${c.weightPercent}%)`),
      'Nota Final (0-10)',
    ];
    const rows = areaStudents.map((s) => [
      s.name,
      s.projectTitle,
      s.targetAudience,
      s.password,
      ...criteria.map((_, i) => (s.criterios?.[i] ?? '').toString()),
      s.nota || '',
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avaliacoes-${activityConfig.csvSlug}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Ficheiro CSV exportado.');
  }

  async function confirmDelete() {
    if (!selectedStudent) return;
    setDeleting(true);
    try {
      await onDeleteStudent(selectedStudent.id);
      setDeleteConfirmOpen(false);
      onToast('Formando removido da base de dados.');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Erro ao remover.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFF]">
      {/* Top Bar Contract: Brand — Nav Links — Primary Action */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 sm:gap-8 px-4 sm:px-8 py-3.5 border-b border-blue-100 bg-white/95 backdrop-blur-md">
        <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#0B3B8C] whitespace-nowrap shrink-0">
          FeedbackPrivado
        </span>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onOpenRubric(activeActivity)}
            className="inline-flex items-center gap-1.5 hover:text-[#0B3B8C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>Critérios</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 hover:text-[#0B3B8C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Exportar CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setPwdModalOpen(true)}
            className="inline-flex items-center gap-1.5 hover:text-[#0B3B8C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            <span>Password</span>
          </button>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenRubric(activeActivity)}
            aria-label="Ver critérios de avaliação"
            title="Critérios"
            className="md:hidden p-2 text-slate-600 hover:text-[#0B3B8C] border border-blue-100 rounded-lg cursor-pointer"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            aria-label="Exportar CSV"
            title="Exportar CSV"
            className="md:hidden p-2 text-slate-600 hover:text-[#0B3B8C] border border-blue-100 rounded-lg cursor-pointer"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPwdModalOpen(true)}
            aria-label="Alterar password do formador"
            title="Alterar Password"
            className="md:hidden p-2 text-slate-600 hover:text-[#0B3B8C] border border-blue-100 rounded-lg cursor-pointer"
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F2D6B] border border-blue-100 rounded-xl hover:bg-blue-50/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Two Work Areas Bar */}
      <div className="border-b border-blue-100 bg-gradient-to-r from-[#F0F6FF] via-[#F5F7FF] to-[#F5F0FF] px-4 sm:px-8 py-3">
        <div
          role="tablist"
          aria-label="Áreas de avaliação"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl"
        >
          {ACTIVITY_ORDER.map((actId, idx) => {
            const cfg = ACTIVITIES[actId];
            const active = activeActivity === actId;
            const count = countsByActivity[actId];
            const isCenario = actId === 'cenario';
            return (
              <button
                key={actId}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  if (actId !== activeActivity) {
                    setSearch('');
                    setFilter('all');
                    onChangeActivity(actId);
                  }
                }}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  active
                    ? isCenario
                      ? 'bg-gradient-to-r from-[#6A2BE2] to-[#8B5CF6] border-white text-white shadow-[0_8px_22px_rgba(124,58,237,0.25)]'
                      : 'bg-gradient-to-r from-[#0041A8] to-[#0894EB] border-white text-white shadow-[0_8px_22px_rgba(4,100,217,0.24)]'
                    : 'bg-white/85 border-blue-100 text-[#0F2D6B] hover:bg-white'
                }`}
              >
                <div className="min-w-0">
                  <div
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      active
                        ? 'text-white/85'
                        : isCenario
                          ? 'text-[#7C3AED]'
                          : 'text-[#0464D9]'
                    }`}
                  >
                    Área {idx + 1} · {cfg.criteria.length} critérios
                  </div>
                  <div className="text-sm font-bold truncate">{cfg.activityTitle}</div>
                </div>
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg tabular-nums shrink-0 ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[324px_1fr] bg-white">
        {/* Sidebar */}
        <aside className="border-b lg:border-b-0 lg:border-r border-blue-100 bg-[#F8FBFF] p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold uppercase tracking-wider">Formandos ({stats.total})</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Cloud Ativa</span>
            </span>
          </div>

          <div className="relative">
            <Search
              className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Procurar formando..."
              aria-label="Procurar formando"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-blue-100 rounded-xl outline-none focus:border-[#0464D9]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg text-[11.5px] font-medium">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 px-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap text-center ${
                filter === 'all'
                  ? 'bg-white text-[#1a1a2e] shadow-xs'
                  : 'text-slate-600 hover:text-[#1a1a2e]'
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilter('done')}
              className={`flex-1 py-1.5 px-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap text-center ${
                filter === 'done'
                  ? 'bg-white text-[#1a1a2e] shadow-xs'
                  : 'text-slate-600 hover:text-[#1a1a2e]'
              }`}
            >
              Feitos ({stats.done})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`flex-1 py-1.5 px-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap text-center ${
                filter === 'pending'
                  ? 'bg-white text-[#1a1a2e] shadow-xs'
                  : 'text-slate-600 hover:text-[#1a1a2e]'
              }`}
            >
              Falta ({stats.pending})
            </button>
          </div>

          <div className="space-y-1 max-h-[260px] lg:max-h-[calc(100vh-370px)] overflow-y-auto pr-0.5">
            {loading && students.length === 0 ? (
              <p className="text-xs text-slate-500 px-2 py-4 text-center leading-relaxed">
                A sincronizar formandos na nuvem...
              </p>
            ) : filteredStudents.length === 0 ? (
              <p className="text-xs text-slate-500 px-2 py-4 text-center leading-relaxed">
                {areaStudents.length === 0
                  ? `Ainda não existem formandos em ${activityConfig.shortLabel}. Adiciona o primeiro abaixo.`
                  : 'Nenhum formando corresponde ao filtro.'}
              </p>
            ) : (
              filteredStudents.map((s) => {
                const isSelected = s.id === selectedId;
                const hasFeedback = Boolean(s.feedback || s.nota);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectStudent(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-100/80 text-[#1a1a2e]'
                        : 'hover:bg-blue-50/70 text-[#1a1a2e]'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-full bg-[#dbeafe] text-[#1e3a8a] flex items-center justify-center text-xs font-semibold shrink-0">
                      {getInitials(s.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                        {hasFeedback ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                        )}
                        <span className="truncate">
                          {hasFeedback
                            ? s.nota
                              ? `Avaliado · ${s.nota}/10`
                              : 'Com feedback'
                            : 'Sem feedback'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-blue-50/40 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Adicionar Formando</span>
          </button>
        </aside>

        {/* Main Workspace */}
        <main className="p-5 sm:p-8 lg:p-10 overflow-y-auto bg-white">
          {!selectedStudent ? (
            <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center text-slate-500 max-w-md mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#f0f4ff] text-[#2563eb] flex items-center justify-center mb-4">
                <UserCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#1a1a2e] mb-2">
                {areaStudents.length === 0
                  ? `Área: ${activityConfig.activityTitle}`
                  : 'Seleciona um formando'}
              </h2>
              <p className="text-sm leading-relaxed mb-5">
                {areaStudents.length === 0
                  ? `Ainda não existem trabalhos registados em ${activityConfig.activityTitle}. Adiciona o primeiro formando para iniciar a avaliação com os ${criteria.length} critérios desta atividade.`
                  : `Escolhe um formando na lista à esquerda para escrever o feedback individualizado e preencher os ${criteria.length} critérios de ${activityConfig.activityTitle}.`}
              </p>
              {areaStudents.length === 0 && (
                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1a1a2e] rounded-xl hover:bg-[#2d2d4a] transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Adicionar Formando em {activityConfig.shortLabel}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="max-w-4xl space-y-6">
              {/* Student Header & Password */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a2e]">
                    {selectedStudent.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                    <span>Password individual:</span>
                    <span className="inline-flex items-center gap-2 bg-[#f8faff] border border-slate-200 rounded-lg px-3 py-1 font-mono text-sm font-medium text-[#1a1a2e] tracking-wide">
                      <span>{selectedStudent.password}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(selectedStudent.password)}
                        aria-label={`Copiar password de ${selectedStudent.name}`}
                        className="text-slate-500 hover:text-[#2563eb] transition-colors cursor-pointer"
                      >
                        {copiedPwd ? (
                          <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                        ) : (
                          <Copy className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </span>
                    {dirty && (
                      <span className="text-xs font-medium text-amber-700">
                        · Alterações por guardar
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePreview}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1a1a2e] border border-slate-200 rounded-lg hover:bg-[#f8faff] transition-colors cursor-pointer"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    <span>Pré-visualizar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#1a1a2e] rounded-lg hover:bg-[#2d2d4a] transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                    <span>{saving ? 'A guardar...' : 'Guardar Feedback'}</span>
                  </button>
                </div>
              </div>

              {/* Project / Scenario Identification Metadata */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#fafbff] border border-slate-200 rounded-2xl p-5">
                <div>
                  <label
                    htmlFor="edit-project-title"
                    className="block text-xs font-medium text-slate-600 mb-1.5"
                  >
                    {activityConfig.titleFieldLabel}
                  </label>
                  <input
                    id="edit-project-title"
                    type="text"
                    value={projectTitle}
                    onChange={(e) => {
                      setProjectTitle(e.target.value);
                      setDirty(true);
                    }}
                    placeholder={activityConfig.titlePlaceholder}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-target-audience"
                    className="block text-xs font-medium text-slate-600 mb-1.5"
                  >
                    {activityConfig.audienceFieldLabel}
                  </label>
                  <input
                    id="edit-target-audience"
                    type="text"
                    value={targetAudience}
                    onChange={(e) => {
                      setTargetAudience(e.target.value);
                      setDirty(true);
                    }}
                    placeholder={activityConfig.audiencePlaceholder}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
                  />
                </div>
              </section>

              {/* Rich Comments Card */}
              <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h2 className="font-sans text-base font-semibold text-[#1a1a2e]">
                    Comentários e Feedback Individualizado
                  </h2>
                  <button
                    type="button"
                    onClick={insertTemplate}
                    className="text-xs font-medium text-[#2563eb] hover:underline cursor-pointer"
                  >
                    + Inserir estrutura orientadora
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#f8faff] border border-slate-200 border-b-0 rounded-t-xl">
                  <label htmlFor="feedback-font-select" className="sr-only">
                    Tipo de letra
                  </label>
                  <select
                    id="feedback-font-select"
                    aria-label="Tipo de letra"
                    value={editorFont}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="px-2.5 py-1 text-xs font-medium text-[#1a1a2e] bg-white border border-slate-200 rounded-md outline-none focus:border-[#0464D9] cursor-pointer"
                    title="Tipo de letra (aplica à seleção ou a todo o texto)"
                  >
                    {FEEDBACK_FONT_OPTIONS.map((font) => (
                      <option key={font.id} value={font.cssValue}>
                        {font.label}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="feedback-size-select" className="sr-only">
                    Tamanho da letra
                  </label>
                  <select
                    id="feedback-size-select"
                    aria-label="Tamanho da letra"
                    value={editorSize}
                    onChange={(e) => handleSizeChange(e.target.value)}
                    className="px-2 py-1 text-xs font-medium text-[#1a1a2e] bg-white border border-slate-200 rounded-md outline-none focus:border-[#0464D9] cursor-pointer tabular-nums"
                    title="Tamanho da letra (aplica à seleção ou a todo o texto)"
                  >
                    {FEEDBACK_SIZE_OPTIONS.map((sz) => (
                      <option key={sz.value} value={sz.value}>
                        {sz.label}
                      </option>
                    ))}
                  </select>

                  <span className="w-px h-5 bg-slate-200 mx-0.5" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={() => execFormat('bold')}
                    className="px-2.5 py-1 text-sm font-bold text-[#1a1a2e] rounded-md hover:bg-slate-200/70 cursor-pointer"
                    title="Negrito"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => execFormat('italic')}
                    className="px-2.5 py-1 text-sm italic font-serif text-[#1a1a2e] rounded-md hover:bg-slate-200/70 cursor-pointer"
                    title="Itálico"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => execFormat('underline')}
                    className="px-2.5 py-1 text-sm underline text-[#1a1a2e] rounded-md hover:bg-slate-200/70 cursor-pointer"
                    title="Sublinhado"
                  >
                    U
                  </button>
                  <span className="w-px h-5 bg-slate-200 mx-0.5" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => execFormat('insertUnorderedList')}
                    className="px-2.5 py-1 text-xs font-medium text-[#1a1a2e] rounded-md hover:bg-slate-200/70 cursor-pointer whitespace-nowrap"
                    title="Lista com marcadores"
                  >
                    • Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => execFormat('insertOrderedList')}
                    className="px-2.5 py-1 text-xs font-medium text-[#1a1a2e] rounded-md hover:bg-slate-200/70 cursor-pointer whitespace-nowrap"
                    title="Lista numerada"
                  >
                    1. Lista
                  </button>

                  <button
                    type="button"
                    onClick={handleUniformizeAll}
                    className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0464D9] bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap"
                    title="Limpa formatações misturadas e aplica a letra e o tamanho selecionados a todo o texto"
                  >
                    <AlignLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Uniformizar texto</span>
                  </button>
                </div>

                <div
                  ref={editorRef}
                  role="textbox"
                  aria-multiline="true"
                  aria-label="Comentários de feedback"
                  contentEditable
                  suppressContentEditableWarning
                  data-placeholder={activityConfig.feedbackPlaceholder}
                  style={{ fontFamily: editorFont, fontSize: editorSize }}
                  onInput={() => {
                    saveEditorSelection();
                    setDirty(true);
                  }}
                  onMouseUp={saveEditorSelection}
                  onKeyUp={saveEditorSelection}
                  onPaste={handleEditorPaste}
                  className="rich-editor min-h-[180px] px-4 py-3.5 border border-slate-200 rounded-b-xl leading-relaxed text-[#1a1a2e] bg-white outline-none focus:border-[#0464D9] feedback-prose"
                />
              </section>

              {/* Criteria Rubric Evaluation Card */}
              <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-sans text-base font-semibold text-[#1a1a2e]">
                      Avaliação por Critérios — {activityConfig.activityTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Classificação de 0 a 10 valores · {filledCount}/{criteria.length} critérios preenchidos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenRubric(activeActivity)}
                    className="text-xs font-medium text-[#2563eb] hover:underline cursor-pointer"
                  >
                    Ver matriz completa
                  </button>
                </div>

                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                  {criteria.map((criterion, index) => {
                    const scoreVal = parseScore(scores[index]);
                    const activeLevel =
                      scoreVal !== null ? getPerformanceLevel(scoreVal) : null;
                    const isExpanded = expandedCritId === criterion.id;

                    return (
                      <div key={criterion.id} className="p-4 bg-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#1a1a2e]">
                                {criterion.number}. {criterion.name}
                              </span>
                              <span className="font-mono text-xs text-slate-500 tabular-nums shrink-0">
                                · {criterion.weightPercent}%
                              </span>
                            </div>

                            {activeLevel && (
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                <span className="font-semibold text-[#1e40af]">
                                  {activeLevel.label} ({activeLevel.range}):
                                </span>{' '}
                                {criterion.descriptors[activeLevel.key]}
                              </p>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedCritId(isExpanded ? null : criterion.id)
                              }
                              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#2563eb] mt-1.5 cursor-pointer"
                            >
                              <span>
                                {isExpanded ? 'Ocultar descritores' : 'Ver descritores do critério'}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <div
                              className="inline-flex items-center gap-1 p-1 bg-[#f8faff] border border-slate-200 rounded-lg"
                              role="group"
                              aria-label={`Níveis rápidos para ${criterion.name}`}
                            >
                              {PERFORMANCE_LEVELS.map((lvl) => {
                                const isMatch = activeLevel?.key === lvl.key;
                                return (
                                  <button
                                    key={lvl.key}
                                    type="button"
                                    onClick={() => setQuickScore(index, lvl.suggestedScore)}
                                    title={`${lvl.label} (${lvl.range}): ${criterion.descriptors[lvl.key]}`}
                                    className={`px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                                      isMatch
                                        ? 'bg-[#2563eb] text-white'
                                        : 'text-slate-600 hover:bg-white hover:text-[#1a1a2e]'
                                    }`}
                                  >
                                    {lvl.label}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <label htmlFor={`crit-input-${index}`} className="sr-only">
                                Classificação para {criterion.name}
                              </label>
                              <input
                                id={`crit-input-${index}`}
                                type="number"
                                min={0}
                                max={10}
                                step={0.5}
                                value={scores[index] === null ? '' : scores[index]}
                                onChange={(e) => updateScore(index, e.target.value)}
                                placeholder="0–10"
                                className="w-20 px-2.5 py-1.5 text-center font-mono text-sm font-medium border border-slate-200 rounded-lg outline-none focus:border-[#2563eb] tabular-nums"
                              />
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            {PERFORMANCE_LEVELS.map((lvl) => (
                              <button
                                key={lvl.key}
                                type="button"
                                onClick={() => setQuickScore(index, lvl.suggestedScore)}
                                className={`text-left p-2.5 rounded-lg border transition-colors cursor-pointer ${
                                  activeLevel?.key === lvl.key
                                    ? 'bg-[#f0f4ff] border-[#2563eb]'
                                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="font-semibold text-[#1a1a2e] mb-0.5">
                                  {lvl.label} ({lvl.range})
                                </div>
                                <div className="text-slate-600 leading-relaxed">
                                  {criterion.descriptors[lvl.key]}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Final Grade Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-[#f0f4ff] border border-blue-200/80 rounded-xl">
                  <div>
                    <div className="text-sm font-semibold text-[#1a1a2e]">Nota Final Ponderada</div>
                    <div className="text-xs text-slate-600">
                      {finalScore !== null
                        ? `Nível global: ${getPerformanceLevel(Number(finalScore)).label}`
                        : `Soma parcial atual: ${partialScore.toFixed(2)} / 10 (preenche os ${criteria.length} critérios para concluir)`}
                    </div>
                  </div>
                  <div
                    data-testid="nota-final-display"
                    className="font-display text-2xl font-bold text-[#1e40af] tabular-nums"
                  >
                    {finalScore !== null ? `${finalScore} / 10` : '— / 10'}
                  </div>
                </div>
              </section>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1a1a2e] rounded-xl hover:bg-[#2d2d4a] transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                    <span>{saving ? 'A guardar...' : 'Guardar Feedback'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePreview}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#1a1a2e] border border-slate-200 rounded-xl hover:bg-[#f8faff] transition-colors cursor-pointer"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    <span>Pré-visualizar</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#9b2226] bg-[#fde8e8] border border-[#f5c6c6] rounded-xl hover:bg-[#fbd5d5] transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>Remover</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <AddStudentModal
        open={addModalOpen}
        activityType={activeActivity}
        onClose={() => setAddModalOpen(false)}
        onAdd={async (payload) => {
          const created = await onAddStudent(payload);
          onToast(`${created.name} adicionado/a! Password: ${created.password}`);
        }}
      />

      <ChangePasswordModal
        open={pwdModalOpen}
        onClose={() => setPwdModalOpen(false)}
        onChangePassword={async (cur, next) => {
          await onChangeTeacherPassword(cur, next);
          onToast('Password do formador atualizada.');
        }}
      />

      <ConfirmModal
        open={deleteConfirmOpen}
        title="Remover Formando"
        message={
          selectedStudent
            ? `Tens a certeza que queres remover ${selectedStudent.name} e todo o seu feedback da base de dados? Esta ação não pode ser anulada.`
            : ''
        }
        confirmLabel="Sim, remover"
        busy={deleting}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
