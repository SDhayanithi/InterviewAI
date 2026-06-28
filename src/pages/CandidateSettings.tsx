import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { 
  User, Shield, Bell, Link, ToggleLeft, 
  Trash2, Globe, Sparkles, Moon, Sun, Lock
} from 'lucide-react';

export const CandidateSettings: React.FC = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'integrations'>('profile');

  // Form states
  const [profileName, setProfileName] = useState(user?.name || 'David Lee');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'david.lee@gmail.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Notification states
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifWhatsapp, setNotifWhatsapp] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile information updated successfully!', 'success');
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    showToast('Password updated successfully. Session credentials refreshed.', 'success');
    setOldPassword('');
    setNewPassword('');
  };

  const handleNotificationsSave = () => {
    showToast('Notification preferences updated successfully!', 'success');
  };

  const handleIntegrationToggle = (provider: string) => {
    showToast(`Integration status toggled for: ${provider}`, 'info');
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm('WARNING: Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.');
    if (confirmation) {
      showToast('Account deletion request initiated.', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your personal details, credentials security, app integrations, and theme styles.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar Tabs */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Password & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'notifications'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'integrations'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>App Integrations</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1">
          <div className="glass-effect rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 p-6 md:p-8 bg-white dark:bg-slate-900 shadow-xs">
            
            {/* 1. Profile details tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Profile Details</h3>
                  <p className="text-slate-450 dark:text-slate-400 text-xs mt-1">Manage avatar representation and names.</p>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <img
                    src={user?.avatar}
                    alt={profileName}
                    className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                  />
                  <div>
                    <button 
                      onClick={() => showToast('Avatar update modal would open here.', 'info')}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all"
                    >
                      Change Photo
                    </button>
                    <span className="text-[10px] text-slate-400 block mt-1.5">Max file size 2MB. formats: JPG, PNG.</span>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider mb-1">Interface Theme Style</label>
                    <div className="flex gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={toggleDarkMode}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-xs font-bold ${
                          !darkMode 
                            ? 'bg-slate-100/80 border-slate-350 text-slate-850' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-55'
                        }`}
                      >
                        <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                      </button>

                      <button
                        type="button"
                        onClick={toggleDarkMode}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-xs font-bold ${
                          darkMode 
                            ? 'bg-slate-800 border-primary text-primary' 
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Moon className="w-4 h-4 text-primary" /> Dark Mode
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* 2. Security tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Credentials Security</h3>
                  <p className="text-slate-450 dark:text-slate-400 text-xs mt-1">Manage password configuration and tokens.</p>
                </div>

                <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider mb-1">Old Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Update Password
                  </button>
                </form>

                <hr className="border-slate-200 dark:border-slate-800 my-6" />

                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Danger Zone</h4>
                  <p className="text-xs text-slate-450 leading-relaxed">
                    Permanently delete account logs and clean cloud synchronization cache.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Account Permanently
                  </button>
                </div>
              </div>
            )}

            {/* 3. Notifications tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Notification Settings</h3>
                  <p className="text-slate-450 dark:text-slate-400 text-xs mt-1">Configure alerts channels for scheduler slots updates.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20">
                    <div>
                      <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Email Notifications</h5>
                      <p className="text-[10px] text-slate-450 mt-0.5">Send interview link invitations and files to inbox.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifEmail}
                      onChange={(e) => setNotifEmail(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-350"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20">
                    <div>
                      <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">SMS Alerts</h5>
                      <p className="text-[10px] text-slate-450 mt-0.5">Send urgent text updates 1 hour before scheduled time.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifSms}
                      onChange={(e) => setNotifSms(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-350"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20">
                    <div>
                      <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">WhatsApp Reminders</h5>
                      <p className="text-[10px] text-slate-450 mt-0.5">Send interactive chat slots updates straight to WhatsApp.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifWhatsapp}
                      onChange={(e) => setNotifWhatsapp(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-350"
                    />
                  </div>

                  <button
                    onClick={handleNotificationsSave}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* 4. Integrations tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">App Integrations</h3>
                  <p className="text-slate-450 dark:text-slate-400 text-xs mt-1">Connect video calling and calendar sync APIs.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Google Calendar */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between h-40 text-left">
                    <div>
                      <span className="text-[9px] font-bold text-slate-450 uppercase block tracking-wider mb-1">Calendar</span>
                      <h5 className="font-bold text-sm text-slate-850 dark:text-white">Google Calendar</h5>
                      <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">
                        Import active events and update time slot bookings automatically.
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">Connected</span>
                      <button 
                        onClick={() => handleIntegrationToggle('Google Calendar')}
                        className="text-[10px] font-bold text-rose-500 hover:underline"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>

                  {/* Zoom Rooms */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between h-40 text-left">
                    <div>
                      <span className="text-[9px] font-bold text-slate-450 uppercase block tracking-wider mb-1">Video Rooms</span>
                      <h5 className="font-bold text-sm text-slate-850 dark:text-white">Zoom Video Meetings</h5>
                      <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">
                        Provision Zoom room links during HR scheduling loops.
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Disconnected</span>
                      <button 
                        onClick={() => handleIntegrationToggle('Zoom meetings')}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Connect Account
                      </button>
                    </div>
                  </div>

                  {/* Microsoft Teams */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between h-40 text-left">
                    <div>
                      <span className="text-[9px] font-bold text-slate-450 uppercase block tracking-wider mb-1">Video Rooms</span>
                      <h5 className="font-bold text-sm text-slate-850 dark:text-white">Microsoft Teams</h5>
                      <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">
                        Provision Teams video links and sync to Outlook calendars.
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Disconnected</span>
                      <button 
                        onClick={() => handleIntegrationToggle('MS Teams')}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Connect Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
