import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (payload: {
    name: string;
    password?: string;
    projectTitle?: string;
    targetAudience?: string;
  }) => Promise<void>;
}

export function AddStudentModal({ open, onClose, onAdd }: AddStudentModalProps) {
  const [name, setName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setName('');
      setProjectTitle('');
      setTargetAudience('');
      setPassword('');
      setError('');
      setSaving(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Insere o nome do formando.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onAdd({
        name: name.trim(),
        password: password.trim() || undefined,
        projectTitle: projectTitle.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar formando.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-student-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-[460px] p-7 sm:p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3 id="add-student-title" className="font-display text-xl font-bold text-[#1a1a2e]">
            Novo Formando
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Preenche os dados. Se deixares a password vazia, será gerada automaticamente.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="new-student-name" className="block text-xs font-medium text-slate-600 mb-1.5">
              Nome do Formando *
            </label>
            <input
              id="new-student-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ana Ferreira"
              autoFocus
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
            />
          </div>

          <div>
            <label htmlFor="new-student-project" className="block text-xs font-medium text-slate-600 mb-1.5">
              Nome do Projeto de Intervenção (opcional)
            </label>
            <input
              id="new-student-project"
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Ex: Guia de IA para a Biblioteca Escolar"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
            />
          </div>

          <div>
            <label htmlFor="new-student-audience" className="block text-xs font-medium text-slate-600 mb-1.5">
              Público-Alvo (opcional)
            </label>
            <input
              id="new-student-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ex: Direção, Departamentos, Famílias"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
            />
          </div>

          <div>
            <label htmlFor="new-student-pwd" className="block text-xs font-medium text-slate-600 mb-1.5">
              Password personalizada (opcional)
            </label>
            <input
              id="new-student-pwd"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixa vazio para gerar automaticamente"
              className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-[#9b2226] font-medium">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 mt-7">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#1a1a2e] border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#1a1a2e] rounded-lg hover:bg-[#2d2d4a] disabled:opacity-60 cursor-pointer"
          >
            {saving ? 'A adicionar...' : 'Adicionar'}
          </button>
        </div>
      </form>
    </div>
  );
}
