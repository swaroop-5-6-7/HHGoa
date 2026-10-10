import React from 'react';
import type { RiskCategory, RegisterItem, RiskSeverity } from '../../types/risk';
import { 
  Truck, 
  DollarSign, 
  ShieldAlert, 
  FileCheck2, 
  Users, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface CategoryBreakdownProps {
  registerItems: RegisterItem[];
  onSelectCategory: (category: RiskCategory) => void;
}

const CATEGORY_META: Record<RiskCategory, {
  name: string;
  icon: React.ReactNode;
  description: string;
  borderColor: string;
  accentBg: string;
}> = {
  delivery: {
    name: 'Delivery',
    icon: <Truck className="w-4 h-4 text-indigo-400" />,
    description: 'Release dates, dependency blockers, and scope creep',
    borderColor: 'border-indigo-500/30',
    accentBg: 'bg-indigo-950/20'
  },
  financial: {
    name: 'Financial',
    icon: <DollarSign className="w-4 h-4 text-amber-400" />,
    description: 'Cash runway, burn velocity, and receivables',
    borderColor: 'border-amber-500/30',
    accentBg: 'bg-amber-950/20'
  },
  security: {
    name: 'Security',
    icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
    description: 'Audits, vulnerability triage, and credentials',
    borderColor: 'border-rose-500/30',
    accentBg: 'bg-rose-950/20'
  },
  compliance: {
    name: 'Compliance',
    icon: <FileCheck2 className="w-4 h-4 text-teal-400" />,
    description: 'GDPR, DPAs, licensing, and regulatory filings',
    borderColor: 'border-teal-500/30',
    accentBg: 'bg-teal-950/20'
  },
  customer: {
    name: 'Customer',
    icon: <Users className="w-4 h-4 text-sky-400" />,
    description: 'Account churn, SLAs, and uptime degradation',
    borderColor: 'border-sky-500/30',
    accentBg: 'bg-sky-950/20'
  }
};

const CATEGORIES: RiskCategory[] = ['delivery', 'financial', 'security', 'compliance', 'customer'];

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  registerItems,
  onSelectCategory
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          5-Pillar Category Breakdown
        </h3>
        <span className="text-xs text-slate-500">
          Click category to inspect in register
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const catRisks = registerItems.filter(r => r.category === cat);
          const activeRisks = catRisks.filter(r => r.status !== 'resolved');
          const resolvedRisks = catRisks.filter(r => r.status === 'resolved');

          // Highest active severity
          let highestSeverity: RiskSeverity | 'none' = 'none';
          if (activeRisks.some(r => r.severity === 'critical')) highestSeverity = 'critical';
          else if (activeRisks.some(r => r.severity === 'high')) highestSeverity = 'high';
          else if (activeRisks.some(r => r.severity === 'medium')) highestSeverity = 'medium';
          else if (activeRisks.some(r => r.severity === 'low')) highestSeverity = 'low';

          // Severity color for dot and border
          const severityPill = {
            critical: 'text-rose-400 bg-rose-950/40 border-rose-500/40',
            high: 'text-amber-400 bg-amber-950/40 border-amber-500/40',
            medium: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
            low: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            none: 'text-slate-500 bg-slate-900 border-slate-800'
          }[highestSeverity];

          const mostUrgentItem = activeRisks[0] || null;

          return (
            <div
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`group cursor-pointer rounded-xl border border-slate-800 hover:${meta.borderColor} bg-slate-900/50 hover:bg-slate-900/80 p-4 transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      {meta.icon}
                    </div>
                    <span className="font-semibold text-sm text-slate-200 group-hover:text-white">
                      {meta.name}
                    </span>
                  </div>

                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${severityPill}`}>
                    {highestSeverity === 'none' ? 'Clear' : highestSeverity}
                  </span>
                </div>

                {/* Counter */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {activeRisks.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    active risk{activeRisks.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      highestSeverity === 'critical' ? 'bg-rose-500' :
                      highestSeverity === 'high' ? 'bg-amber-500' :
                      highestSeverity === 'medium' ? 'bg-sky-400' :
                      activeRisks.length === 0 ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, (activeRisks.length / 3) * 100))}%` }}
                  />
                </div>

                {/* Highlight snippet or clean note */}
                {mostUrgentItem ? (
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    "{mostUrgentItem.title}"
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>No unmitigated flags</span>
                  </div>
                )}
              </div>

              {/* Footer link */}
              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-sky-300">
                <span>{resolvedRisks.length} resolved</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
