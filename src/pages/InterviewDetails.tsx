import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Video, Clock, Briefcase, FileText, Download, 
  ChevronRight, PhoneCall, HelpCircle, AlertTriangle, ArrowLeft,
  Users, CheckCircle2, AlertCircle, RefreshCw, BarChart2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { mockInterviews } from '../utils/mockData';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles, AlertTriangle as AlertTriangleIcon } from 'lucide-react';

export const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Retrieve matching interview, fallback to first mock item
  const baseInterview = mockInterviews.find((i) => i.id === id) || mockInterviews[0];
  const [interview, setInterview] = React.useState(baseInterview);
  
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);

  const availableSlots = [
    { date: 'May 30, Fri', time: '11:00 AM - 12:00 PM', label: 'AI Recommended' },
    { date: 'May 31, Sat', time: '02:00 PM - 03:00 PM', label: 'Availability Match' },
    { date: 'Jun 02, Mon', time: '10:00 AM - 11:00 AM', label: 'Panel Available' }
  ];

  const handleDownload = (docName: string) => {
    showToast(`Downloading file: ${docName}...`, 'success');
  };

  const handleAction = (actionStr: string) => {
    showToast(`Action triggered: ${actionStr}. HR will follow up.`, 'info');
  };

  const handleCancelInterview = () => {
    showToast('Interview cancellation request submitted. HR team will contact you shortly.', 'warning');
  };

  const handleConfirmReschedule = () => {
    if (!selectedSlot) return;
    
    // Update local interview details representation
    setInterview(prev => ({
      ...prev,
      date: selectedSlot.split(' at ')[0],
      time: selectedSlot.split(' at ')[1] + ' (IST)'
    }));

    showToast(`Interview rescheduled to: ${selectedSlot}`, 'success');
    setRescheduleOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <button 
            type="button"
            onClick={() => navigate('/candidate/interviews')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Interviews
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            {interview.title}
          </h1>
          <p className="text-xs text-slate-450 dark:text-slate-450 font-semibold mt-0.5">
            {interview.company} • Interview ID: <span className="font-mono text-primary font-bold">{interview.id}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRescheduleOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-bold transition-all cursor-pointer"
          >
            Reschedule Interview
          </button>
          <a
            href={interview.meetLink}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5" /> Join with Google Meet
          </a>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (65%): Information Details */}
        <div className="lg:col-span-2 space-y-8 text-left">
          
          {/* Section 1: Schedule & Meet Info */}
          <div className="glass-effect rounded-[20px] p-6 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-450" />
              Interview Schedule & Join Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">Date & Time</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{interview.date}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">{interview.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-secondary/10 text-secondary mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">Duration & Type</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{interview.duration}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">{interview.type} round ({interview.difficulty})</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider mb-1">Google Meet Meeting Code</span>
                  <span className="font-mono text-xs font-bold text-slate-750 dark:text-slate-200 select-all block bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-2 rounded-lg">
                    meet.google.com/abc-defg-hij
                  </span>
                </div>
                <button
                  onClick={() => handleAction('Test Equipment')}
                  className="mt-4 text-xs font-bold text-primary hover:underline text-left inline-flex items-center gap-0.5"
                >
                  Test your equipment <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Interview Panel (Interviewer avatar cards) */}
          <div className="glass-effect rounded-[20px] p-6 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-450" />
              Interview Panelists
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {interview.panel.map((interviewer) => (
                <div 
                  key={interviewer.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex flex-col items-center text-center shadow-xs"
                >
                  <img
                    src={interviewer.avatar}
                    alt={interviewer.name}
                    className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 object-cover mb-3"
                  />
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate w-full">{interviewer.name}</h5>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate w-full">{interviewer.role}</p>
                  <span className="text-[9px] text-slate-450 dark:text-slate-400 mt-2 block select-all font-mono truncate w-full">
                    {interviewer.email}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Documents and Resources */}
          <div className="glass-effect rounded-[20px] p-6 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-450" />
              Documents & Prep Resources
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {interview.documents.map((doc) => (
                <div 
                  key={doc.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="font-bold text-xs text-slate-800 dark:text-slate-150">{doc.name}</h6>
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5 block">{doc.size} • {doc.type.toUpperCase()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(doc.name)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary transition-all"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (35%): Timeline & Side Actions */}
        <div className="space-y-8 text-left">
          
          {/* A. Status timeline */}
          <div className="glass-effect rounded-[20px] p-6 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-6">
              Interview Status Checklist
            </h3>

            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3.5 pl-6 space-y-6">
              {interview.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline Dot */}
                  <span className={`absolute top-0.5 -left-[30px] w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                    event.status === 'done' 
                      ? 'bg-emerald-500 border-emerald-500 text-[8px] font-bold text-white' 
                      : event.status === 'active'
                      ? 'bg-white dark:bg-slate-900 border-primary text-primary text-[8px] font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                    {event.status === 'done' ? '✓' : event.status === 'active' ? '•' : ''}
                  </span>

                  <div>
                    <h5 className={`font-bold text-xs ${
                      event.status === 'done' ? 'text-slate-700 dark:text-slate-300' :
                      event.status === 'active' ? 'text-primary' : 'text-slate-400'
                    }`}>
                      {event.title}
                    </h5>
                    {event.description && (
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    <span className="text-[9px] text-slate-400 block mt-1">{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. Prep Panel */}
          <div className="glass-effect rounded-[20px] p-6 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
              Preparation Checklist
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Review Senior Frontend requirements: React 19 concurrent features, system design specs.
                </p>
              </div>

              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Have your portfolio ready to screen share. Highlight component library work.
                </p>
              </div>

              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Log in 5 minutes early to test microphone and video latency.
                </p>
              </div>
            </div>
          </div>

          {/* C. Quick Actions Menu */}
          <div className="glass-effect rounded-[20px] p-6 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
              Quick Support Menu
            </h3>

            <div className="space-y-2">
              <button 
                onClick={() => handleAction('Contact HR Recruiter')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-350 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Contact HR Coordinator</span>
              </button>

              <button 
                onClick={() => handleAction('Open Support Guide')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-350 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Need Support & FAQ</span>
              </button>

              <button 
                onClick={handleCancelInterview}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-rose-200/50 hover:bg-rose-50/20 text-xs font-semibold text-rose-600 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Cancel Interview Request</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Reschedule Modal Overlay */}
      <AnimatePresence>
        {rescheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRescheduleOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden pointer-events-auto text-left"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    Reschedule Interview
                  </h3>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1">
                    Select one of our AI conflict-free recommended time slots.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRescheduleOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mt-4">
                {availableSlots.map((slot) => {
                  const slotStr = `${slot.date} at ${slot.time.split(' - ')[0]}`;
                  const isSelected = selectedSlot === slotStr;
                  return (
                    <button
                      key={slotStr}
                      type="button"
                      onClick={() => setSelectedSlot(slotStr)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{slot.date}</h4>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">{slot.time} (IST)</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        isSelected 
                          ? 'bg-primary text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-450'
                      }`}>
                        {slot.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setRescheduleOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  disabled={!selectedSlot}
                  className="flex-1 py-2.5 text-xs font-bold bg-primary hover:bg-primary/95 disabled:opacity-50 text-white rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  Confirm Reschedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
