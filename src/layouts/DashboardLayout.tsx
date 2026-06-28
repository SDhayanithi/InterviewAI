import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { CommandPalette } from '../components/CommandPalette';
import { NotificationDrawer } from '../components/NotificationDrawer';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('interviewai_sidebar_collapsed');
    return saved === 'true';
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('interviewai_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  // Global listener for Ctrl+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Protect Dashboard routes
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Double check role routing bounds (candidate shouldn't access hr portal and vice versa)
  if (location.pathname.startsWith('/hr') && user?.role !== 'hr') {
    return <Navigate to="/candidate" replace />;
  }
  if (location.pathname.startsWith('/candidate') && user?.role !== 'candidate') {
    return <Navigate to="/hr" replace />;
  }
  if (location.pathname.startsWith('/admin') && user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setPaletteOpen(true)}
        />

        {/* Dynamic Outlet Dashboard Content */}
        <main className="flex-1 overflow-x-hidden px-6 md:px-10 py-6 md:py-8">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette Dialog */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Global Notification Panel Drawer */}
      <NotificationDrawer />
    </div>
  );
};
