import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Video, MoreVertical } from 'lucide-react';
import { mockInterviews } from '../utils/mockData';

export const CandidateInterviews: React.FC = () => {
  const navigate = useNavigate();

  const parseDate = (dateStr: string) => {
    const parts = dateStr.replace(/,/g, '').split(' ');
    if (parts.length >= 4) {
      return {
        weekday: parts[0].substring(0, 3),
        day: parts[1],
        month: parts[2].substring(0, 3)
      };
    }
    return { weekday: 'Wed', day: '28', month: 'May' };
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My Interviews
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review details of your active, upcoming, and past interview loops.
        </p>
      </div>

      <div className="space-y-6">
        {mockInterviews.map((int) => {
          const date = parseDate(int.date);
          const isConfirmed = int.status === 'confirmed' || int.status === 'scheduled';
          return (
            <motion.div 
              key={int.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-[24px] p-8 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6"
            >
              {/* Left Content */}
              <div className="flex gap-5 items-start flex-1 min-w-0">
                {/* Date Box */}
                <div className="w-16 h-20 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center p-2 shadow-inner flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary uppercase leading-none">{date.month}</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-slate-100 mt-1 leading-none">{date.day}</span>
                  <span className="text-[9px] font-medium text-slate-400 mt-1 leading-none">{date.weekday}</span>
                </div>

                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider ${
                      isConfirmed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {int.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {int.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug truncate">
                      {int.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {int.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {int.time.split(' (')[0]}</span>
                    <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-primary" /> Google Meet</span>
                  </div>

                  {/* Interviewer Avatars */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex -space-x-2">
                      {int.panel.map((person) => (
                        <img
                          key={person.id}
                          src={person.avatar}
                          alt={person.name}
                          className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                          title={`${person.name} - ${person.role}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Interview Panel ({int.panel.length} members)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Buttons and Options Menu */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 min-w-[140px] w-full">
                  <a 
                    href={int.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all shadow-md shadow-primary/20 hover:scale-[1.02] flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Join Interview
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate(`/candidate/interview/${int.id}`)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all"
                  >
                    View Details
                  </button>
                </div>

                <button 
                  type="button"
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
