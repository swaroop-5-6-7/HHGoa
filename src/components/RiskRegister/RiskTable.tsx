import React, { useState } from 'react';
import type { RegisterItem, RiskCategory, RiskSeverity, RiskStatus } from '../../types/risk';
import { CategoryBadge, SeverityBadge } from '../common/Badge';
import confetti from 'canvas-confetti';
import { 
  Search, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  FileText
} from 'lucide-react';

interface RiskTableProps {
  items: RegisterItem[];
  onUpdateStatus: (id: string, status: RiskStatus) => void;
  onDeleteItem: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
  initialCategoryFilter?: RiskCategory | 'all';
}

export const RiskTable: React.FC<RiskTableProps> = ({
  items,
  onUpdateStatus,
  onDeleteItem,
  onSaveNotes,
  initialCategoryFilter = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RiskStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'all'>(initialCategoryFilter);
  const [severityFilter, setSeverityFilter] = useState<RiskSeverity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'date' | 'category'>('urgency');
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const severityRank: Record<RiskSeverity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  // Filter items
  const filtered = items.filter((item) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        item.title.toLowerCase().includes(q) ||
        item.detectedPhrase.toLowerCase().includes(q) ||
        item.whyItMatters.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Status
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    // Category
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    // Severity
    if (severityFilter !== 'all' && item.severity !== severityFilter) return false;

    return true;
  });

  // Sort items
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'urgency') {
      const diff = severityRank[b.severity] - severityRank[a.severity];
      if (diff !== 0) return diff;
      return b.dateIdentified - a.dateIdentified;
    }
    if (sortBy === 'date') {
      return b.dateIdentified - a.dateIdentified;
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  const handleStatusChange = (id: string, newStatus: RiskStatus) => {
    onUpdateStatus(id, newStatus);
    if (newStatus === 'resolved') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#38bdf8', '#10b981', '#60a5fa']
        });
      } catch {
        // ignore if not supported
      }
    }
  };

  const startEditingNotes = (item: RegisterItem) => {
    setEditingNotesId(item.id);
    setTempNotes(item.notes || '');
  };

  const saveNotes = (id: string) => {
    onSaveNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Search & Filters Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 backdrop-blur-md">
        
        {/* Top line: Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, phrase, or notes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50"
            >
              <option value="urgency">Urgency / Severity</option>
              <option value="date">Date Identified</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 px-2">Status:</span>
            {(['all', 'open', 'mitigating', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-xs capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 px-2">Category:</span>
            {(['all', 'delivery', 'financial', 'security', 'compliance', 'customer'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded text-xs capitalize transition-colors ${
                  categoryFilter === cat
                    ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 px-2">Severity:</span>
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded text-xs capitalize transition-colors ${
                  severityFilter === sev
                    ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {sorted.length} of {items.length} logged venture risks</span>
        {(statusFilter !== 'all' || categoryFilter !== 'all' || severityFilter !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
              setSeverityFilter('all');
            }}
            className="text-sky-400 hover:text-sky-300 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Table & Cards */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          No risks matched the selected filter criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item) => {
            const isExpanded = expandedId === item.id;
            const isEditingNotes = editingNotesId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700/80 transition-all duration-150 overflow-hidden"
              >
                {/* Main Card / Row */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Column: Badges, Title, Detected phrase */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CategoryBadge category={item.category} />
                      <SeverityBadge severity={item.severity} />
                      <span className="text-[11px] font-mono text-slate-500">
                        Identified {formatDate(item.dateIdentified)}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white tracking-tight">
                      {item.title}
                    </h4>

                    {item.detectedPhrase && (
                      <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-500">Signal:</span>
                        <span className="text-rose-300 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-500/20">
                          "{item.detectedPhrase}"
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Status changer & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80 shrink-0">
                    
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400 hidden sm:block">Status:</label>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as RiskStatus)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border focus:outline-none ${
                          item.status === 'open' ? 'bg-rose-950/40 text-rose-300 border-rose-500/30' :
                          item.status === 'mitigating' ? 'bg-amber-950/40 text-amber-300 border-amber-500/30' :
                          'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        <option value="open">Open Threat</option>
                        <option value="mitigating">In Mitigation</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Expand Details Toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
                      title={isExpanded ? 'Collapse details' : 'Expand full analysis'}
                    >
                      <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Details'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Delete item */}
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                      title="Remove from register"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                {/* Expanded Details Accordion */}
                {isExpanded && (
                  <div className="bg-slate-950/70 border-t border-slate-800/80 p-5 space-y-4 animate-fadeIn text-xs">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Why it matters */}
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                        <span className="font-semibold text-amber-300 uppercase tracking-wider text-[10px]">
                          Why It Matters
                        </span>
                        <p className="text-slate-300 leading-relaxed font-sans">
                          {item.whyItMatters}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                        <span className="font-semibold text-sky-300 uppercase tracking-wider text-[10px]">
                          Recommended Immediate Action
                        </span>
                        <p className="text-slate-300 leading-relaxed font-sans">
                          {item.recommendedAction}
                        </p>
                      </div>
                    </div>

                    {/* Internal Founder / Team Notes */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Internal Mitigation Notes</span>
                        </span>
                        {!isEditingNotes && (
                          <button
                            onClick={() => startEditingNotes(item)}
                            className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{item.notes ? 'Edit Notes' : '+ Add Note'}</span>
                          </button>
                        )}
                      </div>

                      {isEditingNotes ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={2}
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Add founder status notes, assignee, or deadline..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveNotes(item.id)}
                              className="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 font-semibold"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 leading-relaxed italic">
                          {item.notes || 'No mitigation notes logged yet. Click "+ Add Note" to assign an owner or deadline.'}
                        </p>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
