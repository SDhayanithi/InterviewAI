import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Paperclip, MessageSquare, Mic, Sparkles, Smile,
  Search, Pin, CornerDownRight, FileText, FileSpreadsheet,
  FileCheck, Image as ImageIcon, ChevronRight, X, Play, Pause,
  Users, Check, CheckCheck, Info, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockMessages } from '../utils/mockData';
import type { Message, MessageReaction } from '../types';

export const InterviewChat: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThread, setActiveThread] = useState<Message | null>(null);
  const [threadText, setThreadText] = useState('');
  const [threadReplies, setThreadReplies] = useState<Record<string, Message[]>>({
    'msg-1': [
      {
        id: 'reply-1',
        senderId: 'int-1',
        senderName: 'John Smith',
        senderRole: 'interviewer',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        text: 'I already looked, looks really promising.',
        timestamp: 'May 27, 2024 • 09:21 AM'
      }
    ]
  });

  const [isTyping, setIsTyping] = useState(false);
  const [notes, setNotes] = useState<string>('Candidate shows strong fundamentals. Need to verify CSS Architecture and Framer Motion expertise.');
  const [dragActive, setDragActive] = useState(false);
  
  // Audio state
  const [recording, setRecording] = useState(false);
  const [audioPlayId, setAudioPlayId] = useState<string | null>(null);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadReplies, activeThread]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'cand-01',
      senderName: user?.name || 'David Lee',
      senderRole: (user?.role as any) || 'candidate',
      senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: inputText,
      timestamp: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate Recruiter Typing back
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: 'hr-01',
          senderName: 'Priya Sharma',
          senderRole: 'hr',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          text: `Got your message. We are reviewing the notes. I will update the dashboard details. Let me know if you need anything else!`,
          timestamp: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: []
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 2000);
    }, 1000);
  };

  const handleSendThreadReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !threadText.trim()) return;

    const newReply: Message = {
      id: `reply-${Date.now()}`,
      senderId: user?.id || 'cand-01',
      senderName: user?.name || 'David Lee',
      senderRole: (user?.role as any) || 'candidate',
      senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: threadText,
      timestamp: 'Just now'
    };

    setThreadReplies(prev => ({
      ...prev,
      [activeThread.id]: [...(prev[activeThread.id] || []), newReply]
    }));
    setThreadText('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      uploadMockFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMockFile(e.target.files[0]);
    }
  };

  const uploadMockFile = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let fileType: any = 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) fileType = 'image';
    else if (['xlsx', 'xls', 'csv'].includes(fileExtension || '')) fileType = 'xlsx';
    else if (['docx', 'doc'].includes(fileExtension || '')) fileType = 'docx';

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'cand-01',
      senderName: user?.name || 'David Lee',
      senderRole: (user?.role as any) || 'candidate',
      senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: `Uploaded a file: ${file.name}`,
      timestamp: 'Today',
      file: {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: fileType,
        url: '#'
      }
    };
    setMessages(prev => [...prev, newMsg]);
    showToast(`File "${file.name}" uploaded successfully!`, 'success');
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const reactions = msg.reactions ? [...msg.reactions] : [];
      const existing = reactions.find(r => r.emoji === emoji);
      
      if (existing) {
        if (existing.users.includes(user?.name || '')) {
          // Remove reaction
          existing.users = existing.users.filter(u => u !== user?.name);
          existing.count -= 1;
        } else {
          // Add user to reaction
          existing.users.push(user?.name || '');
          existing.count += 1;
        }
      } else {
        reactions.push({
          emoji,
          count: 1,
          users: [user?.name || '']
        });
      }
      return {
        ...msg,
        reactions: reactions.filter(r => r.count > 0)
      };
    }));
  };

  const togglePinMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      const isPinned = !msg.isPinned;
      showToast(isPinned ? 'Message pinned to chat board' : 'Message unpinned', 'info');
      return { ...msg, isPinned };
    }));
  };

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      // Simulate sending voice message
      const voiceMsg: Message = {
        id: `msg-voice-${Date.now()}`,
        senderId: user?.id || 'cand-01',
        senderName: user?.name || 'David Lee',
        senderRole: (user?.role as any) || 'candidate',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Voice Note (0:12)',
        timestamp: 'Today',
        file: {
          name: 'voice_note_candidate.mp3',
          size: '128 KB',
          type: 'pdf',
          url: 'voice'
        }
      };
      setMessages(prev => [...prev, voiceMsg]);
      showToast('Voice message sent!', 'success');
    } else {
      setRecording(true);
      showToast('Recording voice note... click mic again to send.', 'info');
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedMessages = messages.filter(msg => msg.isPinned);

  const renderFilePreview = (file: { name: string; size: string; type: string; url: string }) => {
    if (file.url === 'voice') {
      return (
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 max-w-sm mt-2">
          <button 
            type="button"
            onClick={() => setAudioPlayId(audioPlayId === file.name ? null : file.name)}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform"
          >
            {audioPlayId === file.name ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-505 dark:text-slate-400">Voice note</span>
              {audioPlayId === file.name && (
                <div className="flex gap-0.5 items-center">
                  <span className="w-0.5 h-2 bg-primary animate-pulse" />
                  <span className="w-0.5 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 h-1.5 bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
              )}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: audioPlayId === file.name ? '100%' : '15%' }}
              />
            </div>
          </div>
          <span className="text-[9px] text-slate-400">{file.size}</span>
        </div>
      );
    }

    const icons: Record<string, React.ReactNode> = {
      pdf: <FileText className="w-8 h-8 text-rose-500" />,
      docx: <FileCheck className="w-8 h-8 text-blue-500" />,
      xlsx: <FileSpreadsheet className="w-8 h-8 text-emerald-500" />,
      image: <ImageIcon className="w-8 h-8 text-violet-500" />
    };

    return (
      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 max-w-sm mt-2 relative overflow-hidden group">
        <div className="flex-shrink-0">
          {icons[file.type] || <FileText className="w-8 h-8 text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
          <p className="text-[9px] text-slate-450 mt-0.5">{file.size} • {file.type.toUpperCase()}</p>
        </div>
        <button 
          type="button"
          onClick={() => showToast(`Previewing ${file.name}...`, 'info')}
          className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          View
        </button>
      </div>
    );
  };

  return (
    <div 
      className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6 text-left relative"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
    >
      {/* Drag & Drop Overlay */}
      <AnimatePresence>
        {dragActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="absolute inset-0 z-50 bg-primary/10 border-4 border-dashed border-primary rounded-3xl backdrop-blur-xs flex flex-col items-center justify-center pointer-events-auto"
          >
            <Paperclip className="w-12 h-12 text-primary animate-bounce mb-2" />
            <h2 className="text-xl font-extrabold text-primary">Drop files here to share</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Images, PDF, Excel sheets are supported.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Board (70%) */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-[24px] shadow-xs overflow-hidden">
        
        {/* Chat Title Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-white flex items-center gap-2">
                #interview-collaboration
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Coordinate logistics, share review assets & checklist tips.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary w-40"
              />
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-950/5">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <MessageSquare className="w-10 h-10 stroke-1 mb-2" />
              <p className="text-xs font-semibold">No messages found.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isCurrentUser = msg.senderId === user?.id;
              return (
                <div key={msg.id} className="flex gap-3 group text-left">
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100 dark:border-slate-850"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white">{msg.senderName}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                        msg.senderRole === 'hr' ? 'bg-secondary/10 text-secondary' :
                        msg.senderRole === 'candidate' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {msg.senderRole}
                      </span>
                      <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                      {msg.isPinned && <Pin className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />}
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-350 mt-1 leading-relaxed break-words">
                      {msg.text}
                    </div>

                    {/* Previews if any */}
                    {msg.file && renderFilePreview(msg.file)}

                    {/* Reactions board */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.reactions.map((react, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => handleAddReaction(msg.id, react.emoji)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] cursor-pointer transition-colors ${
                              react.users.includes(user?.name || '')
                                ? 'bg-primary/10 border-primary text-primary font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-750 text-slate-505'
                            }`}
                          >
                            <span>{react.emoji}</span>
                            <span>{react.count}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Thread indicator if replies exist */}
                    {threadReplies[msg.id] && threadReplies[msg.id].length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveThread(msg)}
                        className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-1.5"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>{threadReplies[msg.id].length} reply</span>
                      </button>
                    )}
                  </div>

                  {/* Micro action bar on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 self-start p-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-lg shadow-sm">
                    <button 
                      type="button"
                      onClick={() => handleAddReaction(msg.id, '👍')}
                      className="text-xs cursor-pointer hover:scale-110 transition-transform"
                    >
                      👍
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleAddReaction(msg.id, '🔥')}
                      className="text-xs cursor-pointer hover:scale-110 transition-transform"
                    >
                      🔥
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveThread(msg)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded"
                      title="Reply in thread"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => togglePinMessage(msg.id)}
                      className="text-slate-400 hover:text-amber-500 p-0.5 rounded"
                      title="Pin message"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex gap-2 items-center text-slate-400">
              <div className="flex gap-1 items-center bg-slate-100 dark:bg-slate-850 p-2 rounded-xl rounded-bl-none">
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span className="text-[10px]">Priya Sharma is typing...</span>
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>

        {/* Input Controls Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 bg-white dark:bg-slate-900">
          
          {/* File Upload Selector */}
          <div className="relative">
            <input 
              type="file" 
              id="chat-file-input" 
              className="hidden" 
              onChange={handleFileInput}
            />
            <label 
              htmlFor="chat-file-input"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center justify-center cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </label>
          </div>

          {/* Chat Input Text field */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message or drop files here..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-850 dark:text-slate-150 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
            />
            
            <button
              type="button"
              onClick={() => showToast('Emoji panel simulation...', 'info')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Note simulated button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              recording
                ? 'bg-rose-500 border-rose-500 text-white animate-pulse'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
            }`}
            title="Record Voice note"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Trigger */}
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/25 transition-all flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Thread & Side Panel (30%) */}
      <AnimatePresence>
        {activeThread && (
          <motion.div 
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 320 }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="w-80 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-[24px] overflow-hidden"
          >
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">Thread</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Replies to {activeThread.senderName}</p>
              </div>
              <button 
                type="button"
                onClick={() => setActiveThread(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thread Parent Message */}
            <div className="p-4 bg-slate-50/30 dark:bg-slate-950/10 border-b border-slate-100 dark:border-slate-850">
              <div className="flex gap-2 text-left">
                <img
                  src={activeThread.senderAvatar}
                  alt={activeThread.senderName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">{activeThread.senderName}</span>
                    <span className="text-[9px] text-slate-450">{activeThread.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">{activeThread.text}</p>
                </div>
              </div>
            </div>

            {/* Thread Replies List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {(threadReplies[activeThread.id] || []).map((reply) => (
                <div key={reply.id} className="flex gap-2 text-left">
                  <img
                    src={reply.senderAvatar}
                    alt={reply.senderName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[11px] text-slate-800 dark:text-white">{reply.senderName}</span>
                      <span className="text-[9px] text-slate-400">{reply.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">{reply.text}</p>
                  </div>
                </div>
              ))}
              <div ref={threadEndRef} />
            </div>

            {/* Thread Input Form */}
            <form onSubmit={handleSendThreadReply} className="p-3 border-t border-slate-100 dark:border-slate-850 flex gap-2">
              <input
                type="text"
                value={threadText}
                onChange={(e) => setThreadText(e.target.value)}
                placeholder="Reply..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
              <button 
                type="submit" 
                className="px-3 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Side Panel (30%) - AI suggestions & shared notes */}
      {!activeThread && (
        <div className="w-full lg:w-80 space-y-6">
          
          {/* AI Assistance Recommendations */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 text-left">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              AI Suggestions
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
              AI scanned the resumes and job details, suggesting these talking points:
            </p>

            <div className="space-y-2">
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed">
                <span className="font-bold text-primary block mb-0.5">Vite + React 19 Performance</span>
                Ask candidate to explain how concurrent rendering and server component bundles solve load bottlenecks.
              </div>
              <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/10 text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed">
                <span className="font-bold text-secondary block mb-0.5">System Design Scope</span>
                Verify scale logic for websocket connection servers holding millions of real-time active loops.
              </div>
            </div>
          </div>

          {/* Shared Interview Notes Panel */}
          <div className="glass-effect p-6 rounded-[20px] border border-slate-200/50 dark:border-slate-800/40 text-left">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white mb-1">
              Collaborative Interview Notes
            </h3>
            <p className="text-[10px] text-slate-400 mb-2">
              Visible to all interview panel members. Updates save in real-time.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed text-slate-700 dark:text-slate-350"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-[9px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Auto-saved
              </span>
              <button 
                type="button"
                onClick={() => showToast('Notes synced across recruiter systems!', 'success')}
                className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Sync Panel
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
