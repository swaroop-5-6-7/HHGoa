import React from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import type { UseSpeechRecognitionReturn } from '../../hooks/useSpeechRecognition';

interface VoiceInputProps {
  speech: UseSpeechRecognitionReturn;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ speech, disabled = false }) => {
  const { isSupported, isListening, error, startListening, stopListening } = speech;

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/40">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled || !isSupported}
          className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
            isListening
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
              : isSupported
              ? 'bg-slate-800 text-sky-400 hover:bg-slate-700 hover:text-white border border-slate-700'
              : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
          }`}
          title={!isSupported ? 'Speech recognition unavailable in this browser' : isListening ? 'Click to stop listening' : 'Click to dictate update'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 animate-bounce" />
          ) : (
            <Mic className="w-5 h-5" />
          )}

          {/* Active ripple rings */}
          {isListening && (
            <span className="absolute -inset-1 rounded-xl bg-rose-500/30 animate-ping pointer-events-none" />
          )}
        </button>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">
              {isListening ? 'Voice Dictation Active' : 'Spoken Project Update'}
            </span>
            {isListening && (
              <span className="flex items-center gap-1 text-[10px] text-rose-400 font-mono animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Listening...
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {isListening
              ? 'Speak naturally about your sprint, blockers, and cash position'
              : isSupported
              ? 'Dictate your status update hands-free or type directly below'
              : 'Web Speech API is unavailable in this browser; keyboard input is ready'}
          </p>
        </div>
      </div>

      {/* Fallback & Error Status */}
      {error && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!isSupported && (
        <div className="text-[11px] font-mono text-slate-500">
          Fallback: Standard Text Input Active
        </div>
      )}
    </div>
  );
};
