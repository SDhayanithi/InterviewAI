import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, type Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, RefreshCw, Sparkles, AlertCircle, 
  CheckSquare, Check, Link2, Info
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

export const CandidateCalendar: React.FC = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<CalendarSlot[]>(() => {
    return mockCalendarEvents.map((evt, idx) => ({
      ...evt,
      status: idx === 0 ? 'upcoming' : 
              idx === 1 ? 'completed' : 
              idx === 2 ? 'cancelled' : 'upcoming'
    }));
  });
  const [syncGoogle, setSyncGoogle] = useState(false);
  const [syncOutlook, setSyncOutlook] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);

  const handleSync = (provider: 'google' | 'outlook') => {
    if (provider === 'google') {
      setSyncGoogle(true);
      setTimeout(() => {
        setSyncGoogle(false);
        showToast('Successfully synchronized with Google Calendar!', 'success');
      }, 1500);
    } else {
      setSyncOutlook(true);
      setTimeout(() => {
        setSyncOutlook(false);
        showToast('Successfully synchronized with Outlook Calendar!', 'success');
      }, 1500);
    }
  };

  const handleSelectEvent = (event: CalendarSlot) => {
    setSelectedSlot(event);
  };

  const onEventDrop = (args: any) => {
    const { event, start, end } = args;
    
    // Conflict check
    const conflict = events.find(evt => 
      evt.id !== event.id &&
      evt.status !== 'cancelled' &&
      ((start >= evt.start && start < evt.end) || (end > evt.start && end <= evt.end))
    );

    if (conflict) {
      showToast(`Conflict Warning: Overlaps with loop "${conflict.title}"!`, 'warning');
    } else {
      showToast('Interview slots adjusted', 'success');
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
    showToast('Interview slot duration resized', 'info');
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
      title: 'AI Smart Slot: Senior Frontend Dev',
      start: new Date(2024, 4, 30, 14, 0),
      end: new Date(2024, 4, 30, 15, 0),
      status: 'upcoming',
      candidateName: 'David Lee',
      interviewerName: 'Alex Brown'
    };
    setEvents((prev) => [...prev, newSlot]);
    showToast('AI Smart Slot booked successfully for May 30, 02:00 PM!', 'success');
  };

  // Coloring helper for Calendar Events (blue, green, orange, red, purple)
  const eventStyleGetter = (event: CalendarSlot) => {
    let backgroundColor = '#5B5BF7'; // blue (scheduled)
    if (event.status === 'completed') backgroundColor = '#22C55E'; // green (completed)
    else if (event.status === 'cancelled') backgroundColor = '#EF4444'; // red (cancelled)
    else if (event.id.toString().includes('ai-slot')) backgroundColor = '#7C3AED'; // purple (AI suggested)
    else if (event.title.toLowerCase().includes('review')) backgroundColor = '#F59E0B'; // orange (pending)

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.85,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '11px'
      },
    };
  };


  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Interview Calendar
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review scheduled interviews, drag availability times, and match AI suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Controls & Sync */}
        <div className="space-y-6">
          
          {/* Calendar Sync Providers */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
              Calendar Integrations
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => handleSync('google')}
                disabled={syncGoogle}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-350 hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Google Calendar
                </span>
                {syncGoogle ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" /> : <Link2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleSync('outlook')}
                disabled={syncOutlook}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-350 hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  Outlook Calendar
                </span>
                {syncOutlook ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" /> : <Link2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* AI Intelligent Slot Generator */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              AI Intelligent Slot Matching
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Our AI matched your availability block with Recruiter Priya Sharma for a secondary review loop.
            </p>

            <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 mb-4">
              <span className="text-[9px] font-bold text-primary uppercase block tracking-wider mb-0.5">Suggested Spot</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">May 30, 2024 at 02:00 PM</span>
              <span className="text-[9px] text-slate-450 block mt-0.5">Interviewer: Alex Brown (Engineering Manager)</span>
            </div>

            <button
              onClick={handleBookAISlot}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Book AI Slot
            </button>
          </div>

          {/* Status Color Keys */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
              Status Code Index
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-550">
                <span className="w-3.5 h-3.5 rounded-md bg-primary block" />
                <span>Upcoming Loops</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-550">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 block" />
                <span>Completed Audits</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-550">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-500 block" />
                <span>Cancelled / Rescheduled</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Calendar Box */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Conflict Warning banner */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-500 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs">Overlap Conflict Guard</h5>
              <p className="text-[11px] mt-0.5 leading-relaxed text-slate-500 dark:text-slate-400">
                Vite client synchronizes with your device timezone (IST). Slots booking checks for active interview blocks to prevent double-booking.
              </p>
            </div>
          </div>

          {/* Cal Render Box */}
          <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 shadow-sm min-h-[500px] bg-white dark:bg-slate-900">
            <DragAndDropCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 480 }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              views={['month', 'week', 'day', 'agenda']}
            />
          </div>

          {/* Details Modal overlay */}
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-0.5">Selected Slot Details</span>
                <h4 className="font-bold text-sm text-slate-850 dark:text-white">{selectedSlot.title}</h4>
                <p className="text-xs text-slate-450 mt-0.5">
                  Scheduled for: <span className="font-semibold text-slate-600 dark:text-slate-350">{format(selectedSlot.start, 'PPpp')}</span>
                </p>
                {selectedSlot.interviewerName && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Panelist: {selectedSlot.interviewerName} • Candidate: {selectedSlot.candidateName || 'David Lee'}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Dismiss Details
              </button>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
};
