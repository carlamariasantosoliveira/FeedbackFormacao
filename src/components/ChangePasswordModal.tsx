import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function ChangePasswordModal({
  open,
  onClose,
  onChangePassword,
}: ChangePasswordModalProps) {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setError('');
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currentPwd || !newPwd) {
      setError('Preenche todos os campos.');
      return;
    }
    if (newPwd.trim().length < 4) {
      setError('A nova password deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setError('A confirmação não coincide com a nova password.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onChangePassword(currentPwd, newPwd);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar password.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-pwd-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-[420px] p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3 id="change-pwd-title" className="font-display text-xl font-bold text-[#1a1a2e]">
            Alterar Password do Formador
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
          Atualiza a password de acesso ao painel de avaliação.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="cur-pwd" className="block text-xs font-medium text-slate-600 mb-1.5">
              Password atual
            </label>
            <input
              id="cur-pwd"
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
            />
          </div>
          <div>
            <label htmlFor="next-pwd" className="block text-xs font-medium text-slate-600 mb-1.5">
              Nova password
            </label>
            <input
              id="next-pwd"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
            />
          </div>
          <div>
            <label htmlFor="conf-pwd" className="block text-xs font-medium text-slate-600 mb-1.5">
              Confirmar nova password
            </label>
            <input
              id="conf-pwd"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb]"
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
            {saving ? 'A guardar...' : 'Guardar Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
