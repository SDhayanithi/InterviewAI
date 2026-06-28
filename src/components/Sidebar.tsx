import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, MessageSquare, Settings, 
  Users, Briefcase, FileText, ClipboardList, ShieldAlert,
  Moon, Sun, LogOut, PanelLeftClose, PanelLeft, Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useAIChat } from '../context/AIChatContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  setCollapsed, 
  mobileOpen, 
  setMobileOpen 
}) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast();
  const { setIsOpen: setChatOpen, clearHistory } = useAIChat();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  // Define sidebar navigation items based on User Role
  const getNavItems = () => {
    if (!user) return [];
    
    if (user.role === 'candidate') {
      return [
        { path: '/candidate', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/candidate/interviews', label: 'My Interviews', icon: <ClipboardList className="w-5 h-5" /> },
        { path: '/candidate/slots', label: 'Available Slots', icon: <Calendar className="w-5 h-5" /> },
        { path: '/candidate/documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
        { path: '/candidate/messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" />, badge: 2 },
        { path: '/candidate/settings', label: 'Profile Settings', icon: <Settings className="w-5 h-5" /> },
      ];
    }
    
    if (user.role === 'hr') {
      return [
        { path: '/hr', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/hr/candidates', label: 'Candidates', icon: <Users className="w-5 h-5" /> },
        { path: '/hr/interviews', label: 'Interviews', icon: <ClipboardList className="w-5 h-5" /> },
        { path: '/hr/calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
        { path: '/hr/pipeline', label: 'Hiring Pipeline', icon: <Briefcase className="w-5 h-5" /> },
        { path: '/hr/messages', label: 'Inbox', icon: <MessageSquare className="w-5 h-5" />, badge: 6 },
        { path: '/hr/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
      ];
    }

    if (user.role === 'admin') {
      return [
        { path: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/admin/users', label: 'Manage Users', icon: <Users className="w-5 h-5" /> },
        { path: '/admin/permissions', label: 'Role Permissions', icon: <ShieldAlert className="w-5 h-5" /> },
        { path: '/admin/calendar', label: 'Master Calendar', icon: <Calendar className="w-5 h-5" /> },
        { path: '/admin/settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  const sidebarVariants = {
    expanded: { width: '260px' },
    collapsed: { width: '80px' }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-extrabold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                InterviewAI
              </motion.span>
            )}
          </div>
          
          {/* Collapse Button (Desktop Only) */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  relative flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/15 rounded-xl border border-primary/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <span className={`relative z-10 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                
                {!collapsed && (
                  <span className="relative z-10 flex-1 whitespace-nowrap truncate">{item.label}</span>
                )}

                {item.badge !== undefined && !collapsed && (
                  <span className="relative z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="space-y-4">
        {/* AI Assistant Info Card */}
         {!collapsed && (
          <div className="p-6 rounded-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left relative overflow-hidden min-h-[250px] flex flex-col justify-between">
            <div className="flex items-center gap-3">
              {/* Animated AI Avatar Container */}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center relative flex-shrink-0 animate-pulse">
                <Bot className="w-5 h-5 text-primary" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-50 dark:border-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h6 className="font-extrabold text-xs text-slate-800 dark:text-white truncate">AI Recruiting Assistant</h6>
                <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> Online
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-3 font-semibold">
              Instant help with scheduling, loops, status checks & prep.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => setChatOpen(true)}
                className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-primary/20 cursor-pointer text-center"
              >
                Open AI Assistant
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setChatOpen(true);
                }}
                className="w-full py-2 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                New Chat
              </button>
            </div>
          </div>
        )}

        {/* Theme Slider Toggle */}
        <div className={`flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <span className="text-xs text-slate-500 dark:text-slate-400 pl-2 select-none">
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          )}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-100 shadow-sm hover:scale-105 transition-all"
            title="Toggle Theme"
          >
            {darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>

        {/* User Profile Info & Logout */}
        {user && (
          <div className={`flex items-center gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 ${collapsed ? 'justify-center' : 'px-1'}`}>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] font-medium text-slate-400 capitalize truncate">{user.role === 'hr' ? 'HR Manager' : user.role}</p>
              </div>
            )}
            
            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:block h-screen sticky top-0 z-40 overflow-hidden"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs"
        />
      )}

      {/* Mobile Drawer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: mobileOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden fixed top-0 bottom-0 left-0 z-50 w-[260px] h-screen"
      >
        <SidebarContent />
      </motion.div>
    </>
  );
};
