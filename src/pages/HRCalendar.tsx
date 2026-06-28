import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, RefreshCw, Link2, Info, Search, Filter,
  Clock, MapPin, Video, AlertTriangle, Users, Check, Globe, HelpCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { mockCalendarEvents } from '../utils/mockData';
import type { CalendarSlot } from '../types';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DragAndDropCalendar = Calendar;

export const HRCalendar: React.FC = () => {
  const { showToast } = useToast();
  
  const [events, setEvents] = useState<CalendarSlot[]>(() => {
    // Add additional fields and vary status colors
    return mockCalendarEvents.map((evt, idx) => ({
      ...evt,
      // Status mapping: blue = scheduled, green = completed, red = cancelled, orange = pending, purple = AI suggested
      status: idx === 0 ? 'upcoming' : // scheduled (blue)
              idx === 1 ? 'completed' : // green
              idx === 2 ? 'cancelled' : // red
              idx === 3 ? 'upcoming' : 'completed'
    }));
  });

  const [syncGoogle, setSyncGoogle] = useState(false);
  const [syncOutlook, setSyncOutlook] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterviewer, setSelectedInterviewer] = useState('all');
  const [timezone, setTimezone] = useState('IST');
  const [comparePanel, setComparePanel] = useState(false);

  // Timezone offset simulation text
  const timezoneOffsets: Record<string, string> = {
    'IST': '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    'EST': '(UTC-05:00) Eastern Time (US & Canada)',
    'PST': '(UTC-08:00) Pacific Time (US & Canada)',
    'GMT': '(UTC+00:00) Greenwich Mean Time'
  };

  const handleSync = (provider: 'google' | 'outlook') => {
    if (provider === 'google') {
      setSyncGoogle(true);
      setTimeout(() => {
        setSyncGoogle(false);
        showToast('Successfully synchronized with recruiter Google Calendar!', 'success');
      }, 1500);
    } else {
      setSyncOutlook(true);
      setTimeout(() => {
        setSyncOutlook(false);
        showToast('Successfully synchronized with organizational Outlook Calendar!', 'success');
      }, 1500);
    }
  };

  const onEventDrop = (args: any) => {
    const { event, start, end } = args;
    
    // Conflict detection: see if this slot overlaps with another scheduled or completed slot
    const conflict = events.find(evt => 
      evt.id !== event.id &&
      evt.status !== 'cancelled' &&
      ((start >= evt.start && start < evt.end) || (end > evt.start && end <= evt.end))
    );

    if (conflict) {
      showToast(`Warning: Overlap conflict with "${conflict.title}"! Please verify panelist slots.`, 'error');
    } else {
      showToast(`Interview loop "${event.title}" updated successfully!`, 'success');
    }

    setEvents(prev => prev.map(evt => {
      if (evt.id === event.id) {
        return { ...evt, start, end };
      }
      return evt;
    }));
  };

  const onEventResize = (args: any) => {
    const { event, start, end } = args;
    
    // Check duration change details
    const durationMins = Math.round((end.getTime() - start.getTime()) / 60000);
    showToast(`Duration of "${event.title}" updated to ${durationMins} minutes.`, 'info');

    setEvents(prev => prev.map(evt => {
      if (evt.id === event.id) {
        return { ...evt, start, end };
      }
      return evt;
    }));
  };

  const handleBookAISlot = () => {
    const newSlot: CalendarSlot = {
      id: `ai-slot-${Date.now()}`,
      title: 'AI Suggested: Rohan Mehta - Final Check',
      start: new Date(2024, 4, 30, 16, 0),
      end: new Date(2024, 4, 30, 17, 0),
      status: 'upcoming',
      candidateName: 'Rohan Mehta',
      interviewerName: 'Emily Johnson'
    };
    
    // Check conflict
    const conflict = events.find(evt => 
      (newSlot.start >= evt.start && newSlot.start < evt.end) || 
      (newSlot.end > evt.start && newSlot.end <= evt.end)
    );

    if (conflict) {
      showToast('AI warning: Overlap check flagged on selected block.', 'warning');
    } else {
      showToast('AI Intelligent Slot synchronized into Calendar!', 'success');
    }

    setEvents((prev) => [...prev, newSlot]);
  };

  // Status mapping: blue = scheduled, green = completed, red = cancelled, orange = pending, purple = AI suggested
  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#5B5BF7'; // blue (scheduled)
    let shadowColor = 'rgba(91, 91, 247, 0.2)';
    
    if (event.status === 'completed') {
      backgroundColor = '#22C55E'; // green
      shadowColor = 'rgba(34, 197, 94, 0.2)';
    } else if (event.status === 'cancelled') {
      backgroundColor = '#EF4444'; // red
      shadowColor = 'rgba(239, 68, 68, 0.2)';
    } else if (event.id.toString().includes('ai-slot')) {
      backgroundColor = '#7C3AED'; // purple (AI Recommended)
      shadowColor = 'rgba(124, 58, 237, 0.2)';
    } else if (event.status === 'pending' || event.title.toLowerCase().includes('review')) {
      backgroundColor = '#F59E0B'; // orange (pending)
      shadowColor = 'rgba(245, 158, 11, 0.2)';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        padding: '3px 8px',
        boxShadow: `0 4px 6px -1px ${shadowColor}`,
      },
    };
  };

  // Filter logic
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (evt.candidateName && evt.candidateName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (evt.interviewerName && evt.interviewerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesInterviewer = selectedInterviewer === 'all' || 
                               (evt.interviewerName && evt.interviewerName === selectedInterviewer);
    
    return matchesSearch && matchesInterviewer;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hiring Team Calendar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Drag to adjust loops, resize for interview duration, and matching timezone grids.
          </p>
        </div>

        {/* AI Booking */}
        <button
          type="button"
          onClick={handleBookAISlot}
          className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Sparkles className="w-4 h-4 animate-pulse" /> Auto-Schedule AI Spot
        </button>
      </div>

      {/* Grid: Calendar Core and Side Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter and Controls */}
        <div className="space-y-6">
          
          {/* Calendar Search & Recruiter Filters */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white mb-4">
              Calendar Filter Tools
            </h3>

            <div className="space-y-4">
              {/* Search */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Search Calendar</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Candidate, interviewer..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Interviewer Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Interviewer Panel</label>
                <select
                  value={selectedInterviewer}
                  onChange={(e) => setSelectedInterviewer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all text-slate-500"
                >
                  <option value="all">All Panelists</option>
                  <option value="John Smith">John Smith (Frontend)</option>
                  <option value="Emily Johnson">Emily Johnson (Recruiter)</option>
                  <option value="Alex Brown">Alex Brown (Manager)</option>
                </select>
              </div>

              {/* Timezone Config */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" /> Organization Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all text-slate-500"
                >
                  <option value="IST">IST - India Standard Time</option>
                  <option value="EST">EST - Eastern Standard Time</option>
                  <option value="PST">PST - Pacific Standard Time</option>
                  <option value="GMT">GMT - Greenwich Mean Time</option>
                </select>
                <p className="text-[9px] text-slate-400 font-semibold mt-1">
                  {timezoneOffsets[timezone]}
                </p>
              </div>
            </div>
          </div>

          {/* Availability comparison checker */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                Availability Overlap
              </h3>
              <input 
                type="checkbox"
                checked={comparePanel}
                onChange={(e) => setComparePanel(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Toggle to overlay recruiter availability blocks with candidate calendar syncs.
            </p>

            {comparePanel && (
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center justify-between p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <span className="font-bold text-emerald-600">David Lee (Candidate)</span>
                  <span className="text-slate-400">Synced</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <span className="font-bold text-emerald-600">Priya Sharma (HR)</span>
                  <span className="text-slate-400">Synced</span>
                </div>
              </div>
            )}
          </div>

          {/* Sync Integrations */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white mb-3">
              Calendar Integrations
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSync('google')}
                disabled={syncGoogle}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-350 hover:border-primary/25 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Google Calendar
                </span>
                {syncGoogle ? <RefreshCw className="w-3 h-3 animate-spin text-primary" /> : <Link2 className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={() => handleSync('outlook')}
                disabled={syncOutlook}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-350 hover:border-primary/25 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Outlook Calendar
                </span>
                {syncOutlook ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" /> : <Link2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Color Key code */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white mb-4">
              Status Color Key
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-primary block" />
                <span>Scheduled Loop (Blue)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500 block" />
                <span>Completed Audits (Green)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-rose-500 block" />
                <span>Cancelled / Rescheduled (Red)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500 block" />
                <span>Pending Review (Orange)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-purple-600 block" />
                <span>AI Recommended (Purple)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Big Calendar View */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Overlap guard info banner */}
          <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 text-amber-600 dark:text-amber-500 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs">Overlapping Conflict Guard</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Drag-and-drop auto-checks panel overlap limits. The scheduler automatically prompts if panelists are booked for other screening blocks.
              </p>
            </div>
          </div>

          {/* Big calendar container */}
          <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 shadow-sm min-h-[520px] bg-white dark:bg-slate-900">
            <DragAndDropCalendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 490 }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={(evt: any) => setSelectedSlot(evt)}
              views={['month', 'week', 'day', 'agenda']}
            />
          </div>

          {/* Details Overlay */}
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
            >
              <div>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-0.5">Focus Slot Details</span>
                <h4 className="font-bold text-sm text-slate-850 dark:text-white">{selectedSlot.title}</h4>
                <p className="text-xs text-slate-450 mt-0.5">
                  Scheduled block: <span className="font-semibold text-slate-600 dark:text-slate-350">{format(selectedSlot.start, 'PPpp')}</span>
                </p>
                {selectedSlot.interviewerName && (
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Panelist: {selectedSlot.interviewerName} • Candidate: {selectedSlot.candidateName || 'David Lee'}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Simulating Rescheduling prompt...', 'info')}
                  className="px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
};
