import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MessageSquare, Settings, LayoutDashboard, UserCheck, Moon, Sun, ShieldAlert, LogOut, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const items = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Go to Dashboard',
      category: 'Navigation',
      action: () => {
        if (!user) navigate('/login');
        else if (user.role === 'candidate') navigate('/candidate');
        else if (user.role === 'hr') navigate('/hr');
        else navigate('/admin');
      }
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Open Interview Calendar',
      category: 'Navigation',
      action: () => {
        if (!user) navigate('/login');
        else if (user.role === 'candidate') navigate('/candidate/calendar');
        else navigate('/hr/calendar');
      }
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Open Chat Rooms & Messages',
      category: 'Navigation',
      action: () => {
        if (!user) navigate('/login');
        else if (user.role === 'candidate') navigate('/candidate/messages');
        else navigate('/hr/messages');
      }
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings & Integrations',
      category: 'Navigation',
      action: () => {
        if (!user) navigate('/login');
        else if (user.role === 'candidate') navigate('/candidate/settings');
        else navigate('/hr/settings');
      }
    },
    {
      icon: darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      label: `Switch to ${darkMode ? 'Light' : 'Dark'} Mode`,
      category: 'System',
      action: () => {
        toggleDarkMode();
        showToast(`Theme switched to ${darkMode ? 'Light' : 'Dark'} mode`, 'info');
      }
    },
    {
      icon: <UserCheck className="w-5 h-5 text-indigo-500" />,
      label: 'Simulate Candidate Role (David Lee)',
      category: 'Developer Sandbox',
      action: () => {
        login('candidate');
        showToast('Logged in as Candidate (David Lee)', 'success');
        navigate('/candidate');
      }
    },
    {
      icon: <UserCheck className="w-5 h-5 text-purple-500" />,
      label: 'Simulate HR Role (Priya Sharma)',
      category: 'Developer Sandbox',
      action: () => {
        login('hr');
        showToast('Logged in as HR Recruiter (Priya Sharma)', 'success');
        navigate('/hr');
      }
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      label: 'Go to Admin Portal (Ctrl+Shift+A required on login)',
      category: 'Developer Sandbox',
      action: () => {
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          showToast('Admin access blocked. Please authenticate from the login page!', 'error');
        }
      }
    },
    {
      icon: <LogOut className="w-5 h-5 text-slate-500" />,
      label: 'Log out of current session',
      category: 'System',
      action: () => {
        logout();
        showToast('Logged out successfully', 'success');
        navigate('/');
      }
    }
  ];

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh] px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Palette Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl rounded-[20px] border border-white/20 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden pointer-events-auto"
        >
          {/* Search bar */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 text-base"
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
              }}
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
              ESC
            </kbd>
          </div>

          {/* Results list */}
          <div className="max-h-[350px] overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No commands found for "{query}"</p>
              </div>
            ) : (
              <div>
                {/* Group items by category */}
                {Array.from(new Set(filteredItems.map((i) => i.category))).map((category) => (
                  <div key={category} className="mb-2">
                    <h3 className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {filteredItems
                        .filter((item) => item.category === category)
                        .map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              item.action();
                              onClose();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-all duration-200"
                          >
                            <span className="opacity-85">{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-xs text-slate-400">
            <span>Use ↑↓ to navigate, Enter to select</span>
            <span>Press Ctrl+K to toggle anywhere</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
