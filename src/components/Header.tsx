import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, User, LogOut, Settings, 
  Menu, Sparkles, Command, CheckSquare, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import type { SystemNotification } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { unreadCount, setIsOpen: setNotifOpen } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  // Generate dynamic breadcrumbs from url
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    if (pathnames.length === 0) return [{ label: 'Home', url: '/' }];

    return pathnames.map((value, index) => {
      const url = `/${pathnames.slice(0, index + 1).join('/')}`;
      
      // Formatting labels nicely
      let label = value.replace(/-/g, ' ');
      if (label.toUpperCase().startsWith('INT-')) {
        label = 'Interview Details';
      } else {
        label = label.charAt(0).toUpperCase() + label.slice(1);
      }

      return { label, url };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
      {/* Left Section: Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              {idx > 0 && <span className="text-slate-400">/</span>}
              <Link
                to={crumb.url}
                className={`${
                  idx === breadcrumbs.length - 1
                    ? 'text-slate-800 dark:text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                } transition-colors`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Section: Command Palette Trigger, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search / Command Trigger */}
        <button
          onClick={onSearchClick}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-400 hover:border-primary/30 transition-all text-sm w-40 sm:w-56"
        >
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-left flex-1 truncate text-xs">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-1 font-mono text-[9px] font-bold text-slate-400">
            Ctrl K
          </kbd>
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={() => setNotifOpen(true)}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 relative transition-all cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-800 hover:border-primary/20 transition-all focus:outline-none"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0 z-40" />

                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 rounded-[24px] border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
                      </div>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (user.role === 'candidate') navigate('/candidate/settings');
                          else navigate('/hr/settings');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm font-medium text-rose-600 hover:bg-rose-50/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};
