import React, { useState, useEffect } from 'react';
import type { RiskAssessment, DetectedRisk, RegisterItem } from '../../types/risk';
import { assessProjectUpdate } from '../../engine/heuristics';
import type { DemoPreset } from '../../engine/presets';
import { DEFAULT_DEMO_TEXT } from '../../engine/presets';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { VoiceInput } from './VoiceInput';
import { PresetSelector } from './PresetSelector';
import { AssessmentResult } from './AssessmentResult';
import { 
  Radar, 
  Send, 
  Trash2, 
  ShieldCheck, 
  HelpCircle
} from 'lucide-react';

interface AssessmentViewProps {
  existingRegisterItems: RegisterItem[];
  onSaveAssessment: (assessment: RiskAssessment) => void;
  onAddToRegister: (risk: DetectedRisk) => void;
  onNavigateToRegister: () => void;
  initialAssessment?: RiskAssessment | null;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  existingRegisterItems,
  onSaveAssessment,
  onAddToRegister,
  onNavigateToRegister,
  initialAssessment = null
}) => {
  const [inputText, setInputText] = useState<string>(
    initialAssessment ? initialAssessment.rawInput : DEFAULT_DEMO_TEXT
  );
  const [currentAssessment, setCurrentAssessment] = useState<RiskAssessment | null>(
    initialAssessment || null
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inputMethod, setInputMethod] = useState<'voice' | 'text'>('text');

  // Speech Recognition hook
  const speech = useSpeechRecognition((newTranscript) => {
    setInputMethod('voice');
    setInputText((prev) => {
      return prev ? `${prev} ${newTranscript}` : newTranscript;
    });
  });

  // If initialAssessment prop changes, update view
  useEffect(() => {
    if (initialAssessment) {
      setCurrentAssessment(initialAssessment);
      setInputText(initialAssessment.rawInput);
    }
  }, [initialAssessment]);

  // Handle preset selection
  const handleSelectPreset = (preset: DemoPreset) => {
    setInputText(preset.text);
    setInputMethod('text');
  };

  // Run transparent heuristic analysis
  const handleAnalyze = () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    // Micro-delay to render radar sweep animation smoothly
    setTimeout(() => {
      const result = assessProjectUpdate(inputText, inputMethod);
      setCurrentAssessment(result);
      onSaveAssessment(result);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleClear = () => {
    setInputText('');
    setCurrentAssessment(null);
    speech.resetTranscript();
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Project Update Risk Assessment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dictate or paste your sprint update. The engine inspects for hidden delivery, cash, and security threats.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Local Rule Engine · 100% Private</span>
        </div>
      </div>

      {/* Preset Selector */}
      <PresetSelector
        onSelectPreset={handleSelectPreset}
        activeText={inputText}
      />

      {/* Input Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 space-y-4">
        
        {/* Voice Input Header Bar */}
        <VoiceInput speech={speech} disabled={isAnalyzing} />

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setInputMethod('text');
            }}
            placeholder="Type or dictate your update here... e.g. We have 6 weeks of cash runway. The payment integration is still blocked. The release date is fixed for Friday. We have not completed the security review."
            rows={5}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-sans leading-relaxed resize-y"
          />

          {/* Quick Counter */}
          <div className="absolute right-3 bottom-3 flex items-center gap-3 text-[11px] font-mono text-slate-500 bg-slate-950/90 px-2 py-1 rounded-md border border-slate-800/60">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{inputText.length} chars</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Deterministic keyword & temporal signal extraction</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {inputText.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-sky-400 to-sky-300 hover:from-sky-300 hover:to-sky-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-500/20 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Radar className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Scanning Update...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-900" />
                  <span>Assess Risk Signals</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Assessment Results */}
      {currentAssessment && (
        <AssessmentResult
          assessment={currentAssessment}
          existingRegisterItems={existingRegisterItems}
          onAddToRegister={onAddToRegister}
          onNavigateToRegister={onNavigateToRegister}
        />
      )}

    </div>
  );
};
