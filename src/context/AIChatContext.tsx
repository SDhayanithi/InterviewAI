import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  time: string;
  isStreaming?: boolean;
  liked?: boolean;
  disliked?: boolean;
  files?: Array<{ name: string; size: string }>;
  isChecklist?: boolean;
  isSummary?: boolean;
  cardType?: 'interview_slots' | 'reschedule_slots' | 'resume_score' | 'tips' | 'email' | 'loop_summary' | 'status_stepper' | 'checklist' | 'normal';
  cardData?: any;
}

interface AIChatReply {
  text: string;
  cardType: 'interview_slots' | 'reschedule_slots' | 'resume_score' | 'tips' | 'email' | 'loop_summary' | 'status_stepper' | 'checklist' | 'normal';
  cardData?: any;
}

interface AIChatContextType {
  chatMessages: ChatMessage[];
  isOpen: boolean;
  isMinimized: boolean;
  isListening: boolean;
  isVoiceOutputEnabled: boolean;
  isTypingSpeech: boolean;
  setIsOpen: (open: boolean) => void;
  setIsMinimized: (minimized: boolean) => void;
  setIsVoiceOutputEnabled: (enabled: boolean) => void;
  sendMessage: (text: string, files?: Array<{ name: string; size: string }>) => void;
  triggerVoiceMock: () => void;
  clearHistory: () => void;
  likeMessage: (id: string) => void;
  dislikeMessage: (id: string) => void;
  regenerateLastMessage: () => void;
  generateChecklist: () => void;
  generateMeetingSummary: () => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [isTypingSpeech, setIsTypingSpeech] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('interviewai_chat_history_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-init-1',
        text: "Hello! I am your AI Recruiting Assistant coordinator. I can help you schedule loops, check candidate status, or prepare checklist guides. How can I help you today?",
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('interviewai_chat_history_v2', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const detectQueryType = (query: string): AIChatReply => {
    const q = query.toLowerCase();

    // 1. schedule interview / book interview / book slot
    if (
      q.includes('schedule interview') || 
      q.includes('book interview') || 
      q.includes('book slot') || 
      q.includes('schedule') || 
      q.includes('slots') || 
      q.includes('available') ||
      q.includes('book')
    ) {
      return {
        text: "I've fetched the available slots for your Technical interview loop. Please select one of the following:",
        cardType: 'interview_slots',
        cardData: {
          slots: [
            { id: 'slot-1', date: 'Friday, May 30', time: '11:00 AM - 12:00 PM', location: 'Google Meet' },
            { id: 'slot-2', date: 'Monday, June 02', time: '10:00 AM - 11:00 AM', location: 'Google Meet' }
          ]
        }
      };
    }

    // 2. reschedule
    if (q.includes('reschedule') || q.includes('move')) {
      return {
        text: "Sure, let's reschedule your interview loop. Here is your current booking and alternative slots:",
        cardType: 'reschedule_slots',
        cardData: {
          current: { id: 'INT-2024-0587', title: 'Technical Loop with John Smith', date: 'May 29 at 02:00 PM' },
          warning: 'Moving this slot will conflict with your calendar sync slot.',
          slots: [
            { id: 'reslot-1', date: 'Friday, May 30', time: '11:00 AM' },
            { id: 'reslot-2', date: 'Monday, June 02', time: '10:00 AM' }
          ]
        }
      };
    }

    // 3. resume review
    if (q.includes('resume review') || q.includes('resume') || q.includes('feedback')) {
      return {
        text: "I've completed an ATS scan and review of your resume (David_Lee_Resume.pdf):",
        cardType: 'resume_score',
        cardData: {
          score: 88,
          atsScore: 85,
          strengths: ['React 19 Hooks', 'TypeScript typing models', 'Tailwind styling'],
          weaknesses: ['Needs dynamic calendar layout examples', 'Lacks vocal interface highlights'],
          missingKeywords: ['dynamic scheduling', 'vocal hook optimization']
        }
      };
    }

    // 4. interview tips
    if (q.includes('interview tips') || q.includes('tip') || q.includes('prep') || q.includes('prepare')) {
      return {
        text: "Here are some custom preparation tips to excel in your upcoming Senior Frontend Loop:",
        cardType: 'tips',
        cardData: {
          technicalTips: 'Brush up on React 19 concurrent features and async data streams.',
          behavioralQuestions: 'Be prepared to talk about sprint structures and how you resolve engineering disputes.',
          companyResearch: 'TechCorp is focused on building high-performance collaborative workspaces.',
          codingTopics: 'System architecture, state management, and asset loading optimizations.',
          checklist: ['Bring resume PDF', 'Test camera and microphone quality', 'Have a working IDE ready']
        }
      };
    }

    // 5. generate email
    if (q.includes('generate email') || q.includes('email') || q.includes('letter')) {
      return {
        text: "Here is a professional email template to follow up on your interview loop status:",
        cardType: 'email',
        cardData: {
          subject: 'Follow-up on Technical Loop Status - David Lee',
          body: `Dear Priya,

I hope this email finds you well. 

I wanted to follow up on the status of my Technical Loop interview completed yesterday. I really enjoyed speaking with the team and discussing my frontend system design expertise.

I look forward to hearing about the next steps.

Best regards,
David Lee`
        }
      };
    }

    // 6. loop summary
    if (q.includes('loop summary') || q.includes('summary') || q.includes('debrief')) {
      return {
        text: "Here is the summary report of your interview loop progression:",
        cardType: 'loop_summary',
        cardData: {
          candidate: 'David Lee',
          role: 'Senior Frontend Developer',
          stage: 'Technical Loop',
          interviewers: ['John Smith', 'Alex Brown'],
          status: 'Feedback Pending',
          feedbackPending: true,
          offerStatus: 'Under Review'
        }
      };
    }

    // 7. candidate status
    if (q.includes('candidate status') || q.includes('status') || q.includes('hiring')) {
      return {
        text: "Here is the candidate loop progression status:",
        cardType: 'status_stepper',
        cardData: {
          stages: [
            { name: 'Applied', status: 'completed' },
            { name: 'Screening', status: 'completed' },
            { name: 'Technical', status: 'completed' },
            { name: 'HR', status: 'active' },
            { name: 'Offer', status: 'pending' }
          ]
        }
      };
    }

    // 8. checklist
    if (q.includes('checklist') || q.includes('guide')) {
      return {
        text: "Here is your custom checklist preparation tracker:",
        cardType: 'checklist',
        cardData: {
          items: [
            { text: 'Review Core React 19 Hooks', completed: true },
            { text: 'Prepare Behavioral Answers (STAR format)', completed: false },
            { text: 'Research TechCorp Culture', completed: false },
            { text: 'Complete System Design Mockup', completed: false },
            { text: 'Verify Audio/Video settings', completed: true }
          ]
        }
      };
    }

    // 9. Default fallback
    const name = user?.name.split(' ')[0] || 'there';
    return {
      text: `Hi ${name}, I can help you coordinate interview loops, sync schedules, review guidelines, or verify documents. Ask me about slots, status checks, or checklists!`,
      cardType: 'normal'
    };
  };

  const streamAIMessage = (reply: AIChatReply, customFields?: Partial<ChatMessage>) => {
    const newId = `msg-ai-${Date.now()}`;
    const emptyMsg: ChatMessage = {
      id: newId,
      text: '',
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      cardType: reply.cardType,
      cardData: reply.cardData,
      ...customFields
    };

    setChatMessages((prev) => [...prev, emptyMsg]);

    let currentLength = 0;
    const replyText = reply.text;
    const interval = setInterval(() => {
      currentLength += Math.min(4, replyText.length - currentLength);
      const partialText = replyText.substring(0, currentLength);

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === newId
            ? { ...msg, text: partialText, isStreaming: currentLength < replyText.length }
            : msg
        )
      );

      if (currentLength >= replyText.length) {
        clearInterval(interval);
        
        if (isVoiceOutputEnabled) {
          const speech = new SpeechSynthesisUtterance(replyText);
          speech.rate = 1.05;
          window.speechSynthesis?.speak(speech);
        }
      }
    }, 20);
  };

