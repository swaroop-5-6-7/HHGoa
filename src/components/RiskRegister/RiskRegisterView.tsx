import React, { useState } from 'react';
import type { RegisterItem, RiskCategory, RiskStatus } from '../../types/risk';
import { RiskTable } from './RiskTable';
import { NewRiskModal } from './NewRiskModal';
import { 
  PlusCircle, 
  Layers, 
  AlertOctagon, 
  CheckCircle2, 
  Clock
} from 'lucide-react';

interface RiskRegisterViewProps {
  items: RegisterItem[];
  onAddItem: (item: RegisterItem) => void;
  onUpdateStatus: (id: string, status: RiskStatus) => void;
  onDeleteItem: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
  initialCategoryFilter?: RiskCategory | 'all';
}

export const RiskRegisterView: React.FC<RiskRegisterViewProps> = ({
  items,
  onAddItem,
  onUpdateStatus,
  onDeleteItem,
  onSaveNotes,
  initialCategoryFilter = 'all'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Statistics
  const total = items.length;
  const openCount = items.filter(i => i.status === 'open').length;
  const mitigatingCount = items.filter(i => i.status === 'mitigating').length;
  const resolvedCount = items.filter(i => i.status === 'resolved').length;
  const criticalCount = items.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header & New Risk Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Startup Risk Register
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Central ledger of all flagged threats, mitigations, and ownership status across the 5 venture pillars.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-sky-400 to-sky-300 hover:from-sky-300 hover:to-sky-200 transition-all shadow-md shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-slate-900" />
          <span>Log Custom Risk</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Tracked</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{total}</div>
          <div className="text-[10px] text-slate-500 font-mono">Historical risks</div>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-rose-300 text-xs">
            <span>Open Threats</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300">{openCount}</div>
          <div className="text-[10px] text-rose-400/80 font-mono">{criticalCount} critical level</div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span>In Mitigation</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">{mitigatingCount}</div>
          <div className="text-[10px] text-amber-400/80 font-mono">Mitigation underway</div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-emerald-300 text-xs">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-400/80 font-mono">Successfully closed</div>
        </div>
      </div>

      {/* Main Table View */}
      <RiskTable
        items={items}
        onUpdateStatus={onUpdateStatus}
        onDeleteItem={onDeleteItem}
        onSaveNotes={onSaveNotes}
        initialCategoryFilter={initialCategoryFilter}
      />

      {/* New Risk Modal */}
      <NewRiskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddRisk={onAddItem}
      />

    </div>
  );
};
