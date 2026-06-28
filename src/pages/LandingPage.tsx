import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, ArrowRight, Calendar, Bell, Shield, 
  BarChart3, Video, Check, Mail, MessageSquare,
  Sparkles, CheckCircle2, ChevronDown, Menu, X, Users, ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAIChat } from '../context/AIChatContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { setIsOpen: setChatOpen } = useAIChat();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 35;
    const y = (clientY - window.innerHeight / 2) / 35;
    setMousePos({ x, y });
  };


  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  const handleStartFree = () => {
    if (isAuthenticated) {
      if (user?.role === 'candidate') navigate('/candidate');
      else if (user?.role === 'hr') navigate('/hr');
      else navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  return (
    <div onMouseMove={handleMouseMove} className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-primary/30 selection:text-primary transition-colors duration-300">
      
      {/* Navigation Bar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/40' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>
 
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#features" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">Features</a>
            <a href="#solutions" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">Solutions</a>
            <a href="#pricing" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">Testimonials</a>
            <a href="#faq" className="text-slate-555 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">FAQ</a>
          </div>
 
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={user?.role === 'candidate' ? '/candidate' : user?.role === 'hr' ? '/hr' : '/admin'}
                  className="text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link to={user?.role === 'candidate' ? '/candidate' : user?.role === 'hr' ? '/hr' : '/admin'}>
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-850"
                  />
                </Link>
              </div>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <button 
                  onClick={handleStartFree}
                  className="px-5 py-2.5 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary/95 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95 cursor-pointer h-[44px]"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-6 space-y-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block font-semibold text-slate-600 dark:text-slate-300">Features</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block font-semibold text-slate-600 dark:text-slate-300">Solutions</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block font-semibold text-slate-600 dark:text-slate-300">Pricing</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block font-semibold text-slate-600 dark:text-slate-300">Testimonials</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block font-semibold text-slate-600 dark:text-slate-300">FAQ</a>
            <hr className="border-slate-200 dark:border-slate-800" />
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link 
                    to={user?.role === 'candidate' ? '/candidate' : user?.role === 'hr' ? '/hr' : '/admin'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 font-bold bg-primary text-white rounded-xl"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 font-bold border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    Log in
                  </Link>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleStartFree();
                    }}
                    className="w-full py-2.5 font-bold bg-primary text-white rounded-xl"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Glow ambient backgrounds with mouse parallax */}
        <motion.div 
          animate={{ x: mousePos.x * -1, y: mousePos.y * -1 }}
          className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" 
        />
        <motion.div 
          animate={{ x: mousePos.x, y: mousePos.y }}
          className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-glow" 
          style={{ animationDelay: '1.5s' }} 
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Left Column: Hero Text (45%) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-powered Scheduling is now live</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl sm:text-6xl md:text-[80px] font-black tracking-tight leading-[1.05] bg-gradient-to-b from-slate-900 to-slate-750 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
            >
              AI-Powered Interview Scheduling Made <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Simple ✨</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mt-5 max-w-xl leading-relaxed font-medium"
            >
              Reduce scheduling conflicts, automate candidate synchronization, and close candidates 70% faster using autonomous AI coordination.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto"
            >
              <button 
                onClick={handleStartFree}
                className="px-8 py-4 rounded-2xl bg-primary text-base font-bold text-white hover:bg-primary/95 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group hover:scale-105 cursor-pointer h-[56px]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a 
                href="#pricing"
                className="px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800/80 font-bold transition-all text-base hover:scale-105 flex items-center justify-center cursor-pointer h-[56px]"
              >
                Book a Demo
              </a>
            </motion.div>

            {/* Quick value props */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center flex-wrap gap-4 mt-8 text-xs font-semibold text-slate-400"
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Save 70% time</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Reduce candidate no-shows</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Loved by top HR teams</span>
            </motion.div>
          </div>

          {/* Right Column: Custom Dashboard Mockup with Glow & Overlays (55%) */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[400px]">
            {/* Soft purple glow behind dashboard */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/25 to-transparent blur-[120px] pointer-events-none rounded-full" />
            
            {/* Custom SaaS Dashboard CSS Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, type: 'spring', stiffness: 50, delay: 0.2 }}
              className="relative w-full max-w-[700px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-2xl overflow-hidden flex h-[440px] text-left select-none pointer-events-none"
            >
              {/* Mock Sidebar */}
              <div className="w-[70px] bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 p-3.5 flex flex-col items-center gap-6">
                <div className="w-6 h-6 rounded-lg bg-primary/25 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="space-y-4 w-full">
                  <div className="h-1.5 w-full bg-primary/20 rounded-md" />
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
              </div>
              
              {/* Mock Main Content */}
              <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/20">
                {/* Mock Header */}
                <div className="h-11 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 px-4 flex items-center justify-between">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="w-6 h-6 rounded-full bg-slate-350 dark:bg-slate-700" />
                </div>
                
                {/* Mock Body */}
                <div className="flex-1 p-4 space-y-4 overflow-hidden">
                  {/* Mock KPI cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-[16px] border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-extrabold block">TIME SAVED</span>
                      <span className="text-xs font-black text-primary block mt-0.5">70% SPEED</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-[16px] border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-extrabold block">COMPLETED</span>
                      <span className="text-xs font-black text-emerald-500 block mt-0.5">14 LOOPS</span>
                    </div>
                  </div>

                  {/* Mock Upcoming Interview Card */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-[16px] border border-slate-200/50 dark:border-slate-800/50 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">HR Technical Loop</span>
                      <span className="text-[8px] text-slate-400">May 30</span>
                    </div>
                    <div className="h-2 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-850">
                      <div className="w-16 h-3 bg-primary/20 rounded" />
                      <div className="w-10 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating AI assistant card overlay (Left) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 80 }}
              whileHover={{ y: -4 }}
              onClick={() => setChatOpen(true)}
              className="absolute -left-6 bottom-12 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-primary/20 hover:border-primary/50 shadow-2xl max-w-[240px] z-10 hidden sm:block text-left cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h6 className="text-[11px] font-bold text-slate-850 dark:text-white">AI Coordinator</h6>
                  <span className="text-[8px] text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Active Matcher
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                "Identified conflict-free interview loops for David Lee's review."
              </p>
            </motion.div>

            {/* Floating Calendar Card overlay (Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 80 }}
              whileHover={{ y: -4 }}
              className="absolute -right-6 top-16 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/20 shadow-2xl max-w-[200px] z-10 hidden sm:block text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-850 dark:text-white">Calendar Sync</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                <div className="w-6 h-6 rounded-md bg-emerald-500/15 text-[10px] text-emerald-600 font-bold flex items-center justify-center">28</div>
                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center">29</div>
                <div className="w-6 h-6 rounded-md bg-primary/15 text-[10px] text-primary font-bold flex items-center justify-center">30</div>
                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center">31</div>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-semibold">Auto-synced with Google</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Logos Infinite Slider */}
      <section className="py-12 border-y border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-950/20 backdrop-blur-xs overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-8">
            Trusted by the world's most innovative enterprises
          </p>
          
          <div className="relative w-full overflow-hidden flex items-center justify-start">
            <motion.div 
              className="flex gap-20 whitespace-nowrap min-w-max text-slate-400 dark:text-slate-550 font-extrabold text-xl sm:text-2xl uppercase tracking-wider"
              animate={{ x: [0, -1200] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear"
              }}
            >
              {['Google', 'Microsoft', 'Amazon', 'Adobe', 'Freshworks', 'Zoho', 'Vercel', 'Linear', 'Stripe',
                'Google', 'Microsoft', 'Amazon', 'Adobe', 'Freshworks', 'Zoho', 'Vercel', 'Linear', 'Stripe'].map((brand, bIdx) => (
                  <span key={bIdx} className="hover:text-primary dark:hover:text-primary transition-all duration-300 cursor-pointer hover:scale-108 inline-block">
                    {brand}
                  </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Counter Section */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-950/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-center shadow-xs"
          >
            <h3 className="text-3xl sm:text-4xl font-extrabold text-primary">1.2M+</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 font-semibold">Interviews Scheduled</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-center shadow-xs"
          >
            <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary">70%</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 font-semibold">Recruiting Time Saved</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-center shadow-xs"
          >
            <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-500">99.2%</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 font-semibold">Candidate Satisfaction</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-center shadow-xs"
          >
            <h3 className="text-3xl sm:text-4xl font-extrabold text-amber-500">500+</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 font-semibold">Global Enterprises</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[120px] px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
              Everything you need to automate candidate vetting
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-base sm:text-lg">
              Empower HR professionals and hiring managers with a unified workspace that bridges coordination gaps in one click.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900/60 p-8 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left">
              <div className="w-[60px] h-[60px] rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Smart Scheduling</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                Autonomous agent handles candidate slots, detects conflict overlaps, and schedules the best hour instantly.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900/60 p-8 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left">
              <div className="w-[60px] h-[60px] rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Calendar Sync</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                Connect seamlessly with Google Calendar, Microsoft Outlook, and Apple Calendar. Up-to-date events.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900/60 p-8 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left">
              <div className="w-[60px] h-[60px] rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">WhatsApp & SMS Reminder</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                Keep candidate attendance near 98% with customized text alerts, calendar updates, and check-in options.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900/60 p-8 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left">
              <div className="w-[60px] h-[60px] rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Visual Analytics</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                Generate reports on interview loops, time-to-hire velocity, offer-to-acceptance ratios, and panel loads.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900/60 p-8 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left">
              <div className="w-[60px] h-[60px] rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Candidate Tracking</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                Track candidates through screening stages, test grids, score reports, and salary negotiation logs.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900/60 p-8 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left">
              <div className="w-[60px] h-[60px] rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Video Interview Sync</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                Instantly provision unique Google Meet, Zoom, MS Teams, or Freshworks rooms. Sync profiles directly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>      {/* Testimonials */}
      <section id="testimonials" className="py-[120px] px-6 bg-slate-100/50 dark:bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-extrabold text-secondary uppercase tracking-widest">
              What Our Users Say
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
              Loved by HR teams and candidates alike
            </h2>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-10 rounded-[24px] flex flex-col justify-between shadow-md hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300">
              <div>
                <div className="flex gap-1 mb-4 text-amber-450 font-bold text-sm">★★★★★</div>
                <p className="text-slate-655 dark:text-slate-350 text-sm leading-relaxed font-medium">
                  "InterviewAI has reduced our scheduling time by 70%. It handles all calendar back-and-forth automatically, allowing our recruiters to focus on deep conversation with top talent. An absolute game-changer."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Sarah Johnson"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Sarah Johnson</h4>
                  <p className="text-xs text-slate-400">HR Manager, Microsoft</p>
                </div>
              </div>
            </div>
 
            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-10 rounded-[24px] flex flex-col justify-between shadow-md hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300">
              <div>
                <div className="flex gap-1 mb-4 text-amber-450 font-bold text-sm">★★★★★</div>
                <p className="text-slate-655 dark:text-slate-350 text-sm leading-relaxed font-medium">
                  "The AI availability matching is incredibly smart. It finds the perfect spot for our 5-person panel interviews in seconds without overlapping. The candidate experience is super smooth as well."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="James Wilson"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">James Wilson</h4>
                  <p className="text-xs text-slate-400">Talent Acquisition, Amazon</p>
                </div>
              </div>
            </div>
 
            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-10 rounded-[24px] flex flex-col justify-between shadow-md hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300">
              <div>
                <div className="flex gap-1 mb-4 text-amber-450 font-bold text-sm">★★★★★</div>
                <p className="text-slate-655 dark:text-slate-350 text-sm leading-relaxed font-medium">
                  "As a candidate, scheduling my interviews with this tool was an amazing experience. I was able to choose slots on my mobile, sync it to my calendar, download resources, and chat with HR in one place."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                  alt="Emily Davis"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Emily Davis</h4>
                  <p className="text-xs text-slate-400">Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-[120px] px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-extrabold text-accent uppercase tracking-widest">
              Simple Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
              Plans that grow with your recruitment needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 p-8 rounded-[20px] flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div>
                <h4 className="font-bold text-slate-950 dark:text-white text-lg">Starter</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">For growing teams and startups.</p>
                <div className="my-8">
                  <span className="text-4xl font-extrabold text-slate-950 dark:text-white">$49</span>
                  <span className="text-slate-400 text-sm font-semibold"> / month</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-primary" /> Max 20 interviews/mo
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-primary" /> Basic Google Calendar Sync
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-primary" /> Email Notifications
                  </li>
                </ul>
              </div>
              <button onClick={handleStartFree} className="w-full py-3 mt-8 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                Choose Plan
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-slate-900 dark:bg-slate-900 border-2 border-primary p-8 rounded-[24px] flex flex-col justify-between shadow-2xl shadow-primary/35 scale-105 relative z-10 overflow-hidden text-white">
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Popular
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">Professional</h4>
                <p className="text-slate-400 text-xs mt-1.5">For medium recruiting centers.</p>
                <div className="my-8">
                  <span className="text-4xl font-extrabold">$149</span>
                  <span className="text-slate-400 text-sm font-semibold"> / month</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2.5 text-sm text-slate-200">
                    <Check className="w-4 h-4 text-primary" /> Unlimited Interviews
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-200">
                    <Check className="w-4 h-4 text-primary" /> Advanced AI scheduling matcher
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-200">
                    <Check className="w-4 h-4 text-primary" /> WhatsApp & SMS reminders
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-200">
                    <Check className="w-4 h-4 text-primary" /> Real-time Analytics Board
                  </li>
                </ul>
              </div>
              <button onClick={handleStartFree} className="w-full py-3 mt-8 font-bold bg-primary text-white hover:bg-primary/95 rounded-xl transition-all shadow-md shadow-primary/20">
                Choose Plan
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 p-8 rounded-[20px] flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div>
                <h4 className="font-bold text-slate-950 dark:text-white text-lg">Enterprise</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">For large scale conglomerates.</p>
                <div className="my-8">
                  <span className="text-4xl font-extrabold">Custom</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-primary" /> Tailored custom AI configurations
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-primary" /> Dedicated account manager
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-primary" /> Custom security API syncs
                  </li>
                </ul>
              </div>
              <button onClick={handleStartFree} className="w-full py-3 mt-8 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-[120px] px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
              Have questions? We have answers.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the AI smart scheduler select candidate slots?",
                a: "The AI recruiter scans candidate calendars, panelist availabilities, and detects overlaps automatically. It checks timezone boundaries and buffers between consecutive loops to select the most optimal hour, syncing directly."
              },
              {
                q: "Is timezone conversion handled automatically?",
                a: "Yes! The platform automatically localizes schedules based on the candidate's device locale. Interviewers in differing timezones (like EST vs IST) are aligned seamlessly."
              },
              {
                q: "Can I synchronize both my Google and Outlook calendars?",
                a: "Yes. Recruiter and candidate dashboards offer simple click sync modules to hook up Google Calendar, Outlook Calendar, or organization-level Exchange servers."
              },
              {
                q: "What options exist for custom interview checklists and notes?",
                a: "HR coordinators can configure preparation checklists, download links for role assessment specifications, and compile cooperative evaluation grades directly in the chat panel."
              }
            ].map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-left"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-slate-405" />}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-[120px] px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-primary via-indigo-600 to-secondary rounded-[24px] p-8 sm:p-12 md:p-16 text-left relative overflow-hidden shadow-2xl text-white min-h-[240px] flex flex-col justify-center">
            {/* Background Illustration Glows */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-60 h-60 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full text-white/90">
                Ready to accelerate?
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Transform your candidate booking loop today.
              </h2>
              <p className="text-white/80 text-sm sm:text-base max-w-lg leading-relaxed font-semibold">
                Integrate InterviewAI in minutes, synchronize your hiring panel calendars, and schedule vetting loops automatically.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleStartFree}
                  className="px-8 py-4 rounded-xl bg-white text-primary text-sm font-extrabold hover:bg-slate-50 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer h-[56px]"
                >
                  Start Free Trial
                </button>
                <a 
                  href="#pricing"
                  className="px-8 py-4 rounded-xl border border-white/30 bg-transparent text-white text-sm font-extrabold hover:bg-white/10 transition-all hover:scale-105 flex items-center justify-center cursor-pointer h-[56px]"
                >
                  View Plans
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 py-16 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                InterviewAI
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Billion-dollar caliber AI interview scheduler. Close candidates faster, eliminate coordination friction, and secure top tier professionals.
            </p>
          </div>

          {/* Column 2 */}
          <div className="text-left">
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Product</h5>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:underline">Features</a></li>
              <li><a href="#" className="hover:underline">Pricing</a></li>
              <li><a href="#" className="hover:underline">Dashboard Preview</a></li>
              <li><a href="#" className="hover:underline">Release Notes</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="text-left">
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Company</h5>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Legal & Privacy</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="text-left">
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Newsletter</h5>
            <p className="text-slate-550 dark:text-slate-400 text-xs mb-4">
              Get the latest recruitment tips and platform features.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@domain.com"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
              <button className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-200/50 dark:border-slate-800/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-4">
          <span>&copy; {new Date().getFullYear()} InterviewAI Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
