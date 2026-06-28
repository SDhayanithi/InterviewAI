import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, Briefcase, Sparkles, TrendingUp, 
  Plus, Download, UserCheck, AlertCircle, ArrowUpRight,
  MoreVertical, Search, Filter, SlidersHorizontal, Check, RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, CartesianGrid, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockCandidates, mockInterviews } from '../utils/mockData';

// Funnel and timeline mock data for charts
const funnelData = [
  { stage: 'Applied', candidates: 142, rate: '100%' },
  { stage: 'Screening', candidates: 84, rate: '59%' },
  { stage: 'Technical', candidates: 42, rate: '29%' },
  { stage: 'HR Interview', candidates: 18, rate: '12%' },
  { stage: 'Offer Stage', candidates: 6, rate: '4%' },
];

const hiringVelocityData = [
  { month: 'Jan', avgDays: 24, target: 20 },
  { month: 'Feb', avgDays: 21, target: 20 },
  { month: 'Mar', avgDays: 18, target: 20 },
  { month: 'Apr', avgDays: 19, target: 20 },
  { month: 'May', avgDays: 15, target: 20 },
  { month: 'Jun', avgDays: 14, target: 20 },
];

export const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  
  // AI Suggestions simulator
  const [aiSuggestions, setAiSuggestions] = useState([
    { id: 1, name: 'Sneha Iyer', role: 'Product Designer', confidence: 96, reason: 'Matches Stripe-grade layout portfolio and has React 19 visual skill.' },
    { id: 2, name: 'Aditya Verma', role: 'DevOps Engineer', confidence: 91, reason: 'Terraform certification matches our cloud automation stack.' }
  ]);

  const handleAction = (actionStr: string) => {
    showToast(`Quick action triggered: ${actionStr}`, 'success');
  };

  const filteredCandidates = mockCandidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, Priya! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Hiring metrics are looking strong. You have 3 interviews scheduled for today.
          </p>
        </div>
        
        {/* Quick buttons */}
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => handleAction('Create Interview Loop')}
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold transition-all shadow-md shadow-primary/25 hover:scale-105 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Schedule Loop
          </button>
          <button 
            type="button"
            onClick={() => handleAction('Export CSV Data')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Candidates</span>
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary"><Users className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">184</h3>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% from last week
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interviews Tracked</span>
            <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary"><Calendar className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">42</h3>
          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
            8 upcoming loop matches today
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offers Accepted</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><UserCheck className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">14</h3>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> 84% Acceptance Ratio
          </p>
        </div>

        {/* Card 4 */}
        <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Time-to-Hire</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><Briefcase className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">14 days</h3>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Reduced by 4 days this mo
          </p>
        </div>
      </div>

      {/* Grid: charts and suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Funnel chart (2/3 col) */}
        <div className="lg:col-span-2 glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Hiring Funnel Status</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Track candidate distribution and pass rates across recruitment steps.</p>
            </div>
            <span className="text-xs font-bold text-primary flex items-center gap-1">
              Active Loop <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B5BF7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5B5BF7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="stage" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(30, 41, 59, 0.8)', 
                    border: 'none', 
                    borderRadius: '12px', 
                    color: '#fff',
                    fontSize: '11px' 
                  }} 
                />
                <Area type="monotone" dataKey="candidates" stroke="#5B5BF7" strokeWidth={2} fillOpacity={1} fill="url(#colorCandidates)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations panel (1/3 col) */}
        <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                AI Candidate Matches
              </h3>
              <button 
                type="button"
                onClick={() => {
                  showToast('Re-scanning resumes for smart matches...', 'info');
                }}
                className="text-[10px] text-slate-400 font-bold hover:underline"
              >
                Refresh
              </button>
            </div>

            <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed mb-4">
              AI analysis of incoming applicants matched to active engineering and design profiles:
            </p>

            <div className="space-y-3.5">
              {aiSuggestions.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 relative group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-white group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/hr/candidates')}>
                        {item.name}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-medium">{item.role}</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded-md">
                      {item.confidence}% Match
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-relaxed mt-2 italic">
                    "{item.reason}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="button"
            onClick={() => navigate('/hr/candidates')}
            className="w-full py-2.5 mt-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-[11px] font-bold transition-all text-center block"
          >
            Review All Candidates
          </button>
        </div>

      </div>

      {/* Grid: hiring velocity and candidates list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recruiter Calendar widget overview (1/3 col) */}
        <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Calendar Overview
            </h3>
            <button 
              type="button" 
              onClick={() => navigate('/hr/calendar')} 
              className="text-[11px] font-bold text-primary hover:underline"
            >
              Master Calendar
            </button>
          </div>

          <div className="space-y-3.5">
            {mockInterviews.map((item) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/candidate/interview/${item.id}`)}
                className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 hover:border-primary/20 hover:scale-[1.01] transition-all cursor-pointer text-left"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider">{item.type}</span>
                  <span className="text-[9px] text-slate-400 font-semibold">{item.duration}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white mt-1">{item.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.company}</p>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2.5 pt-2 text-[9px] text-slate-400">
                  <span>{item.date}</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-350">{item.time.split(' (')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Table / Directory (2/3 col) */}
        <div className="lg:col-span-2 glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Review Directory</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Filter active applicants, review technical scores and schedule loops.</p>
            </div>
            
            {/* Filter actions */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter name/role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary w-40"
                />
              </div>

              <select 
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Stages</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="technical">Technical</option>
                <option value="hr">HR Interview</option>
                <option value="offer">Offer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Job Role</th>
                  <th className="py-3 px-4 text-center">Stage</th>
                  <th className="py-3 px-4 text-center">AI Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 font-medium">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-extrabold text-slate-850 dark:text-white">{cand.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{cand.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-650 dark:text-slate-300">{cand.role}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[9px] ${
                        cand.stage === 'offer' ? 'bg-emerald-500/10 text-emerald-500' :
                        cand.stage === 'hr' ? 'bg-primary/10 text-primary' :
                        cand.stage === 'technical' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-450'
                      }`}>
                        {cand.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className={`px-1.5 py-0.5 rounded-md ${
                        cand.score >= 90 ? 'bg-emerald-500/10 text-emerald-500' :
                        cand.score >= 80 ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {cand.score}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        type="button"
                        onClick={() => navigate(`/candidate/interview/INT-2024-0587`)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-350 hover:text-primary transition-all cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
