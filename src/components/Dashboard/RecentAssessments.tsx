import React from 'react';
import type { RiskAssessment } from '../../types/risk';
import { SeverityBadge } from '../common/Badge';
import { Clock, Mic, FileText, ChevronRight, Activity } from 'lucide-react';

interface RecentAssessmentsProps {
  assessments: RiskAssessment[];
  onSelectAssessment: (assessment: RiskAssessment) => void;
  onNewAssessment: () => void;
}

export const RecentAssessments: React.FC<RecentAssessmentsProps> = ({
  assessments,
  onSelectAssessment,
  onNewAssessment
}) => {
  const formatTime = (ts: number) => {
    const diffHours = (Date.now() - ts) / (1000 * 60 * 60);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Recent Risk Assessments
          </h3>
        </div>
        <button
          onClick={onNewAssessment}
          className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
        >
          + Run Assessment
        </button>
      </div>

      {assessments.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No past assessments found. Run your first update check!
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAssessment(item)}
              className="group cursor-pointer rounded-xl border border-slate-800/80 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70 p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTime(item.timestamp)}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 font-mono">
                    {item.inputMethod === 'voice' ? (
                      <>
                        <Mic className="w-3 h-3 text-sky-400" />
                        <span>Voice</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>Text</span>
                      </>
                    )}
                  </span>

                  <SeverityBadge severity={item.overallLevel} size="sm" />
                </div>

                <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2 leading-relaxed font-sans pr-2">
                  "{item.rawInput}"
                </p>
              </div>

              {/* Right Side: Score & Count */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                <div className="text-left sm:text-right">
                  <div className="text-base font-bold font-mono text-white">
                    {item.overallScore}
                    <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.risks.length} risk{item.risks.length === 1 ? '' : 's'} identified
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 group-hover:text-sky-300 group-hover:bg-slate-800 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
