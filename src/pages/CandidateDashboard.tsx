import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Video, ArrowRight, CheckCircle2, ChevronRight, 
  Sparkles, FileText, Send, HelpCircle, BookOpen, Clock, AlertCircle,
  Mic, MicOff, Volume2, X, Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAIChat } from '../context/AIChatContext';
import { mockInterviews, mockNotifications, mockInterviewTips } from '../utils/mockData';

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Selected Upcoming Interview
  const interview = mockInterviews[0];

  // Global AI Chat context triggers
  const { setIsOpen: setGlobalChatOpen } = useAIChat();

  const handleSelectSlot = (slotStr: string) => {
    showToast(`Time slot requested: ${slotStr}. HR has been notified for confirmation!`, 'success');
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      
      {/* Left Column (70%): Core Modules */}
      <div className="lg:col-span-2 space-y-8 text-left">
        
        {/* Welcome Banner */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Good morning, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track your interviews, manage schedules and stay updated.
          </p>
        </div>

        {/* 1. Upcoming Interview Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/45 rounded-[24px] p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Confirmed
          </div>
          
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Upcoming Interview
          </span>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex gap-4">
              {/* Date Box */}
              <div className="w-16 h-20 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center p-2 shadow-inner">
                <span className="text-[10px] font-bold text-slate-400 uppercase">May</span>
                <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">28</span>
                <span className="text-[9px] font-medium text-slate-400">Wed</span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug">
                  {interview.title}
                </h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {interview.company}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Tomorrow, 10:30 AM - 11:30 AM</span>
                  <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5 text-slate-400" /> Online (Google Meet)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 min-w-[140px]">
              <a 
                href={interview.meetLink}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all shadow-md shadow-primary/20 hover:scale-[1.02] flex items-center justify-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                Join Interview
              </a>
              <button 
                onClick={() => navigate(`/candidate/interview/${interview.id}`)}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-bold transition-all"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Panel Avatars */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 mt-6 pt-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {interview.panel.map((person) => (
                  <img
                    key={person.id}
                    src={person.avatar}
                    alt={person.name}
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                    title={`${person.name} - ${person.role}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-450 font-medium">
                Interview Panel ({interview.panel.length} members)
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
              {interview.type}
            </span>
          </div>
        </div>

        {/* 2. Available Interview Slots */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Available Interview Slots
            </h3>
            <button 
              onClick={() => navigate('/candidate/slots')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              View Calendar <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Slot 1 */}
            <button
              onClick={() => handleSelectSlot('May 30, Fri at 11:00 AM')}
              className="glass-effect p-4 rounded-[24px] text-left border border-slate-200 dark:border-slate-800/60 hover:border-primary/40 dark:hover:border-primary/40 hover:scale-[1.02] transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-2 h-2 rounded-bl-md bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">May 30, Fri</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">11:00 AM - 12:00 PM</p>
              <p className="text-[9px] text-slate-400">IST</p>
              <div className="inline-flex items-center gap-0.5 text-[9px] font-bold text-primary mt-3 px-1.5 py-0.5 bg-primary/10 rounded-md">
                <Sparkles className="w-2.5 h-2.5" /> AI Recommended
              </div>
            </button>

            {/* Slot 2 */}
            <button
              onClick={() => handleSelectSlot('May 31, Sat at 02:00 PM')}
              className="glass-effect p-4 rounded-[24px] text-left border border-slate-200 dark:border-slate-800/60 hover:border-primary/40 dark:hover:border-primary/40 hover:scale-[1.02] transition-all group"
            >
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">May 31, Sat</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">02:00 PM - 03:00 PM</p>
              <p className="text-[9px] text-slate-400">IST</p>
            </button>

            {/* Slot 3 */}
            <button
              onClick={() => handleSelectSlot('Jun 02, Mon at 10:00 AM')}
              className="glass-effect p-4 rounded-[24px] text-left border border-slate-200 dark:border-slate-800/60 hover:border-primary/40 dark:hover:border-primary/40 hover:scale-[1.02] transition-all group"
            >
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Jun 02, Mon</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">10:00 AM - 11:00 AM</p>
              <p className="text-[9px] text-slate-400">IST</p>
            </button>

            {/* Slot 4 */}
            <button
              onClick={() => handleSelectSlot('Jun 03, Tue at 04:00 PM')}
              className="glass-effect p-4 rounded-[24px] text-left border border-slate-200 dark:border-slate-800/60 hover:border-primary/40 dark:hover:border-primary/40 hover:scale-[1.02] transition-all group"
            >
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Jun 03, Tue</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">04:00 PM - 05:00 PM</p>
              <p className="text-[9px] text-slate-400">IST</p>
            </button>
          </div>
        </div>

        {/* 3. My Application Status Timeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-[24px] p-8 shadow-md">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-6">
            My Application Status
          </h3>

          <div className="relative">
            {/* Timeline Bars */}
            <div className="absolute top-5 left-[5%] right-[5%] h-1 bg-slate-200 dark:bg-slate-800 z-0" />
            <div className="absolute top-5 left-[5%] w-[50%] h-1 bg-emerald-500 z-0" />
            <div className="absolute top-5 left-[50%] w-[25%] h-1 bg-primary z-0" />

            <div className="relative z-10 flex justify-between text-center">
              {/* Step 1 - Green Success */}
              <div className="flex flex-col items-center w-16">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md border-4 border-white dark:border-slate-900">
                  ✓
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 mt-2.5">Applied</span>
                <span className="text-[9px] text-slate-400">May 10</span>
              </div>

              {/* Step 2 - Green Success */}
              <div className="flex flex-col items-center w-16">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md border-4 border-white dark:border-slate-900">
                  ✓
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 mt-2.5">Screening</span>
                <span className="text-[9px] text-slate-400">May 12</span>
              </div>

              {/* Step 3 - Green Success */}
              <div className="flex flex-col items-center w-16">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md border-4 border-white dark:border-slate-900">
                  ✓
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 mt-2.5">Technical</span>
                <span className="text-[9px] text-slate-400">May 18</span>
              </div>

              {/* Step 4 - Purple Active */}
              <div className="flex flex-col items-center w-16">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md border-4 border-white dark:border-slate-900 ring-2 ring-primary/45">
                  4
                </div>
                <span className="text-[10px] font-bold text-primary mt-2.5">HR Interview</span>
                <span className="text-[9px] text-primary font-medium">May 28</span>
              </div>

              {/* Step 5 - Gray Inactive */}
              <div className="flex flex-col items-center w-16">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center font-bold text-xs border-4 border-white dark:border-slate-900">
                  5
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-2.5">Offer</span>
                <span className="text-[9px] text-slate-455">Pending</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold">You're doing great!</span> Your HR interview is scheduled. Prepare well and good luck!
            </div>
          </div>
        </div>

        {/* 4. Recent Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Recent Notifications
            </h3>
            <button 
              onClick={() => showToast('Redirecting to inbox logs...', 'info')}
              className="text-xs font-bold text-primary hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {mockNotifications.map((notif) => (
              <div 
                key={notif.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 shadow-xs"
              >
                <div className={`p-1.5 rounded-lg mt-0.5 ${
                  notif.type === 'success' ? 'bg-emerald-500/15 text-emerald-500' :
                  notif.type === 'warning' ? 'bg-amber-500/15 text-amber-500' : 'bg-blue-500/15 text-blue-500'
                }`}>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">{notif.title}</h5>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">{notif.description}</p>
                  <span className="text-[9px] text-slate-400 block mt-1">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column (30%): Side Widgets */}
      <div className="space-y-8 text-left">
        
        {/* A. My Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-[24px] p-8 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              My Schedule
            </h3>
            <button 
              type="button"
              onClick={() => navigate('/candidate/slots')} 
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
            >
              View Calendar
            </button>
          </div>

          {/* Calendar Mini Grid Widget */}
          <div className="grid grid-cols-7 gap-1.5 my-4 pb-4 border-b border-slate-100 dark:border-slate-850">
            {[
              { name: 'M', date: 26, hasEvent: false },
              { name: 'T', date: 27, hasEvent: false },
              { name: 'W', date: 28, hasEvent: true, id: 'INT-2024-0587' },
              { name: 'T', date: 29, hasEvent: false },
              { name: 'F', date: 30, hasEvent: true, id: 'INT-2024-0982' },
              { name: 'S', date: 31, hasEvent: false },
              { name: 'S', date: 1, hasEvent: false },
            ].map((day, dIdx) => (
              <button
                key={dIdx}
                type="button"
                onClick={() => {
                  if (day.hasEvent && day.id) {
                    navigate(`/candidate/interview/${day.id}`);
                  } else {
                    showToast(`No interviews scheduled for day ${day.date}`, 'info');
                  }
                }}
                className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  day.hasEvent
                    ? 'bg-primary/10 border border-primary/20 text-primary font-bold ring-2 ring-primary/10 scale-102 hover:bg-primary hover:text-white'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className="text-[9px] uppercase">{day.name}</span>
                <span className="text-xs mt-1 font-bold">{day.date}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Event 1 */}
            <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => navigate(`/candidate/interview/${interview.id}`)}>
              <div className="text-center min-w-[45px]">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">May 28</p>
                <p className="text-[10px] text-slate-400">Wed</p>
              </div>
              <div className="flex-1 min-w-0 border-l border-primary/20 pl-3">
                <h5 className="font-bold text-xs text-slate-850 dark:text-white truncate group-hover:text-primary transition-colors">
                  HR Interview
                </h5>
                <p className="text-[10px] text-slate-450 truncate">TechCorp Solutions</p>
                <span className="text-[9px] text-slate-400">10:30 AM</span>
              </div>
            </div>

            {/* Event 2 */}
            <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => showToast('Details loading for System design round...', 'info')}>
              <div className="text-center min-w-[45px]">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">May 30</p>
                <p className="text-[10px] text-slate-400">Fri</p>
              </div>
              <div className="flex-1 min-w-0 border-l border-indigo-500/20 pl-3">
                <h5 className="font-bold text-xs text-slate-850 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                  Technical Interview
                </h5>
                <p className="text-[10px] text-slate-450 truncate">InnovateX</p>
                <span className="text-[9px] text-slate-400">11:00 AM</span>
              </div>
            </div>

            {/* Event 3 */}
            <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => showToast('Details loading for Behavioral round...', 'info')}>
              <div className="text-center min-w-[45px]">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Jun 05</p>
                <p className="text-[10px] text-slate-400">Thu</p>
              </div>
              <div className="flex-1 min-w-0 border-l border-purple-500/20 pl-3">
                <h5 className="font-bold text-xs text-slate-850 dark:text-white truncate group-hover:text-purple-500 transition-colors">
                  HR Interview
                </h5>
                <p className="text-[10px] text-slate-450 truncate">BrightMind Tech</p>
                <span className="text-[9px] text-slate-400">03:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* B. Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-[24px] p-8 shadow-md">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h3>

          <div className="space-y-2">
            <button 
              onClick={() => showToast('Connecting Google Calendar accounts...', 'info')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-350 transition-colors"
            >
              <span>Connect Calendar</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => showToast('Simulating Reschedule screen...', 'info')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-350 transition-colors"
            >
              <span>Reschedule Interview</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => navigate('/candidate/slots')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-350 transition-colors"
            >
              <span>Update Availability</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => navigate('/candidate/documents')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-350 transition-colors"
            >
              <span>Upload Documents</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* C. Interview Tips */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-[24px] p-8 shadow-md">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-slate-400" />
            Interview Tips
          </h3>

          <div className="space-y-4">
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
              <span className="text-[10px] font-bold text-primary block uppercase tracking-wider mb-1">Before you start</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {mockInterviewTips[0]}
              </p>
            </div>

            <ul className="space-y-2.5 pl-1">
              {mockInterviewTips.slice(1).map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <span className="text-primary font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

         {/* Global AI Assistant trigger mounted in layouts shell */}     </div>

    </div>
  );
};