  const sendMessage = (text: string, files?: Array<{ name: string; size: string }>) => {
    if (!text.trim() && (!files || files.length === 0)) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsTypingSpeech(true);

    setTimeout(() => {
      setIsTypingSpeech(false);
      const reply = detectQueryType(text || (files ? files[0].name : ''));
      streamAIMessage(reply);
    }, 1000);
  };

  const regenerateLastMessage = () => {
    const userMsgs = chatMessages.filter((m) => m.sender === 'user');
    if (userMsgs.length === 0) return;
    const lastUserMsg = userMsgs[userMsgs.length - 1];

    setIsTypingSpeech(true);
    setTimeout(() => {
      setIsTypingSpeech(false);
      const reply = detectQueryType(lastUserMsg.text);
      streamAIMessage({
        ...reply,
        text: reply.text + " (Regenerated)"
      });
    }, 1000);
  };

  const triggerVoiceMock = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setIsTypingSpeech(true);
      setTimeout(() => {
        setIsTypingSpeech(false);
        const voiceText = "Show me custom preparation tips for Frontend developers.";
        sendMessage(voiceText);
      }, 800);
    }, 2000);
  };

  const generateChecklist = () => {
    setIsTypingSpeech(true);
    setTimeout(() => {
      setIsTypingSpeech(false);
      const reply = detectQueryType('checklist');
      streamAIMessage(reply);
    }, 1000);
  };

  const generateMeetingSummary = () => {
    setIsTypingSpeech(true);
    setTimeout(() => {
      setIsTypingSpeech(false);
      const reply = detectQueryType('loop summary');
      streamAIMessage(reply);
    }, 1000);
  };

  const likeMessage = (id: string) => {
    setChatMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: true, disliked: false } : m))
    );
  };

  const dislikeMessage = (id: string) => {
    setChatMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: false, disliked: true } : m))
    );
  };

  const clearHistory = () => {
    setChatMessages([
      {
        id: `msg-init-${Date.now()}`,
        text: "Hello! I am your AI Recruiting Assistant coordinator. I can help you schedule loops, check candidate status, or prepare checklist guides. How can I help you today?",
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <AIChatContext.Provider
      value={{
        chatMessages,
        isOpen,
        isMinimized,
        isListening,
        isVoiceOutputEnabled,
        isTypingSpeech,
        setIsOpen,
        setIsMinimized,
        setIsVoiceOutputEnabled,
        sendMessage,
        triggerVoiceMock,
        clearHistory,
        likeMessage,
        dislikeMessage,
        regenerateLastMessage,
        generateChecklist,
        generateMeetingSummary
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};
