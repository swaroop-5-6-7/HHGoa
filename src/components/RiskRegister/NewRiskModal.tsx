import React, { useState } from 'react';
import type { RiskCategory, RiskSeverity, RegisterItem } from '../../types/risk';
import { X, Plus } from 'lucide-react';

interface NewRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRisk: (item: RegisterItem) => void;
}

export const NewRiskModal: React.FC<NewRiskModalProps> = ({
  isOpen,
  onClose,
  onAddRisk
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RiskCategory>('delivery');
  const [severity, setSeverity] = useState<RiskSeverity>('high');
  const [detectedPhrase, setDetectedPhrase] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: RegisterItem = {
      id: `reg-custom-${Date.now()}`,
      title: title.trim(),
      category,
      severity,
      status: 'open',
      detectedPhrase: detectedPhrase.trim() || 'Manually entered founder signal',
      whyItMatters: whyItMatters.trim() || 'Identified via leadership risk triage.',
      recommendedAction: recommendedAction.trim() || 'Assign task owner and review in next executive standup.',
      dateIdentified: Date.now(),
      lastUpdated: Date.now(),
      notes: notes.trim()
    };

    onAddRisk(newItem);
    onClose();
    // reset form
    setTitle('');
    setDetectedPhrase('');
    setWhyItMatters('');
    setRecommendedAction('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0c1220] p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Log New Venture Risk
              </h3>
              <p className="text-[11px] text-slate-400">
                Register an untracked risk directly into the team register.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Risk Summary / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead Fullstack Engineer departure before Q3 refactor"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          {/* Category & Severity Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RiskCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500/50"
              >
                <option value="delivery">Delivery</option>
                <option value="financial">Financial</option>
                <option value="security">Security</option>
                <option value="compliance">Compliance</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as RiskSeverity)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500/50"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Trigger Signal / Phrase */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Trigger Signal / Quote (Optional)
            </label>
            <input
              type="text"
              value={detectedPhrase}
              onChange={(e) => setDetectedPhrase(e.target.value)}
              placeholder="e.g. 2 weeks left on notice period"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          {/* Why It Matters */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Why It Matters
            </label>
            <textarea
              rows={2}
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              placeholder="Context on business impact if unaddressed..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 resize-none"
            />
          </div>

          {/* Recommended Action */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Recommended Immediate Action
            </label>
            <textarea
              rows={2}
              value={recommendedAction}
              onChange={(e) => setRecommendedAction(e.target.value)}
              placeholder="Concrete mitigation step for the team..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Internal Team Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Discussing with CTO tomorrow 10am"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-all shadow-md shadow-sky-500/20"
            >
              Add to Register
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
