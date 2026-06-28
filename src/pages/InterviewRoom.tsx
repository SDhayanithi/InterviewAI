import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, Smile, AtSign, Mic, Play, Pause, 
  Download, Plus, Pin, Sparkles, MessageSquare, 
  Calendar, Video, FileText, FileSpreadsheet, FileWarning, 
  Image as ImageIcon, MoreHorizontal, User, AlertCircle, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockMessages, mockInterviews, mockInterviewTips } from '../utils/mockData';
import type { Message, DocumentFile } from '../types';

export const InterviewRoom: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const timerRef = useRef<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // File list state
  const [files, setFiles] = useState<DocumentFile[]>([
    { name: 'John_Doe_Resume.pdf', size: '245 KB', type: 'pdf', url: '#' },
    { name: 'Job_Description.docx', size: '68 KB', type: 'docx', url: '#' },
    { name: 'Technical_Assessment.pptx', size: '1.2 MB', type: 'pptx', url: '#' },
    { name: 'Interview_Scorecard.xlsx', size: '56 KB', type: 'xlsx', url: '#' },
    { name: 'Interview_Notes.txt', size: '12 KB', type: 'txt', url: '#' }
  ]);

  // Scroll to bottom on load or new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recording timer
  useEffect(() => {
    if (voiceRecording) {
      timerRef.current = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setVoiceSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [voiceRecording]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Math.random().toString(),
      senderId: user?.id || 'guest',
      senderName: user?.name || 'Guest User',
      senderRole: user?.role as any || 'candidate',
      senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      text: inputText,
      timestamp: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate typing and reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const robotReply: Message = {
        id: Math.random().toString(),
        senderId: 'hr-01',
        senderName: 'Priya Sharma',
        senderRole: 'hr',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        text: 'Received! Our team has compiled the technical round documentation. Let us sync on calendar availability tomorrow.',
        timestamp: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: [{ emoji: '👍', count: 1, users: ['David Lee'] }]
      };
      setMessages((prev) => [...prev, robotReply]);
    }, 2000);
  };

  const handleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        const currentReactions = msg.reactions || [];
        const existing = currentReactions.find((r) => r.emoji === emoji);
        
        let newReactions;
        if (existing) {
          // Toggle off
          newReactions = currentReactions.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          );
        } else {
          newReactions = [...currentReactions, { emoji, count: 1, users: [user?.name || 'David Lee'] }];
        }
        return { ...msg, reactions: newReactions };
      })
    );
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const newDoc: DocumentFile = {
        name: droppedFile.name,
        size: `${Math.round(droppedFile.size / 1024)} KB`,
        type: droppedFile.name.endsWith('.pdf') ? 'pdf' :
              droppedFile.name.endsWith('.xlsx') ? 'xlsx' :
              droppedFile.name.endsWith('.pptx') ? 'pptx' :
              droppedFile.type.startsWith('image/') ? 'image' : 'docx',
        url: '#'
      };

      setFiles((prev) => [...prev, newDoc]);
      showToast(`File "${droppedFile.name}" uploaded successfully!`, 'success');

      // Create new chat announcement message
      const fileMsg: Message = {
        id: Math.random().toString(),
        senderId: user?.id || 'guest',
        senderName: user?.name || 'Guest User',
        senderRole: user?.role as any || 'candidate',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        text: `Uploaded a file: ${droppedFile.name}`,
        timestamp: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: {
          name: newDoc.name,
          size: newDoc.size,
          type: newDoc.type,
          url: '#'
        }
      };
      setMessages((prev) => [...prev, fileMsg]);
    }
  };

  const handleVoiceRecord = () => {
    if (voiceRecording) {
      // Stop and send voice note
      setVoiceRecording(false);
      const newVoiceMsg: Message = {
        id: Math.random().toString(),
        senderId: user?.id || 'guest',
        senderName: user?.name || 'Guest User',
        senderRole: user?.role as any || 'candidate',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        text: `🎤 Voice note (${voiceSeconds}s)`,
        timestamp: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, newVoiceMsg]);
      showToast('Voice message sent!', 'success');
    } else {
      // Start recording
      setVoiceRecording(true);
    }
  };

  const handleSmartSuggestion = (text: string) => {
    setInputText(text);
  };

  // Helper file icons selector
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'pptx':
        return <FileWarning className="w-5 h-5 text-orange-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-8xl mx-auto h-[calc(100vh-140px)] relative"
      onDragOver={handleDragOver}
    >
      {/* File Drag and Drop Overlay */}
      {dragOver && (
        <div 
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="absolute inset-0 z-50 bg-primary/20 backdrop-blur-md border-4 border-dashed border-primary rounded-3xl flex flex-col items-center justify-center pointer-events-auto"
        >
          <div className="p-6 rounded-full bg-white dark:bg-slate-900 shadow-xl mb-4 text-primary animate-bounce">
            <Paperclip className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Drop your files here</h2>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-2">Upload resumes, guides, or assessments instantly.</p>
        </div>
      )}

      {/* Left Sidebar: Room Details & Active Files */}
      <div className="hidden lg:flex flex-col gap-4 text-left h-full overflow-y-auto pr-1">
        {/* Active room card */}
        <div className="glass-effect p-5 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 space-y-4">
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
            In Progress
          </span>
          <div>
            <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">Senior Frontend Developer</h4>
            <p className="text-xs text-slate-450 mt-0.5">TechCorp Solutions</p>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1">
            <p>ID: INT-2024-0587</p>
            <p>Date: May 28, 2024</p>
            <p>Mode: Google Meet</p>
          </div>
        </div>

        {/* Files Panel */}
        <div className="glass-effect p-5 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Shared Files</h4>
            <button 
              onClick={() => showToast('Triggering file select dialogue...', 'info')}
              className="p-1 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {files.map((file, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                    <span className="text-[9px] text-slate-400 font-semibold">{file.size}</span>
                  </div>
                </div>
                <button 
                  onClick={() => showToast(`Downloading ${file.name}...`, 'success')}
                  className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-primary transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Chat Panel */}
      <div className="lg:col-span-2 flex flex-col h-full glass-effect rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 overflow-hidden bg-white dark:bg-slate-900 shadow-sm text-left">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Interview Discussion</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Ask questions or share feedback with panel members</p>
          </div>
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Messaging Box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex gap-3 items-start ${isMe ? 'flex-row-reverse' : ''}`}>
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-850 object-cover mt-0.5"
                />

                <div className="space-y-1 max-w-[75%]">
                  {/* Sender details */}
                  <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-200">{msg.senderName}</span>
                    <span className="text-[9px] font-bold text-primary px-1.5 py-0.2 bg-primary/10 rounded-sm uppercase tracking-wider capitalize">
                      {msg.senderRole}
                    </span>
                    <span className="text-[8px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  {/* Bubble content */}
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs border ${
                    isMe 
                      ? 'bg-primary text-white border-primary/20 rounded-tr-none' 
                      : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-800 rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                    
                    {/* Embedded file attachments */}
                    {msg.file && (
                      <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2 min-w-0">
                          {getFileIcon(msg.file.type)}
                          <div className="min-w-0">
                            <p className="font-bold text-[11px] truncate">{msg.file.name}</p>
                            <span className="text-[9px] text-slate-400">{msg.file.size}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => showToast(`Downloading ${msg.file?.name}...`, 'success')}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-md text-slate-450 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reaction Pill Rows */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                      {msg.reactions.map((r, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => handleReaction(msg.id, r.emoji)}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-850 bg-white/70 dark:bg-slate-800/70 text-[10px] text-slate-500 hover:border-primary/30 transition-all font-medium"
                          title={`Reacted by ${r.users.join(', ')}`}
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-start">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                alt="Typing..."
                className="w-8 h-8 rounded-full border border-slate-100 object-cover mt-0.5 animate-pulse"
              />
              <div className="bg-slate-200/50 dark:bg-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800/60 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          {/* Audio recording indicators */}
          {voiceRecording && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                <span className="font-bold">Recording Voice Note...</span>
              </div>
              <span className="font-mono font-bold text-slate-800 dark:text-white">
                {Math.floor(voiceSeconds / 60)}:{(voiceSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-end gap-2.5 bg-slate-50 dark:bg-slate-950 p-2 border border-slate-200 dark:border-slate-800 rounded-2xl focus-within:border-primary/55 transition-all">
            <div className="flex gap-1">
              <button 
                type="button" 
                onClick={() => showToast('Attach file overlay: drop files or select files.', 'info')}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Attach Files"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button 
                type="button"
                onClick={() => showToast('Emoji list modal would render here.', 'info')}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Add Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>

              <button 
                type="button"
                onClick={() => showToast('Type "@" to reference interviewer or candidates.', 'info')}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Reference member"
              >
                <AtSign className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write your message..."
              rows={1}
              className="flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-0 resize-none py-2 px-1 max-h-20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />

            <div className="flex gap-1.5 items-center">
              <button
                type="button"
                onClick={handleVoiceRecord}
                className={`p-2 rounded-xl transition-all ${
                  voiceRecording 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={voiceRecording ? "Send Recording" : "Record voice message"}
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Information Panel */}
      <div className="hidden lg:flex flex-col gap-4 text-left h-full overflow-y-auto pl-1">
        {/* Active Participants List */}
        <div className="glass-effect p-5 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
            Participants (4)
          </h4>

          <div className="space-y-3">
            {/* Host */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt="Priya Sharma"
                  className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-150 flex items-center gap-1.5 truncate">
                  <span>Priya Sharma</span>
                  <span className="text-[8px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 rounded-sm">Host</span>
                </h5>
                <span className="text-[9px] text-slate-400">HR Recruiter</span>
              </div>
            </div>

            {/* Panel 1 */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
                  alt="John Smith"
                  className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-150 truncate">John Smith</h5>
                <span className="text-[9px] text-slate-400">Senior Frontend Dev</span>
              </div>
            </div>

            {/* Panel 2 */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                  alt="Alex Brown"
                  className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-150 truncate">Alex Brown</h5>
                <span className="text-[9px] text-slate-400">Engineering Manager</span>
              </div>
            </div>

            {/* Candidate */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                  alt="David Lee"
                  className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-150 flex items-center gap-1.5 truncate">
                  <span>David Lee</span>
                  <span className="text-[8px] font-bold text-primary bg-primary/10 px-1 rounded-sm">You</span>
                </h5>
                <span className="text-[9px] text-slate-400">Candidate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Messages panel */}
        <div className="glass-effect p-5 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
            <Pin className="w-4 h-4 text-slate-400" /> Pinned Messages
          </h4>

          <div className="space-y-3.5">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200">Priya Sharma</span>
                <span className="text-[8px] text-slate-400">May 27</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Please focus on system design and React performance optimization templates.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200">Emily Johnson</span>
                <span className="text-[8px] text-slate-400">May 27</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Also check his experience with team collaboration and agile methodologies.
              </p>
            </div>
          </div>
        </div>

        {/* AI Suggested Question Panel */}
        <div className="glass-effect p-5 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Smart Suggestions
          </h4>
          <p className="text-[10px] text-slate-405 dark:text-slate-400 leading-relaxed mb-4">
            AI suggested interview prep questions. Click one to paste it into the editor.
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleSmartSuggestion('Can we review concurrent rendering in React 19?')}
              className="w-full text-left p-2.5 bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/10 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              • Can we review concurrent rendering in React 19?
            </button>

            <button
              onClick={() => handleSmartSuggestion('What is the team structure for the Frontend panel?')}
              className="w-full text-left p-2.5 bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/10 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              • What is the team structure for the Frontend panel?
            </button>

            <button
              onClick={() => handleSmartSuggestion('Are there specific system design areas I should prepare?')}
              className="w-full text-left p-2.5 bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/10 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              • Are there specific system design areas I should prepare?
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
