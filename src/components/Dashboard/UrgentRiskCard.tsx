import React from 'react';
import type { RegisterItem } from '../../types/risk';
import { CategoryBadge, SeverityBadge } from '../common/Badge';
import { Flame, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface UrgentRiskCardProps {
  urgentRisk: RegisterItem | null;
  onViewRegister: () => void;
  onUpdateStatus?: (id: string, status: 'mitigating' | 'resolved') => void;
}

export const UrgentRiskCard: React.FC<UrgentRiskCardProps> = ({
  urgentRisk,
  onViewRegister,
  onUpdateStatus
}) => {
  if (!urgentRisk) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">No Critical Open Risks</h3>
            <p className="text-xs text-slate-400">All detected high-severity risks have active mitigations or are resolved.</p>
          </div>
        </div>
        <button
          onClick={onViewRegister}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
        >
          View Register <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-900/90 p-6 shadow-xl glow-red">
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            Most Urgent Open Risk
          </span>
          <CategoryBadge category={urgentRisk.category} />
          <SeverityBadge severity={urgentRisk.severity} />
        </div>

        <button
          onClick={onViewRegister}
          className="text-xs text-slate-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>Open in Register</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title & Trigger phrase */}
      <div className="space-y-2 mb-4">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {urgentRisk.title}
        </h3>
        {urgentRisk.detectedPhrase && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-rose-300/90">
            <span className="text-slate-500 font-sans">Trigger signal:</span>
            <span>"{urgentRisk.detectedPhrase}"</span>
          </div>
        )}
      </div>

      {/* Grid: Why it matters & Recommended action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2">
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
          <span className="font-semibold text-rose-300 uppercase tracking-wider text-[10px]">
            Why It Matters
          </span>
          <p className="text-slate-300 leading-relaxed">
            {urgentRisk.whyItMatters}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
          <span className="font-semibold text-sky-300 uppercase tracking-wider text-[10px]">
            Recommended Immediate Action
          </span>
          <p className="text-slate-300 leading-relaxed">
            {urgentRisk.recommendedAction}
          </p>
        </div>
      </div>

      {/* Quick Action footer */}
      {onUpdateStatus && urgentRisk.status === 'open' && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Status: <span className="text-rose-400 font-semibold uppercase">Open</span> — Needs owner assignment
          </span>
          <button
            onClick={() => onUpdateStatus(urgentRisk.id, 'mitigating')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all duration-150"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark as Mitigating</span>
          </button>
        </div>
      )}
    </div>
  );
};
