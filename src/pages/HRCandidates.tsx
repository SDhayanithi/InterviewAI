import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, ArrowUpDown, MoreVertical, 
  Trash2, Edit3, UserCheck, ShieldAlert, Sparkles, X,
  Plus, Check, MessageSquare, ClipboardList, Briefcase
} from 'lucide-react';
import { mockCandidates } from '../utils/mockData';
import type { Candidate } from '../types';
import { useToast } from '../context/ToastContext';

export const HRCandidates: React.FC = () => {
  const { showToast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'lastActive'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handlePromotion = (candId: string, nextStage: Candidate['stage']) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        showToast(`Candidate ${c.name} promoted to ${nextStage.toUpperCase()} round!`, 'success');
        return { ...c, stage: nextStage };
      }
      return c;
    }));
    if (selectedCandidate && selectedCandidate.id === candId) {
      setSelectedCandidate(prev => prev ? { ...prev, stage: nextStage } : null);
    }
  };

  const handleNotesSave = (candId: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        showToast('Candidate notes updated', 'success');
        return { ...c, notes: editingNotes };
      }
      return c;
    }));
    setSelectedCandidate(prev => prev ? { ...prev, notes: editingNotes } : null);
  };

  const toggleSort = (field: 'name' | 'score' | 'lastActive') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedCandidates = [...candidates]
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = stageFilter === 'all' || c.stage === stageFilter;
      return matchesSearch && matchesStage;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'score') {
        comparison = a.score - b.score;
      } else if (sortBy === 'lastActive') {
        comparison = a.lastActive.localeCompare(b.lastActive);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Candidates Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Review detailed resumes, AI confidence metrics, and promote talent along the recruitment pipeline.
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast('Connecting ATS system integrations...', 'info')}
          className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold transition-all shadow-md shadow-primary/25 hover:scale-105 flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Candidate
        </button>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search candidate name, role, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="technical">Technical Review</option>
            <option value="hr">HR Interview</option>
            <option value="offer">Offer Released</option>
          </select>
        </div>

        {/* Sort triggers */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toggleSort('score')}
            className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              sortBy === 'score' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-505'
            }`}
          >
            Sort by AI Score <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleSort('name')}
            className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              sortBy === 'name' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-505'
            }`}
          >
            Sort by Name <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Candidate cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCandidates.map((cand) => (
          <motion.div
            layoutId={`card-${cand.id}`}
            key={cand.id}
            className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Top info and score badge */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-800 object-cover"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white hover:text-primary transition-colors cursor-pointer" onClick={() => {
                      setSelectedCandidate(cand);
                      setEditingNotes(cand.notes);
                    }}>
                      {cand.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">{cand.email}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                  cand.score >= 90 ? 'bg-emerald-500/10 text-emerald-500' :
                  cand.score >= 80 ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {cand.score} Rating
                </span>
              </div>

              {/* Role & Stage details */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Target Role</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cand.role}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Current Stage</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[9px] ${
                    cand.stage === 'offer' ? 'bg-emerald-500/10 text-emerald-500' :
                    cand.stage === 'hr' ? 'bg-primary/10 text-primary' :
                    cand.stage === 'technical' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-450'
                  }`}>
                    {cand.stage}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-450">
                  <span>Last Active</span>
                  <span>{cand.lastActive}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 my-4" />

              {/* Notes excerpt */}
              <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed line-clamp-2 italic">
                "{cand.notes}"
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  setSelectedCandidate(cand);
                  setEditingNotes(cand.notes);
                }}
                className="flex-1 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                Review File
              </button>
              
              {cand.stage !== 'offer' && (
                <button
                  type="button"
                  onClick={() => {
                    const stages: Candidate['stage'][] = ['applied', 'screening', 'technical', 'hr', 'offer'];
                    const nextIdx = stages.indexOf(cand.stage) + 1;
                    if (nextIdx < stages.length) {
                      handlePromotion(cand.id, stages[nextIdx]);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
                >
                  Promote
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Candidate Profile Details Drawer / Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <img
                    src={selectedCandidate.avatar}
                    alt={selectedCandidate.name}
                    className="w-16 h-16 rounded-2xl border border-slate-200 dark:border-slate-850 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">{selectedCandidate.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedCandidate.email} • Active {selectedCandidate.lastActive}</p>
                    <div className="flex gap-2 items-center mt-2.5">
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                        {selectedCandidate.role}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[9px] ${
                        selectedCandidate.stage === 'offer' ? 'bg-emerald-500/10 text-emerald-500' :
                        selectedCandidate.stage === 'hr' ? 'bg-primary/10 text-primary' :
                        selectedCandidate.stage === 'technical' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-450'
                      }`}>
                        {selectedCandidate.stage} Stage
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stage Progress & score */}
                <div className="md:col-span-1 space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">AI Recommendation</span>
                    <span className="text-3xl font-black text-primary block">{selectedCandidate.score}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Fit Velocity Index</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Quick Stage Promotion</span>
                    
                    <div className="space-y-1.5">
                      {(['applied', 'screening', 'technical', 'hr', 'offer'] as Candidate['stage'][]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handlePromotion(selectedCandidate.id, st)}
                          className={`w-full py-2 px-3 rounded-lg text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            selectedCandidate.stage === st
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="uppercase">{st}</span>
                          {selectedCandidate.stage === st && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Candidate notes editor */}
                <div className="md:col-span-2 space-y-4 text-left">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      AI Matching Analysis
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      This candidate shows strong synergy with our tech stack. Recommending technical assessment loops covering React concurrent patterns, Vite module optimizations, and clean state setups.
                    </p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 pt-4" />

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Panel Assessment Notes</h4>
                    <textarea
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      className="w-full h-32 p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed text-slate-700 dark:text-slate-300"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleNotesSave(selectedCandidate.id)}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md shadow-primary/25 cursor-pointer hover:bg-primary/95 transition-all"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
