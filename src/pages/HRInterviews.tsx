import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardList, Search, Filter, Calendar, Video, Clock, 
  ArrowUpRight, AlertCircle, Plus, CheckCircle2, XCircle
} from 'lucide-react';
import { mockInterviews } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import type { Interview } from '../types';

export const HRInterviews: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleCancel = (id: string) => {
    setInterviews(prev => prev.map(int => {
      if (int.id === id) {
        showToast(`Interview loop ${id} cancelled successfully`, 'success');
        return { ...int, status: 'cancelled' };
      }
      return int;
    }));
  };

  const filteredInterviews = interviews.filter(int => {
    const matchesSearch = int.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          int.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          int.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || int.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Interviews Coordinator
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track all active interview slots, join calls, download candidate documents and review loop checklists.
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast('Simulating loop creation prompt...', 'info')}
          className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold transition-all shadow-md shadow-primary/25 hover:scale-105 flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Interview Loop
        </button>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search interview title, company, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-550 focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInterviews.map((int) => (
          <div 
            key={int.id}
            className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Status indicator tag */}
            <div className="absolute top-0 right-0 bg-slate-50 dark:bg-slate-850 p-1 rounded-bl-xl border-l border-b border-slate-100 dark:border-slate-800">
              <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[9px] ${
                int.status === 'confirmed' ? 'bg-primary/10 text-primary' :
                int.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                int.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {int.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Loop ID: {int.id}
              </span>
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white leading-snug">
                {int.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {int.company} • {int.type}
              </p>

              {/* Time Details */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-350">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{int.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-350">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{int.time} • ({int.duration})</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-350">
                  <Video className="w-4 h-4 text-slate-400" />
                  <a href={int.meetLink} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">
                    Join Video Room
                  </a>
                </div>
              </div>

              {/* Panel members info */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 my-4 pt-4">
                <p className="text-[10px] font-bold text-slate-450 uppercase mb-2">Panel Interviewers</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {int.panel.map((p) => (
                    <div key={p.id} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-150 dark:border-slate-850">
                      <img src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Coordinator buttons */}
            <div className="flex gap-2 mt-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/candidate/interview/${int.id}`)}
                className="flex-1 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                Focus details
              </button>
              
              {int.status !== 'cancelled' && int.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => handleCancel(int.id)}
                  className="px-3.5 py-2 text-rose-500 hover:bg-rose-500/5 text-xs font-bold rounded-xl transition-all border border-transparent hover:border-rose-500/25 cursor-pointer"
                >
                  Cancel Loop
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
