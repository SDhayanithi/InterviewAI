import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, ArrowRight, KeyRound, AlertTriangle, Eye, EyeOff, 
  User, Mail, Lock, UserCheck, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Selected Login Role Tab
  const [activeTab, setActiveTab] = useState<'candidate' | 'hr'>('candidate');

  // Input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation errors
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Admin Modal states
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Admin Validation errors
  const [adminEmailError, setAdminEmailError] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  const [errorShake, setErrorShake] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'candidate') navigate('/candidate');
      else if (user.role === 'hr') navigate('/hr');
      else navigate('/admin');
    }
  }, [isAuthenticated, user, navigate]);

  // Global key combination listener for CTRL + SHIFT + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'A') {
        e.preventDefault();
        setAdminModalOpen(true);
        showToast('Secret Admin Panel activated', 'info');
      }
      if (e.key === 'Escape') {
        setAdminModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error states
    setFullNameError('');
    setEmailError('');
    setPasswordError('');

    let hasErrors = false;

    if (!fullName.trim()) {
      setFullNameError('Full Name is required');
      hasErrors = true;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    }
    
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Validate Password
    if (password !== '123456') {
      setErrorShake(true);
      setPasswordError('Invalid password');
      showToast('Invalid password', 'error');
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    // Dynamic Login
    login(activeTab, fullName, email, rememberMe);
    showToast('Welcome back', 'success');
    navigate(activeTab === 'hr' ? '/hr' : '/candidate');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset admin errors
    setAdminEmailError('');
    setAdminPasswordError('');

    let hasErrors = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!adminEmail.trim() || !emailRegex.test(adminEmail)) {
      setAdminEmailError('Please enter a valid email address');
      hasErrors = true;
    }
    if (!adminPassword.trim()) {
      setAdminPasswordError('Password is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    if (adminEmail.toLowerCase() !== 'admin@interviewai.com') {
      setErrorShake(true);
      setAdminEmailError('Invalid email');
      showToast('Invalid email', 'error');
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    if (adminPassword !== 'admin123') {
      setErrorShake(true);
      setAdminPasswordError('Invalid password');
      showToast('Invalid password', 'error');
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    login('admin', undefined, adminEmail, true);
    setAdminModalOpen(false);
    showToast('Welcome back', 'success');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 overflow-hidden">
      {/* Parallax Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-955 dark:text-white">
            Sign In to InterviewAI
          </h2>
          <p className="text-slate-550 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
            Enter your details below to sync with your loops workspace.
          </p>
        </div>

        {/* Tab Selection Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('candidate');
              setErrorShake(false);
              setFullNameError('');
              setEmailError('');
              setPasswordError('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'candidate'
                ? 'bg-white dark:bg-slate-950 text-primary shadow-xs border border-slate-200/40 dark:border-slate-800/40'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-250'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('hr');
              setErrorShake(false);
              setFullNameError('');
              setEmailError('');
              setPasswordError('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hr'
                ? 'bg-white dark:bg-slate-950 text-secondary shadow-xs border border-slate-200/40 dark:border-slate-800/40'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-250'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            HR Coordinator
          </button>
        </div>

        {/* Unified Credentials Form */}
        <motion.div
          animate={errorShake ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-[24px] p-8 shadow-md"
        >
          <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
            
            {/* Full Name Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value.trim()) setFullNameError('');
                  }}
                  placeholder="e.g. David Lee"
                  className={`w-full pl-10 pr-4 py-3 text-xs rounded-xl border bg-slate-55 dark:bg-slate-950 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    fullNameError 
                      ? 'border-rose-500 focus:ring-rose-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary focus:border-transparent'
                  }`}
                />
              </div>
              {fullNameError && (
                <span className="text-[10px] text-rose-500 font-bold block mt-1 pl-1">
                  ⚠️ {fullNameError}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value.trim()) setEmailError('');
                  }}
                  placeholder={activeTab === 'candidate' ? 'candidate@interviewai.com' : 'hr@interviewai.com'}
                  className={`w-full pl-10 pr-4 py-3 text-xs rounded-xl border bg-slate-55 dark:bg-slate-955 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    emailError 
                      ? 'border-rose-500 focus:ring-rose-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary focus:border-transparent'
                  }`}
                />
              </div>
              {emailError && (
                <span className="text-[10px] text-rose-500 font-bold block mt-1 pl-1">
                  ⚠️ {emailError}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Check demo credentials hints below', 'info')}
                  className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.trim()) setPasswordError('');
                  }}
                  placeholder="•••••• (hint: 123456)"
                  className={`w-full pl-10 pr-10 py-3 text-xs rounded-xl border bg-slate-55 dark:bg-slate-950 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    passwordError 
                      ? 'border-rose-500 focus:ring-rose-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary focus:border-transparent'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-405 hover:text-slate-655"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <span className="text-[10px] text-rose-500 font-bold block mt-1 pl-1">
                  ⚠️ {passwordError}
                </span>
              )}
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-450 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-350 text-primary focus:ring-primary/45 w-4 h-4 cursor-pointer"
                />
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 mt-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer ${
                activeTab === 'candidate'
                  ? 'bg-primary hover:bg-primary/95 shadow-primary/20'
                  : 'bg-secondary hover:bg-secondary/95 shadow-secondary/20'
              }`}
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

          </form>
        </motion.div>

        {/* Info Credentials help badges */}
        <div className="mt-6 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 text-left space-y-2">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Demo Accounts Hint:</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-405">
            <div>
              <p className="font-bold">Candidate:</p>
              <p>candidate@interviewai.com</p>
              <p>Pass: 123456</p>
            </div>
            <div>
              <p className="font-bold">HR Recruiter:</p>
              <p>hr@interviewai.com</p>
              <p>Pass: 123456</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-[10px] text-slate-400/80">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-300/40">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-300/40">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-300/40">A</kbd> secretly for Admin Modal.
        </div>
      </div>

      {/* Secret Administrator Modal dialog */}
      <AnimatePresence>
        {adminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdminModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={
                errorShake 
                  ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } 
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-sm rounded-[24px] border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden pointer-events-auto text-left"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Administrator Authentication
                    </h3>
                    <p className="text-[10px] text-slate-450 dark:text-slate-450">
                      Enter admin dashboard credentials.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-4" noValidate>
                  {/* Admin Email field */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Admin Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-405">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => {
                          setAdminEmail(e.target.value);
                          if (e.target.value.trim()) setAdminEmailError('');
                        }}
                        placeholder="admin@interviewai.com"
                        className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 ${
                          adminEmailError 
                            ? 'border-rose-500 focus:ring-rose-500' 
                            : 'border-slate-200 dark:border-slate-800 focus:ring-rose-500/50'
                        }`}
                      />
                    </div>
                    {adminEmailError && (
                      <span className="text-[10px] text-rose-500 font-bold block mt-1 pl-1">
                        ⚠️ {adminEmailError}
                      </span>
                    )}
                  </div>

                  {/* Admin Password field */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-405">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          if (e.target.value.trim()) setAdminPasswordError('');
                        }}
                        placeholder="admin123"
                        className={`w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 ${
                          adminPasswordError 
                            ? 'border-rose-500 focus:ring-rose-500' 
                            : 'border-slate-200 dark:border-slate-800 focus:ring-rose-500/50'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {adminPasswordError && (
                      <span className="text-[10px] text-rose-500 font-bold block mt-1 pl-1">
                        ⚠️ {adminPasswordError}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setAdminModalOpen(false)}
                      className="flex-1 py-2.5 text-xs font-bold border border-slate-205 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer text-center"
                    >
                      Login
                    </button>
                  </div>
                </form>

                <div className="flex items-center gap-1.5 justify-center mt-4 text-[9px] text-amber-500">
                  <AlertTriangle className="w-3 h-3" />
                  <span>ESC key closes this modal window.</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
