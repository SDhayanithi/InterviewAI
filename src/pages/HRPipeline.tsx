import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, ArrowRight, UserPlus, Sparkles, CheckCircle2, 
  MessageSquare, MoreHorizontal, User, AlertCircle
} from 'lucide-react';
import { mockCandidates } from '../utils/mockData';
import type { Candidate } from '../types';
import { useToast } from '../context/ToastContext';

const pipelineColumns: Array<{ id: Candidate['stage']; name: string; color: string }> = [
  { id: 'applied', name: 'Applied', color: 'border-t-slate-400' },
  { id: 'screening', name: 'Screening', color: 'border-t-amber-500' },
  { id: 'technical', name: 'Technical', color: 'border-t-indigo-500' },
  { id: 'hr', name: 'HR Interview', color: 'border-t-primary' },
  { id: 'offer', name: 'Offer Stage', color: 'border-t-emerald-500' },
];

export const HRPipeline: React.FC = () => {
  const { showToast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');

  const moveCandidate = (candId: string, direction: 'forward' | 'backward') => {
    const stages: Candidate['stage'][] = ['applied', 'screening', 'technical', 'hr', 'offer'];
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        const currentIdx = stages.indexOf(c.stage);
        let nextIdx = currentIdx + (direction === 'forward' ? 1 : -1);
        if (nextIdx >= 0 && nextIdx < stages.length) {
          const nextStage = stages[nextIdx];
          showToast(`Moved ${c.name} to ${nextStage.toUpperCase()} round!`, 'success');
          return { ...c, stage: nextStage };
        }
      }
      return c;
    }));
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hiring Pipeline
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Kanban visualizer of active recruitment. Move candidates through technical checks and offer loops.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search pipeline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch min-h-[500px]">
        {pipelineColumns.map((col) => {
          const colCandidates = filteredCandidates.filter(c => c.stage === col.id);
          return (
            <div 
              key={col.id}
              className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 text-left"
            >
              {/* Header section of column */}
              <div className={`border-t-4 ${col.color} pt-2.5 flex items-center justify-between mb-4`}>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">{col.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                  {colCandidates.length}
                </span>
              </div>

              {/* Candidates list wrapper */}
              <div className="flex-1 space-y-3.5 overflow-y-auto">
                {colCandidates.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl flex items-center justify-center text-[10px] text-slate-400">
                    Empty Stage
                  </div>
                ) : (
                  colCandidates.map((cand) => (
                    <motion.div
                      layoutId={`pipeline-card-${cand.id}`}
                      key={cand.id}
                      className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group text-left cursor-pointer"
                    >
                      {/* Avatar + name */}
                      <div className="flex items-start gap-2.5">
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-[11px] text-slate-800 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
                            {cand.name}
                          </h4>
                          <p className="text-[9px] text-slate-400 font-semibold truncate">{cand.role}</p>
                        </div>
                      </div>

                      {/* AI Score */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded-md">
                          <Sparkles className="w-2.5 h-2.5" /> {cand.score} Rating
                        </span>
                        <span className="text-[9px] text-slate-400">{cand.lastActive}</span>
                      </div>

                      {/* Hover action slide selectors */}
                      <div className="border-t border-slate-100 dark:border-slate-850 mt-3 pt-2.5 flex justify-between items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {col.id !== 'applied' && (
                          <button
                            type="button"
                            onClick={() => moveCandidate(cand.id, 'backward')}
                            className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 hover:bg-slate-200"
                          >
                            Back
                          </button>
                        )}
                        <span className="flex-1" />
                        {col.id !== 'offer' && (
                          <button
                            type="button"
                            onClick={() => moveCandidate(cand.id, 'forward')}
                            className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded hover:bg-primary/20 flex items-center gap-0.5"
                          >
                            Advance <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
