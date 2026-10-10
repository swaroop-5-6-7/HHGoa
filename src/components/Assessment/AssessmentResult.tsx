import React, { useState } from 'react';
import type { RiskAssessment, DetectedRisk, RegisterItem } from '../../types/risk';
import { CategoryBadge, SeverityBadge } from '../common/Badge';
import { 
  AlertTriangle, 
  Check, 
  Copy, 
  PlusCircle, 
  ExternalLink, 
  Zap, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface AssessmentResultProps {
  assessment: RiskAssessment;
  existingRegisterItems: RegisterItem[];
  onAddToRegister: (risk: DetectedRisk) => void;
  onNavigateToRegister: () => void;
}

export const AssessmentResult: React.FC<AssessmentResultProps> = ({
  assessment,
  existingRegisterItems,
  onAddToRegister,
  onNavigateToRegister
}) => {
  const [copied, setCopied] = useState(false);

  // Check which risks are already in register
  const isRiskInRegister = (risk: DetectedRisk) => {
    return existingRegisterItems.some(
      item => item.detectedPhrase.toLowerCase() === risk.detectedPhrase.toLowerCase() ||
              item.title.toLowerCase() === risk.title.toLowerCase()
    );
  };

  const handleCopySummary = () => {
    const lines = [
      `### RiskLens Executive Assessment Briefing`,
      `**Overall Risk Score:** ${assessment.overallScore}/100 (${assessment.overallLevel.toUpperCase()})`,
      `**Evaluated Input:** "${assessment.rawInput}"`,
      '',
      `#### Identified Risks (${assessment.risks.length}):`,
      ...assessment.risks.map((r, i) => (
        `\n${i + 1}. [${r.category.toUpperCase()} - ${r.severity.toUpperCase()}] ${r.title}\n` +
        `- Trigger: "${r.detectedPhrase}"\n` +
        `- Why It Matters: ${r.whyItMatters}\n` +
        `- Next Action: ${r.recommendedAction}`
      )),
      '',
      assessment.compoundingFactors.length > 0 ? `#### Compounding Factors:\n${assessment.compoundingFactors.map(f => `- ${f}`).join('\n')}` : ''
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levelColor = {
    critical: 'text-rose-400 bg-rose-950/20 border-rose-500/40 glow-red',
    high: 'text-amber-400 bg-amber-950/20 border-amber-500/40 glow-amber',
    medium: 'text-sky-400 bg-sky-950/20 border-sky-500/30 glow-blue',
    low: 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30'
  }[assessment.overallLevel];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Overall Score Banner */}
      <div className={`rounded-2xl border p-6 backdrop-blur-md ${levelColor}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                {assessment.overallScore}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Risk Index
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={assessment.overallLevel} size="md" />
                <span className="text-xs font-mono text-slate-400">
                  {assessment.risks.length} threats flagged
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {assessment.overallLevel === 'critical' ? 'Urgent Threat Containment Required' :
                 assessment.overallLevel === 'high' ? 'High Risk Exposure Detected' :
                 assessment.overallLevel === 'medium' ? 'Moderate Risk Friction' :
                 'Operational Baseline Clear'}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Deterministic rule engine identified {assessment.risks.length} distinct vulnerability signals in this update.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all duration-150"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copied ? 'Copied Brief' : 'Copy Brief'}</span>
            </button>
            <button
              onClick={onNavigateToRegister}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-sky-300 bg-sky-950/40 hover:bg-sky-900/40 border border-sky-500/30 transition-all duration-150"
            >
              <span>View Register</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Compounding Multipliers Highlight */}
        {assessment.compoundingFactors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-rose-300 font-semibold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Compounding Multiplier Alert</span>
            </div>
            <div className="space-y-1.5">
              {assessment.compoundingFactors.map((factor, idx) => (
                <div 
                  key={idx}
                  className="px-3.5 py-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200/90 leading-relaxed font-sans"
                >
                  {factor}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Detected Individual Risks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            Detected Risk Vectors & Immediate Next Steps ({assessment.risks.length})
          </h3>
          <span className="text-xs text-slate-400">
            Rule-based deterministic extraction
          </span>
        </div>

        {assessment.risks.length === 0 ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">No Critical Risks Triggered</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              This update does not exhibit keywords for low cash runway, blocked integrations, security oversights, or enterprise churn.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessment.risks.map((risk, index) => {
              const inRegister = isRiskInRegister(risk);

              return (
                <div
                  key={risk.id || index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-all duration-150 space-y-4"
                >
                  {/* Top Bar: Title, Category, Severity & Track Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-slate-500 font-semibold">#{index + 1}</span>
                        <CategoryBadge category={risk.category} />
                        <SeverityBadge severity={risk.severity} />
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {risk.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => !inRegister && onAddToRegister(risk)}
                      disabled={inRegister}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                        inRegister
                          ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 hover:text-white'
                      }`}
                    >
                      {inRegister ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tracked in Register</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
                          <span>Add to Register</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1) What Was Detected */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
                      <span className="uppercase tracking-wider text-[10px] text-sky-400">1. What Was Detected</span>
                      <span>·</span>
                      <span className="font-mono text-slate-500">Heuristic Signal</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono text-rose-300 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-500/20">
                        "{risk.detectedPhrase}"
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">
                      {risk.reasoning}
                    </p>
                  </div>

                  {/* 2 & 3: Why It Matters & Next Action Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    
                    {/* Why It Matters */}
                    <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/70 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>2. Why It Matters</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {risk.whyItMatters}
                      </p>
                    </div>

                    {/* What Team Should Do Next */}
                    <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/70 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-sky-400" />
                        <span>3. What Team Should Do Next</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {risk.recommendedAction}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
