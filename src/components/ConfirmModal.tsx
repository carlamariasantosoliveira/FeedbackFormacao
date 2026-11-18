interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
  busy = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-[400px] p-7 shadow-2xl">
        <h3 id="confirm-modal-title" className="font-display text-xl font-bold text-[#1a1a2e] mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#1a1a2e] border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-[#9b2226] bg-[#fde8e8] border border-[#f5c6c6] rounded-lg hover:bg-[#fbd5d5] disabled:opacity-60 cursor-pointer"
          >
            {busy ? 'A remover...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
