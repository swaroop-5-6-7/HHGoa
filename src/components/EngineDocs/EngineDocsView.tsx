import React from 'react';
import { HEURISTIC_RULES, COMPOUNDING_RULES } from '../../engine/heuristics';
import { CategoryBadge, SeverityBadge } from '../common/Badge';
import { ShieldAlert, Cpu, Zap, Code2, CheckCircle2 } from 'lucide-react';

export const EngineDocsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Deterministic Heuristic Engine
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Zero Black Boxes
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            RiskLens does not rely on third-party LLMs or probabilistic AI. Every risk is extracted via transparent, deterministic rule-based heuristics.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span>Local Pattern Matcher</span>
        </div>
      </div>

      {/* Engine Principles Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>1. Deterministic Certainty</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Same input always produces the exact same score. Eliminates stochastic LLM hallucinations and random score drift across sprint meetings.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>2. Compounding Hazards</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Startups fail when multiple risks collide. A fixed Friday release date paired with an incomplete security review multiplies risk exponentially.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>3. 100% Client-Side Privacy</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Your internal runway, financials, and vulnerabilities never touch external cloud servers. Evaluated purely inside browser memory and saved to localStorage.
          </p>
        </div>

      </div>

      {/* Compounding Rules Matrix */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Compounding Hazard Rules ({COMPOUNDING_RULES.length})
        </h3>
        <p className="text-xs text-slate-400">
          When multiple signals co-occur within the same update, cross-correlation rules trigger additional risk index points:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {COMPOUNDING_RULES.map((cRule) => (
            <div
              key={cRule.id}
              className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">{cRule.name}</span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                  +{cRule.bonusScore} pts compound
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {cRule.explanation}
              </p>
              <div className="text-[10px] font-mono text-slate-500">
                Triggered by rules: {cRule.triggerRuleIds.join(' & ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Heuristic Rule Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            Active Heuristic Signal Catalog ({HEURISTIC_RULES.length} Rules)
          </h3>
          <span className="text-xs text-slate-400">
            Across 5 Core Venture Pillars
          </span>
        </div>

        <div className="space-y-3">
          {HEURISTIC_RULES.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 space-y-2.5 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryBadge category={rule.category} />
                  <SeverityBadge severity={rule.baseSeverity} />
                  <span className="text-xs font-bold text-white tracking-tight">{rule.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                    Base Weight: {rule.baseWeight} pts
                  </span>
                  <span className="text-slate-500">{rule.id}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                  Engine Heuristic Rationale:
                </span>
                {rule.reasoning}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                <div className="text-slate-400">
                  <strong className="text-slate-300">Startup Impact: </strong>
                  {rule.whyItMatters}
                </div>
                <div className="text-slate-400">
                  <strong className="text-sky-300">Prescribed Action: </strong>
                  {rule.recommendedAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
