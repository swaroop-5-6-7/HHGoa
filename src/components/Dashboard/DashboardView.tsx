import React from 'react';
import type { RiskAssessment, RegisterItem, RiskCategory, RiskSeverity } from '../../types/risk';
import { RiskMeter } from './RiskMeter';
import { UrgentRiskCard } from './UrgentRiskCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { RecentAssessments } from './RecentAssessments';
import { Shield, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface DashboardViewProps {
  assessments: RiskAssessment[];
  registerItems: RegisterItem[];
  onNavigateToAssess: () => void;
  onNavigateToRegister: (categoryFilter?: RiskCategory) => void;
  onSelectAssessment: (assessment: RiskAssessment) => void;
  onUpdateRegisterStatus: (id: string, status: 'mitigating' | 'resolved') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  assessments,
  registerItems,
  onNavigateToAssess,
  onNavigateToRegister,
  onSelectAssessment,
  onUpdateRegisterStatus
}) => {
  // Compute overall score from the latest assessment or aggregate open risks
  const latestAssessment = assessments[0];
  const previousAssessment = assessments[1];

  // Most urgent open risk
  const severityWeight: Record<RiskSeverity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  const openRisks = registerItems.filter(r => r.status !== 'resolved');
  const urgentRisk = [...openRisks].sort((a, b) => {
    const sDiff = severityWeight[b.severity] - severityWeight[a.severity];
    if (sDiff !== 0) return sDiff;
    return b.dateIdentified - a.dateIdentified;
  })[0] || null;

  // Active risk statistics
  const criticalCount = registerItems.filter(r => r.severity === 'critical' && r.status !== 'resolved').length;
  const mitigatingCount = registerItems.filter(r => r.status === 'mitigating').length;
  const resolvedCount = registerItems.filter(r => r.status === 'resolved').length;

  const currentScore = latestAssessment ? latestAssessment.overallScore : (openRisks.length > 0 ? 65 : 15);
  const currentLevel = latestAssessment ? latestAssessment.overallLevel : (criticalCount > 0 ? 'critical' : 'low');
  const prevScore = previousAssessment ? previousAssessment.overallScore : undefined;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header briefing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Founder Risk Radar
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
              Live Heuristics
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hazard detection across delivery bottlenecks, cash runway, and security gates.
          </p>
        </div>

        {/* Quick summary stats strip */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-center gap-2">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-mono font-bold text-rose-300">{criticalCount}</span>
            <span className="text-[11px] text-slate-400">Critical</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">{mitigatingCount}</span>
            <span className="text-[11px] text-slate-400">Mitigating</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300">{resolvedCount}</span>
            <span className="text-[11px] text-slate-400">Resolved</span>
          </div>
        </div>
      </div>

      {/* Part 1: Overall Risk Level */}
      <RiskMeter
        score={currentScore}
        level={currentLevel}
        previousScore={prevScore}
        onNewAssessment={onNavigateToAssess}
      />

      {/* Part 1: Most Urgent Open Risk */}
      <UrgentRiskCard
        urgentRisk={urgentRisk}
        onViewRegister={() => onNavigateToRegister()}
        onUpdateStatus={onUpdateRegisterStatus}
      />

      {/* Part 1: Category Breakdown (The 5 pillars) */}
      <CategoryBreakdown
        registerItems={registerItems}
        onSelectCategory={(category) => onNavigateToRegister(category)}
      />

      {/* Part 1: Short list of recent risk assessments */}
      <RecentAssessments
        assessments={assessments}
        onSelectAssessment={onSelectAssessment}
        onNewAssessment={onNavigateToAssess}
      />

    </div>
  );
};
