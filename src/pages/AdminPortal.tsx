import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
  AreaChart, Area, BarChart, Bar, Cell 
} from 'recharts';
import { 
  ShieldAlert as ShieldIcon, Activity as ActivityIcon, Server as ServerIcon, 
  Database as DatabaseIcon, Save as SaveIcon, HardDrive as HardDriveIcon, 
  RotateCw as RotateCwIcon, Users as UsersIcon, Key as KeyIcon, 
  Settings as SettingsIcon, FileText as FileTextIcon, Bell as BellIcon, 
  Inbox as InboxIcon, Search as SearchIcon, Sliders as SlidersIcon, 
  Check as CheckIcon, Terminal as TerminalIcon, Cpu as CpuIcon, 
  RefreshCw as RefreshCwIcon, Layers as LayersIcon 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { adminSystemMetrics } from '../utils/mockData';

// Chart mock data
const cpuUsageData = [
  { time: '10:00', cpu: 12, memory: 40 },
  { time: '10:05', cpu: 18, memory: 41 },
  { time: '10:10', cpu: 15, memory: 40 },
  { time: '10:15', cpu: 28, memory: 42 },
  { time: '10:20', cpu: 14, memory: 42 },
  { time: '10:25', cpu: 19, memory: 43 },
  { time: '10:30', cpu: 15, memory: 42 },
];

import { useLocation } from 'react-router-dom';

export const AdminPortal: React.FC = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'permissions' | 'integrations' | 'settings'>('overview');

  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/users')) {
      setActiveTab('users');
    } else if (path.includes('/admin/permissions')) {
      setActiveTab('permissions');
    } else if (path.includes('/admin/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  
  // Settings switches
  const [backupInterval, setBackupInterval] = useState('daily');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState(true);

  // User management mock
  const [usersList, setUsersList] = useState([
    { name: 'Sarah Connor', email: 'admin@interviewai.com', role: 'admin', status: 'active' },
    { name: 'Priya Sharma', email: 'priya.sharma@interviewai.com', role: 'hr', status: 'active' },
    { name: 'David Lee', email: 'david.lee@gmail.com', role: 'candidate', status: 'active' },
    { name: 'John Smith', email: 'john.smith@techcorp.com', role: 'interviewer', status: 'active' },
    { name: 'Rohan Mehta', email: 'rohan.mehta@email.com', role: 'candidate', status: 'suspended' }
  ]);

  const handleBackup = () => {
    showToast('Starting system database backup creation loop...', 'info');
    setTimeout(() => {
      showToast('Database backup successfully generated (1.21 GB)', 'success');
    }, 2000);
  };

  const toggleUserStatus = (email: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.email === email) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        showToast(`User status updated to ${nextStatus}`, 'success');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldIcon className="w-8 h-8 text-rose-500" /> Admin Security Console
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            System status monitor, roles allocation matrices and platform auditing.
          </p>
        </div>
        
        <button
          type="button"
          onClick={handleBackup}
          className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center gap-1.5 self-start cursor-pointer"
        >
          <RotateCwIcon className="w-4 h-4" /> Trigger System Backup
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Admin Sidebar Navigation */}
        <div className="w-full lg:w-60 flex flex-col gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ActivityIcon className="w-4 h-4" /> System Overview
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <UsersIcon className="w-4 h-4" /> User Management
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'permissions'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <KeyIcon className="w-4 h-4" /> Role Permissions
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('integrations')}
            className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'integrations'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <LayersIcon className="w-4 h-4" /> System Integrations
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> Global Settings
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Overview Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Server Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="glass-effect p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Server Status</span>
                    <ServerIcon className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-black text-emerald-500">HEALTHY</h4>
                  <p className="text-[9px] text-slate-400 mt-1">Uptime: 28d, 4h</p>
                </div>

                <div className="glass-effect p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Database Link</span>
                    <DatabaseIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white">Active (8ms)</h4>
                  <p className="text-[9px] text-slate-400 mt-1">Pool: 25 open channels</p>
                </div>

                <div className="glass-effect p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Backup Status</span>
                    <SaveIcon className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white">Completed</h4>
                  <p className="text-[9px] text-slate-400 mt-1">Today, 03:00 AM (1.2 GB)</p>
                </div>

                <div className="glass-effect p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Storage Usage</span>
                    <HardDriveIcon className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white">62.4% Used</h4>
                  <p className="text-[9px] text-slate-400 mt-1">62.4 GB / 100 GB available</p>
                </div>
              </div>

              {/* Server charts */}
              <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">CPU & Memory Utilization</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Real-time health monitor metrics synchronized every 5s.</p>
                  </div>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live feeds
                  </span>
                </div>

                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cpuUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(15, 23, 42, 0.95)', 
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px', 
                          color: '#fff',
                          fontSize: '10px' 
                        }} 
                      />
                      <Line type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="#EF4444" strokeWidth={2} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="memory" name="Memory Usage (%)" stroke="#5B5BF7" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Audit logs & feed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Backups log */}
                <div className="glass-effect p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-left">
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white mb-3">Backup Log Records</h3>
                  <div className="space-y-2">
                    {adminSystemMetrics.backups.map((b, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-150 dark:border-slate-850">
                        <span className="font-bold text-slate-800 dark:text-slate-250">{b.time}</span>
                        <div className="flex gap-2 items-center text-[10px]">
                          <span className="font-semibold text-slate-400">{b.size}</span>
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-bold">{b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Log Activities */}
                <div className="glass-effect p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-left">
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white mb-3">Auditing Logs</h3>
                  <div className="space-y-2.5">
                    {adminSystemMetrics.auditLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-305">
                            {log.details}
                          </p>
                          <span className="text-[9px] text-slate-400">{log.time} • {log.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User management table */}
          {activeTab === 'users' && (
            <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">Organizational Accounts</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px]">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Security Role</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Auditing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 font-medium">
                    {usersList.map((usr) => (
                      <tr key={usr.email}>
                        <td className="py-3 px-4">
                          <p className="font-extrabold text-slate-800 dark:text-white">{usr.name}</p>
                          <p className="text-[10px] text-slate-450 font-normal">{usr.email}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-650 dark:text-slate-300 capitalize">{usr.role}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase ${
                            usr.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {usr.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(usr.email)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-350 cursor-pointer"
                          >
                            {usr.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Permissions Matrix */}
          {activeTab === 'permissions' && (
            <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 text-left">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">Role Permissions Matrix</h3>
              <p className="text-[10px] text-slate-400 mb-6">Manage global authorization access groups.</p>
              
              <div className="space-y-4 text-xs">
                {/* Admin Row */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <h4 className="font-extrabold text-slate-800 dark:text-white mb-2.5">System Admin Role</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px]">
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Database Write</span>
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Server Terminals</span>
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Role Config</span>
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Integrations API</span>
                  </div>
                </div>

                {/* HR Row */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <h4 className="font-extrabold text-slate-800 dark:text-white mb-2.5">HR Recruiter Role</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Candidate Management</span>
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Calendar Booking</span>
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Template Sync</span>
                    <span className="flex items-center gap-1.5 text-slate-400 line-through">Database Write</span>
                  </div>
                </div>

                {/* Candidate Row */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <h4 className="font-extrabold text-slate-800 dark:text-white mb-2.5">Candidate Role</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] text-slate-450">
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Upload Resumes</span>
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Check statuses</span>
                    <span className="flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Join Meet loops</span>
                    <span className="flex items-center gap-1.5 text-slate-400 line-through">Manage Users</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 text-left">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">Organizational API Connections</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-250">Google Workspace Sync</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Sync recruit calendars and meeting loops automatically via OAuth2.</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md font-bold text-[10px]">CONNECTED</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-250">Microsoft Outlook integration</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Synchronize organizational interview schedules on Microsoft Exchange.</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md font-bold text-[10px]">CONNECTED</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-250">Slack Notification Webhooks</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Post notification loops instantly to company channel feeds.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => showToast('Integrating slack webhook logs...', 'info')}
                    className="px-3 py-1.5 rounded-lg border border-slate-250 text-xs font-bold text-slate-600 hover:bg-white cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 text-left">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">System Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Database Backup Interval</label>
                  <select
                    value={backupInterval}
                    onChange={(e) => setBackupInterval(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">System Maintenance Mode</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Redirect users to system holds page during cloud database audits.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Extended Debug Logger</h4>
                    <p className="text-[10px] text-slate-455 mt-0.5">Log additional terminal audits to assist debugging.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={debugLogs}
                    onChange={(e) => setDebugLogs(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-rose-500 focus:ring-rose-500 cursor-pointer"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    type="button"
                    onClick={() => showToast('Global system settings updated!', 'success')}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
export default AdminPortal;
