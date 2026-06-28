export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'hr' | 'admin';
  avatar: string;
}

export interface Interviewer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

export interface DocumentFile {
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'image';
  url: string;
}

export interface InterviewTimelineEvent {
  title: string;
  date: string;
  status: 'done' | 'active' | 'upcoming';
  description?: string;
}

export interface Interview {
  id: string;
  title: string;
  company: string;
  date: string;
  time: string;
  duration: string;
  meetLink: string;
  status: 'scheduled' | 'confirmed' | 'upcoming' | 'completed' | 'cancelled';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: string;
  panel: Interviewer[];
  documents: DocumentFile[];
  timeline: InterviewTimelineEvent[];
  notes?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user names
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'candidate' | 'hr' | 'admin' | 'interviewer';
  senderAvatar: string;
  text: string;
  timestamp: string;
  reactions?: MessageReaction[];
  isPinned?: boolean;
  file?: {
    name: string;
    size: string;
    type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'image';
    url: string;
  };
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  stage: 'applied' | 'screening' | 'technical' | 'hr' | 'offer';
  avatar: string;
  lastActive: string;
  score: number; // AI score out of 100
  notes: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface CalendarSlot {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  candidateName?: string;
  interviewerName?: string;
}
