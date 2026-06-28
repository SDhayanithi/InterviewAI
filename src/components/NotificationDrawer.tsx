import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2, Bell, AlertCircle, Calendar } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationDrawer: React.FC = () => {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead, markAllRead, clearAll } = useNotifications();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    setIsOpen(false);

    // Dynamic routing match
    const title = notif.title.toLowerCase();
    const desc = notif.description.toLowerCase();

    if (title.includes('techcorp') || desc.includes('techcorp') || title.includes('frontend') || desc.includes('frontend')) {
      navigate('/candidate/interview/INT-2024-0587');
    } else if (title.includes('innovatex') || desc.includes('innovatex') || title.includes('architect') || desc.includes('architect')) {
      navigate('/candidate/interview/INT-2024-0982');
    } else {
      // Default fallback
      navigate('/candidate/interviews');
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notif.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || !notif.read;
    return matchesSearch && matchesFilter;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs"
          />

          {/* Slide-over Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl text-left"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-primary animate-pulse" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 space-y-3 flex-shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filter === 'unread'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {/* Actions Toolbar */}
            {filteredNotifications.length > 0 && (
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs flex-shrink-0">
                <button
                  onClick={markAllRead}
                  className="font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
                <button
                  onClick={clearAll}
                  className="font-bold text-rose-500 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                  <Bell className="w-12 h-12 stroke-[1.5] mb-4 opacity-50 text-slate-350" />
                  <p className="text-sm font-semibold">No notifications found</p>
                  <p className="text-xs mt-1">Try modifying your search query or filter choice.</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 rounded-[24px] border transition-all duration-200 cursor-pointer flex gap-4 items-start ${
                      !notif.read
                        ? 'bg-primary/5 dark:bg-primary/10 border-primary/20 hover:border-primary/45 hover:shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                      notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                      notif.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {notif.type === 'success' ? <Check className="w-4 h-4" /> :
                       notif.type === 'warning' ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    </div>
                    
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-xs text-slate-805 dark:text-slate-100 leading-snug">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        {notif.description}
                      </p>
                      <span className="text-[9px] text-slate-400 block mt-1.5">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
