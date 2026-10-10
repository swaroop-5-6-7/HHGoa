import React from 'react';
import type { RiskSeverity } from '../../types/risk';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ShieldAlert } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  level: RiskSeverity;
  previousScore?: number;
  onNewAssessment: () => void;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  level,
  previousScore,
  onNewAssessment
}) => {
  // Determine color accents based on level
  const levelConfigs: Record<RiskSeverity, { 
    label: string; 
    color: string; 
    border: string; 
    bg: string;
    description: string;
    icon: typeof AlertTriangle;
  }> = {
    critical: {
      label: 'Critical Risk',
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/20',
      description: 'Multiple compounding threats detected. Engineering delivery or financial solvency is in immediate jeopardy.',
      icon: AlertTriangle
    },
    high: {
      label: 'High Risk',
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/20',
      description: 'Severe operational friction. Milestones or retention at risk without deliberate mitigation this week.',
      icon: AlertTriangle
    },
    medium: {
      label: 'Moderate Risk',
      color: 'text-sky-400',
      border: 'border-sky-500/30',
      bg: 'bg-sky-950/20',
      description: 'Manageable friction points detected. Maintain vigilance on dependencies and sprint scope.',
      icon: ShieldAlert
    },
    low: {
      label: 'Controlled / Low Risk',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      description: 'Standard operating velocity. No critical blockers or acute solvency alarms identified.',
      icon: ShieldAlert
    }
  };

  const config = levelConfigs[level] || levelConfigs.low;
  const Icon = config.icon;

  const scoreDiff = previousScore !== undefined ? score - previousScore : 0;

  // Gauge calculation: 0 to 100 maps to strokeDashoffset on SVG circle
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${config.border} bg-slate-900/60 backdrop-blur-md p-6 shadow-xl`}>
      {/* Background glow */}
      <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
        level === 'critical' ? 'bg-rose-500' : level === 'high' ? 'bg-amber-500' : 'bg-sky-500'
      }`} />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Score & Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 108 108">
              {/* Background circle track */}
              <circle
                cx="54"
                cy="54"
                r="46"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Value circle */}
              <circle
                cx="54"
                cy="54"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className={`transition-all duration-1000 ease-out ${config.color}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                {score}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                / 100
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.color} border ${config.border}`}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </span>

              {previousScore !== undefined && (
                <span className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded ${
                  scoreDiff > 0 
                    ? 'text-rose-400 bg-rose-950/30' 
                    : scoreDiff < 0 
                    ? 'text-emerald-400 bg-emerald-950/30' 
                    : 'text-slate-400 bg-slate-800/40'
                }`}>
                  {scoreDiff > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      +{scoreDiff} pts
                    </>
                  ) : scoreDiff < 0 ? (
                    <>
                      <TrendingDown className="w-3 h-3" />
                      {scoreDiff} pts
                    </>
                  ) : (
                    <>
                      <Minus className="w-3 h-3" />
                      Unchanged
                    </>
                  )}
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Overall Venture Risk Index
            </h2>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action */}
        <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 w-full lg:w-auto">
          <button
            onClick={onNewAssessment}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-sky-400 to-sky-300 hover:from-sky-300 hover:to-sky-200 transition-all duration-200 shadow-md shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-slate-900" />
            <span>Assess New Update</span>
          </button>
          <span className="text-[11px] text-slate-500 hidden sm:block">
            Voice & text input supported
          </span>
        </div>

      </div>
    </div>
  );
};
