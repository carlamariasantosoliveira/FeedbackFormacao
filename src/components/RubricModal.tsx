import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { ActivityType } from '../types.ts';
import {
  ACTIVITIES,
  ACTIVITY_ORDER,
  PERFORMANCE_LEVELS,
} from '../lib/rubric.ts';

interface RubricModalProps {
  open: boolean;
  initialActivity?: ActivityType;
  onClose: () => void;
}

export function RubricModal({
  open,
  initialActivity = 'projeto',
  onClose,
}: RubricModalProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(initialActivity);

  useEffect(() => {
    if (open) {
      setSelectedActivity(initialActivity);
    }
  }, [open, initialActivity]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const activeConfig = ACTIVITIES[selectedActivity];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rubric-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[88vh] flex flex-col shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200">
          <div>
            <h2 id="rubric-modal-title" className="font-display text-xl sm:text-2xl font-bold text-[#1a1a2e]">
              Critérios de Avaliação — {activeConfig.activityTitle}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Matriz oficial da atividade ({activeConfig.criteria.length} critérios) · Escala de 0 a 10 valores · Ponderação 100%
            </p>
            <div className="mt-3 inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="tablist" aria-label="Selecionar matriz de critérios">
              {ACTIVITY_ORDER.map((actId) => {
                const cfg = ACTIVITIES[actId];
                const active = selectedActivity === actId;
                return (
                  <button
                    key={actId}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedActivity(actId)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      active
                        ? 'bg-white text-[#1e40af] shadow-xs'
                        : 'text-slate-600 hover:text-[#1a1a2e]'
                    }`}
                  >
                    {cfg.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar critérios de avaliação"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-auto p-6">
          <table className="w-full border-collapse text-sm min-w-[780px]">
            <thead>
              <tr className="bg-[#f0f4ff] text-[#1e3a8a]">
                <th className="text-left p-3.5 font-semibold border border-slate-200 w-48">
                  Critério
                </th>
                {PERFORMANCE_LEVELS.map((lvl) => (
                  <th
                    key={lvl.key}
                    className="text-left p-3.5 font-semibold border border-slate-200"
                  >
                    {lvl.label} ({lvl.range})
                  </th>
                ))}
                <th className="text-center p-3.5 font-semibold border border-slate-200 w-20">
                  Peso
                </th>
              </tr>
            </thead>
            <tbody>
              {activeConfig.criteria.map((c) => (
                <tr key={c.id} className="align-top hover:bg-slate-50/70">
                  <td className="p-3.5 border border-slate-200 font-semibold text-[#1a1a2e]">
                    {c.number}. {c.name}
                  </td>
                  <td className="p-3.5 border border-slate-200 text-slate-700 leading-relaxed">
                    {c.descriptors.excelente}
                  </td>
                  <td className="p-3.5 border border-slate-200 text-slate-700 leading-relaxed">
                    {c.descriptors.bom}
                  </td>
                  <td className="p-3.5 border border-slate-200 text-slate-700 leading-relaxed">
                    {c.descriptors.satisfatorio}
                  </td>
                  <td className="p-3.5 border border-slate-200 text-slate-700 leading-relaxed">
                    {c.descriptors.insuficiente}
                  </td>
                  <td className="p-3.5 border border-slate-200 text-center font-mono font-semibold text-[#1e40af] tabular-nums">
                    {c.weightPercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d4a] transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
