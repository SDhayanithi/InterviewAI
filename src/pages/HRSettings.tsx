import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Bell, Shield, Key, Mail, Bot,
  MessageSquare, Trash2, Save, Sparkles, Sliders, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const HRSettings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'ai'>('profile');
  const [profileName, setProfileName] = useState(user?.name || 'Priya Sharma');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'priya.sharma@interviewai.com');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoMatch, setAutoMatch] = useState(true);
  const [matchingBuffer, setMatchingBuffer] = useState('15');

  const handleSave = () => {
    showToast('Settings saved successfully', 'success');
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Recruiter Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your personal availability configurations, notifications and AI settings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-56 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-slate-900 text-slate-655 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" /> Personal Profile
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-slate-900 text-slate-655 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-slate-900 text-slate-655 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-4 h-4" /> AI Scheduler Config
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 w-full glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Profile Details</h3>
              
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full border border-slate-250 object-cover"
                />
                <button 
                  type="button"
                  onClick={() => showToast('Image uploader integration loading...', 'info')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Change Avatar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Work Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Alert Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Email Notifications</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Receive reminders before active loop runs start.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4.5 h-4.5 rounded-md text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">SMS / WhatsApp Reminders</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Automate check-in request triggers to candidates.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4.5 h-4.5 rounded-md text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Smart Match Adjustments
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Autonomous Conflict Resolving</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Let AI resolve calendar overlap conflicts automatically.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoMatch}
                    onChange={(e) => setAutoMatch(e.target.checked)}
                    className="w-4.5 h-4.5 rounded-md text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Time buffer between loops (mins)</label>
                  <select
                    value={matchingBuffer}
                    onChange={(e) => setMatchingBuffer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="0">0 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Form Footer */}
          <div className="border-t border-slate-100 dark:border-slate-850/80 mt-8 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md shadow-primary/25 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
