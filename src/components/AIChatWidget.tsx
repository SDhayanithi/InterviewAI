import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, X, Send, Minimize2, Maximize2, Sparkles, Mic, 
  Volume2, VolumeX, Paperclip, Smile, Copy, RotateCcw, 
  ThumbsUp, ThumbsDown, FileText, CheckSquare, ListTodo, 
  User, Check, CornerDownLeft, Calendar, Mail, AlertTriangle
} from 'lucide-react';
import { useAIChat } from '../context/AIChatContext';
import type { ChatMessage } from '../context/AIChatContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AIChatWidget: React.FC = () => {
  const { 
    chatMessages, isOpen, setIsOpen, isMinimized, setIsMinimized, 
    isVoiceOutputEnabled, setIsVoiceOutputEnabled, sendMessage, 
    triggerVoiceMock, isListening, isTypingSpeech, clearHistory,
    likeMessage, dislikeMessage, regenerateLastMessage, 
    generateChecklist, generateMeetingSummary 
  } = useAIChat();

  const { user } = useAuth();
  const { showToast } = useToast();
  const [inputVal, setInputVal] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const msgEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Schedule Interview",
    "Reschedule",
    "Resume Review",
    "Interview Tips",
    "Calendar Sync",
    "HR Policy",
    "Generate Questions",
    "Generate Email"
  ];

  const emojis = ['😊', '👋', '📅', '👍', '📝', '💡', '🚀', '🔥'];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const allowedExts = ['pdf', 'docx', 'doc', 'txt', 'png', 'jpg', 'jpeg', 'gif'];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExts.includes(ext)) {
        showToast('Unsupported attachment type. Use PDF, DOCX, TXT or Images.', 'error');
        return;
      }
      setAttachedFiles([{ name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` }]);
      showToast(`File attached: ${file.name}`, 'success');
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() && attachedFiles.length === 0) return;
    
    sendMessage(inputVal, attachedFiles.length > 0 ? attachedFiles : undefined);
    setInputVal('');
    setAttachedFiles([]);
    setShowEmojiPicker(false);
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleEmojiClick = (emoji: string) => {
    setInputVal((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFiles([{ name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` }]);
    }
  };

  const handleCopyText = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedId(msg.id);
    showToast('Message copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 1500);
  };

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTypingSpeech, isListening]);

  const renderNormalText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
      if (isBullet) {
        content = line.replace(/^[-•]\s+/, '');
      }

      // Bold parsing
      const parts = content.split('**');
      const parsed = parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="font-extrabold text-slate-800 dark:text-white">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex gap-2 pl-2 mt-1.5 text-xs text-slate-755 dark:text-slate-300">
            <span className="text-primary font-bold">•</span>
            <span className="flex-1">{parsed}</span>
          </div>
        );
      }

      return <p key={idx} className="mt-1 leading-relaxed text-xs text-slate-750 dark:text-slate-350">{parsed}</p>;
    });
  };

  // Markdown rendering helper
  const renderFormattedText = (text: string) => {
    if (text.includes('```')) {
      const parts = text.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          // Inside code block
          const lines = part.split('\n');
          const firstLine = lines[0].trim();
          const language = ['typescript', 'javascript', 'html', 'css', 'json', 'python', 'go', 'rust', 'bash', 'sh'].includes(firstLine) ? firstLine : 'code';
          const codeContent = language !== 'code' ? lines.slice(1).join('\n') : part;

          return (
            <div key={index} className="my-3 rounded-xl overflow-hidden border border-slate-205 dark:border-slate-800 bg-slate-950 text-slate-100 font-mono text-[10px] shadow-sm">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800/80 text-[9px] font-bold text-slate-400">
                <span className="uppercase">{language}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(codeContent);
                    showToast('Code copied to clipboard!', 'success');
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <pre className="p-3 overflow-x-auto text-left leading-relaxed">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }
        return renderNormalText(part);
      });
    }
    return renderNormalText(text);
  };

  const renderRichCard = (type: string, data: any) => {
    if (!data) return null;

    switch (type) {
      case 'interview_slots':
        return (
          <div className="mt-3.5 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs">
              <Calendar className="w-4 h-4" /> Available Slots
            </div>
            {data.slots?.map((slot: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xs transition-shadow">
                <div>
                  <h6 className="font-bold text-[11px] text-slate-850 dark:text-slate-200">{slot.date}</h6>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{slot.time} • {slot.location}</p>
                </div>
                <div className="flex gap-2.5">
                  <a 
                    href="https://meet.google.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-2.5 py-1.5 text-[9px] font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-center flex items-center justify-center cursor-pointer"
                  >
                    Join
                  </a>
                  <button 
                    type="button"
                    onClick={() => {
                      sendMessage(`book slot: ${slot.date} at ${slot.time}`);
                      showToast(`Selected slot booked!`, 'success');
                    }}
                    className="px-2.5 py-1.5 text-[9px] font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'reschedule_slots':
        return (
          <div className="mt-3.5 space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-xs">
              <Calendar className="w-4 h-4" /> Reschedule Interview Loop
            </div>
            <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Current Loop: {data.current?.title}</p>
                <p className="mt-0.5 opacity-90">{data.current?.date}</p>
                <p className="mt-1 font-bold text-[9px] bg-amber-500/10 px-1.5 py-0.5 rounded inline-block">{data.warning}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">New slots selection:</p>
              {data.slots?.map((slot: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between hover:shadow-xs transition-shadow">
                  <div>
                    <h6 className="font-bold text-[11px] text-slate-800 dark:text-slate-200">{slot.date}</h6>
                    <p className="text-[10px] text-slate-500 dark:text-slate-405 mt-0.5">{slot.time}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      sendMessage(`Confirm rescheduling to ${slot.date} at ${slot.time}`);
                      showToast(`Rescheduled request submitted!`, 'success');
                    }}
                    className="px-3 py-1.5 text-[9px] font-bold bg-primary text-white rounded-lg hover:bg-primary/95 transition-all shadow-xs cursor-pointer"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'resume_score':
        return (
          <div className="mt-3.5 space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <FileText className="w-4 h-4" /> Resume Scan Report
            </div>
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-white flex-shrink-0 bg-emerald-500/5">
                {data.score}
              </div>
              <div className="min-w-0 flex-1">
                <h6 className="font-bold text-[11px] text-slate-800 dark:text-slate-200">ATS Match Level: {data.atsScore}%</h6>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">Resume parsed dynamically via smart keywords matching.</p>
              </div>
            </div>
            <div className="space-y-2 text-[10px]">
              <div>
                <p className="font-bold text-slate-500 dark:text-slate-400">Strengths:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.strengths?.map((str: string, idx: number) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px]">{str}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-500 dark:text-slate-400">Weaknesses:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400 pl-1 mt-0.5">
                  {data.weaknesses?.map((weak: string, idx: number) => (
                    <li key={idx} className="leading-tight">{weak}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-500 dark:text-slate-400">Missing Keywords:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.missingKeywords?.map((kw: string, idx: number) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[9px]">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => showToast('Connecting to interactive editor...', 'info')}
              className="w-full py-2 bg-primary text-white text-[10px] font-bold rounded-xl hover:bg-primary/95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              Improve Resume
            </button>
          </div>
        );

      case 'tips':
        return (
          <div className="mt-3.5 space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="w-4 h-4 animate-pulse" /> Interview Insights
            </div>
            <div className="space-y-2 text-[10px]">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80">
                <p className="font-bold text-slate-805 dark:text-slate-200">💻 Technical Tips</p>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{data.technicalTips}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80">
                <p className="font-bold text-slate-805 dark:text-slate-200">🗣️ Behavioral Questions</p>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{data.behavioralQuestions}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80">
                <p className="font-bold text-slate-805 dark:text-slate-200">🏢 Company Research</p>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{data.companyResearch}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80">
                <p className="font-bold text-slate-805 dark:text-slate-200">🎯 Coding Topics</p>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{data.codingTopics}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 dark:text-slate-400 mb-1 pl-1">📋 Prep Checklist:</p>
                <div className="space-y-1 pl-1">
                  {data.checklist?.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[9.5px] text-slate-500 dark:text-slate-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="mt-3.5 space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Mail className="w-4 h-4" /> HR Email Draft
            </div>
            <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[9px] border border-slate-800/80 shadow-sm relative group/email">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`Subject: ${data.subject}\n\n${data.body}`);
                  showToast('Email copied to clipboard!', 'success');
                }}
                className="absolute right-2 top-2 p-1 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded border border-slate-700 text-[8px] font-bold cursor-pointer"
              >
                Copy
              </button>
              <p className="text-slate-450 border-b border-slate-800 pb-1.5 mb-1.5">Subject: {data.subject}</p>
              <pre className="whitespace-pre-wrap leading-relaxed">{data.body}</pre>
            </div>
          </div>
        );

      case 'loop_summary':
        return (
          <div className="mt-3.5 space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-left text-[10px]">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <CheckSquare className="w-4 h-4" /> Loop Summary Report
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold">
              <div>
                <p className="text-[9px] font-normal text-slate-450 uppercase tracking-widest">Candidate</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5">{data.candidate}</p>
              </div>
              <div>
                <p className="text-[9px] font-normal text-slate-450 uppercase tracking-widest">Role</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5">{data.role}</p>
              </div>
              <div>
                <p className="text-[9px] font-normal text-slate-450 uppercase tracking-widest">Stage</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5">{data.stage}</p>
              </div>
              <div>
                <p className="text-[9px] font-normal text-slate-450 uppercase tracking-widest">Status</p>
                <p className="text-emerald-500 font-bold mt-0.5">{data.status}</p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/40 text-[9px] flex justify-between items-center">
              <span>Offer Status: <strong className="text-primary font-extrabold">{data.offerStatus}</strong></span>
              {data.feedbackPending && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[8px]">Pending feedback sync</span>
              )}
            </div>
          </div>
        );

      case 'status_stepper':
        return (
          <div className="mt-3.5 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 text-primary font-bold text-xs mb-3">
              <ListTodo className="w-4 h-4" /> Loop Hiring Stage
            </div>
            <div className="flex items-center justify-between relative pl-2 pr-2">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
              {data.stages?.map((stage: any, idx: number) => {
                const isCompleted = stage.status === 'completed';
                const isActive = stage.status === 'active';
                return (
                  <div key={idx} className="flex flex-col items-center z-10 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20 ring-4 ring-primary/20' 
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-[8.5px] mt-1.5 font-bold ${
                      isCompleted ? 'text-slate-805 dark:text-slate-200' : isActive ? 'text-primary' : 'text-slate-400'
                    }`}>{stage.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="mt-3.5 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
              <ListTodo className="w-4 h-4" /> Custom Prep Tracker
            </div>
            <div className="space-y-1.5">
              {data.items?.map((item: any, idx: number) => (
                <label key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer select-none text-[10.5px]">
                  <input
                    type="checkbox"
                    defaultChecked={item.completed}
                    className="rounded border-slate-350 text-primary focus:ring-primary/40 w-3.5 h-3.5 mt-0.5 cursor-pointer"
                  />
                  <span className={`text-slate-700 dark:text-slate-300 ${item.completed ? 'line-through text-slate-450' : ''}`}>{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const userName = user?.name.split(' ')[0] || 'David';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Circular Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="chat-trigger-container"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative group text-left"
          >
            {/* Pulsing ring animation */}
            <span className="absolute -inset-0.5 rounded-full bg-primary/40 animate-ping opacity-60 pointer-events-none" />

            {/* Tooltip */}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              AI Assistant
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="p-5 rounded-full bg-gradient-to-tr from-primary to-secondary text-white shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer relative"
            >
              <Bot className="w-7.5 h-7.5" />
              {/* Unread notification badge */}
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900 text-[8px] font-bold text-white flex items-center justify-center">
                1
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-[360px] sm:w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800 rounded-[28px] shadow-2xl flex flex-col overflow-hidden text-left relative ${
              isMinimized ? 'h-14' : 'h-[680px]'
            }`}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 backdrop-blur-xs flex flex-col items-center justify-center z-50 pointer-events-none border-2 border-dashed border-primary m-4 rounded-[20px]">
                <div className="p-4 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center animate-bounce">
                  <Paperclip className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white mt-3">Drop file here to upload</span>
                <span className="text-[10px] text-slate-450 dark:text-slate-400 mt-1">PDF, DOCX, TXT or Images</span>
              </div>
            )}

            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-md border-b border-white/10 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-white/20 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-primary" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                    🤖 AI Recruiting Assistant
                  </h4>
                  <span className="text-[9px] text-emerald-300 font-bold">
                    Online
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Speaker voice output button */}
                <button
                  onClick={() => setIsVoiceOutputEnabled(!isVoiceOutputEnabled)}
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-all text-white/90"
                  title={isVoiceOutputEnabled ? "Mute Voice Responses" : "Unmute Voice Responses"}
                >
                  {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-all text-white/90"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-all text-white/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & Controls (Hidden if Minimized) */}
            {!isMinimized && (
              <>
                {/* Message Log viewport */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50 dark:bg-slate-950/20">
                  
                  {/* Dashboard Welcome Screen Overlay (Shown above first queries) */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-2xs mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4.5 h-4.5 text-primary" />
                      <h5 className="font-extrabold text-xs text-slate-800 dark:text-white">
                        Hi {userName} 👋
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal">
                      I am your unified InterviewAI assistant. I can help you:
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">• Schedule interviews</span>
                      <span className="flex items-center gap-1">• Reschedule loops</span>
                      <span className="flex items-center gap-1">• Find available slots</span>
                      <span className="flex items-center gap-1">• Interview preparation</span>
                      <span className="flex items-center gap-1">• Resume review</span>
                      <span className="flex items-center gap-1">• Hiring status</span>
                    </div>

                    {/* Quick Checklist/Summary commands */}
                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={generateChecklist}
                        className="flex-1 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-colors text-[9px] font-bold text-slate-655 dark:text-slate-300 rounded-lg border border-slate-150 dark:border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ListTodo className="w-3 h-3 text-primary" /> Generate Checklist
                      </button>
                      <button 
                        onClick={generateMeetingSummary}
                        className="flex-1 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 hover:bg-secondary/10 hover:text-secondary transition-colors text-[9px] font-bold text-slate-655 dark:text-slate-300 rounded-lg border border-slate-150 dark:border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckSquare className="w-3 h-3 text-secondary" /> Loop Summary
                      </button>
                    </div>
                  </div>

                  {/* Message Threads */}
                  {chatMessages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    
                    const getMsgIcon = () => {
                      if (isUser) return <User className="w-4 h-4 text-white" />;
                      switch (msg.cardType) {
                        case 'interview_slots':
                        case 'reschedule_slots':
                          return <Calendar className="w-4 h-4 text-primary" />;
                        case 'resume_score':
                          return <FileText className="w-4 h-4 text-primary" />;
                        case 'tips':
                          return <Sparkles className="w-4 h-4 text-primary" />;
                        case 'email':
                          return <Mail className="w-4 h-4 text-primary" />;
                        case 'checklist':
                        case 'status_stepper':
                          return <ListTodo className="w-4 h-4 text-primary" />;
                        default:
                          return <Bot className="w-4 h-4 text-primary" />;
                      }
                    };

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        {!isUser && (
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            {getMsgIcon()}
                          </div>
                        )}
                        
                        <div className="space-y-1.5">
                          <div className={`p-3.5 rounded-2xl leading-relaxed text-xs shadow-2xs relative group ${
                            isUser
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          }`}>
                            
                            {/* Formatted Text Content */}
                            {renderFormattedText(msg.text)}

                            {/* Render rich card based on cardType */}
                            {msg.cardType && renderRichCard(msg.cardType, msg.cardData)}
 
                            {/* Render attachments if any */}
                            {msg.files && msg.files.map((file, fidx) => (
                              <div 
                                key={fidx} 
                                className={`mt-2 p-2 rounded-lg border flex items-center gap-2 ${
                                  isUser 
                                    ? 'bg-white/10 border-white/20 text-white' 
                                    : 'bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="min-w-0 flex-1 text-[10px]">
                                  <p className="font-bold truncate leading-none">{file.name}</p>
                                  <p className="opacity-80 mt-0.5">{file.size}</p>
                                </div>
                              </div>
                            ))}

                            {/* Message actions buttons overlay (Shown for AI messages) */}
                            {!isUser && !msg.isStreaming && (
                              <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-850 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleCopyText(msg)}
                                  className="p-1 rounded hover:bg-slate-55 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-655"
                                  title="Copy response"
                                >
                                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                                <button
                                  onClick={() => likeMessage(msg.id)}
                                  className={`p-1 rounded hover:bg-slate-55 dark:hover:bg-slate-800 transition-colors ${msg.liked ? 'text-emerald-500' : 'text-slate-400'}`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => dislikeMessage(msg.id)}
                                  className={`p-1 rounded hover:bg-slate-55 dark:hover:bg-slate-800 transition-colors ${msg.disliked ? 'text-rose-500' : 'text-slate-400'}`}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={regenerateLastMessage}
                                  className="p-1 rounded hover:bg-slate-55 dark:hover:bg-slate-800 text-slate-400 hover:text-primary ml-auto"
                                  title="Regenerate last response"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <span className={`text-[9px] text-slate-450 block ${isUser ? 'text-right' : ''}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing loader dots */}
                  {isTypingSpeech && (
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex gap-1 items-center rounded-tl-none w-14 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Listening state indicator */}
                  {isListening && (
                    <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                      <div className="p-3 rounded-2xl bg-primary text-white rounded-tr-none flex gap-2 items-center">
                        <Mic className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                        <span className="text-xs">Listening...</span>
                        <div className="flex gap-0.5 items-end h-3">
                          <span className="w-0.5 h-1.5 bg-white animate-[pulse_0.4s_infinite]" />
                          <span className="w-0.5 h-3.5 bg-white animate-[pulse_0.2s_infinite]" />
                          <span className="w-0.5 h-2 bg-white animate-[pulse_0.3s_infinite]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={msgEndRef} />
                </div>

                {/* Suggestions Carousel Row */}
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none bg-white dark:bg-slate-900 flex-shrink-0">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 transition-all cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Emoji Select drawer */}
                {showEmojiPicker && (
                  <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-center bg-slate-50 dark:bg-slate-950/40 flex-shrink-0">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-lg hover:scale-125 transition-transform cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* File Upload Preview bar */}
                {attachedFiles.length > 0 && (
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/45 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="truncate max-w-[240px]">{attachedFiles[0].name}</span>
                    </div>
                    <button 
                      onClick={() => setAttachedFiles([])}
                      className="text-slate-400 hover:text-slate-655 p-1 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Input form */}
                <form 
                  onSubmit={handleSend}
                  className="p-3 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 bg-white dark:bg-slate-900 flex-shrink-0"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,.doc,.txt"
                  />
                  
                  {/* Paperclip attachment button */}
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-600 transition-colors"
                    title="Upload Resume / Document"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Emoji Toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-600 transition-colors ${showEmojiPicker ? 'text-primary' : ''}`}
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <textarea
                    rows={1}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about slots, tips or reschedules..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent resize-none overflow-y-auto max-h-16 pt-2.5"
                  />
                  
                  {/* Voice speak trigger */}
                  <button
                    type="button"
                    onClick={triggerVoiceMock}
                    disabled={isListening}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-655 transition-colors disabled:opacity-50"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-primary hover:bg-primary/95 text-white shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};
