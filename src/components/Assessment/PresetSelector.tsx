import React from 'react';
import type { DemoPreset } from '../../engine/presets';
import { DEMO_PRESETS } from '../../engine/presets';
import { Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: DemoPreset) => void;
  activeText: string;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelectPreset,
  activeText
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span className="font-medium">Quick Demo Scenarios:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {DEMO_PRESETS.map((preset) => {
          const isSelected = activeText.trim() === preset.text.trim();
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              type="button"
              className={`text-left p-2.5 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500/50 bg-sky-500/10 text-white shadow-sm'
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-semibold tracking-tight text-white line-clamp-1">
                    {preset.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-sky-400 uppercase">
                  {preset.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Click to load
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
