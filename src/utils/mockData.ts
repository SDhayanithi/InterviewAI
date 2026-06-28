import type { User, Interviewer, Interview, Message, Candidate, SystemNotification, CalendarSlot } from '../types';

export const mockUsers = {
  candidate: {
    id: 'cand-01',
    name: 'David Lee',
    email: 'david.lee@gmail.com',
    role: 'candidate' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  hr: {
    id: 'hr-01',
    name: 'Priya Sharma',
    email: 'priya.sharma@interviewai.com',
    role: 'hr' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  admin: {
    id: 'admin-01',
    name: 'Sarah Connor',
    email: 'admin@interviewai.com',
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  }
};

export const mockInterviewers: Interviewer[] = [
  {
    id: 'int-1',
    name: 'John Smith',
    role: 'Senior Frontend Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    email: 'john.smith@techcorp.com'
  },
  {
    id: 'int-2',
    name: 'Emily Johnson',
    role: 'HR Recruiter',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    email: 'emily.j@techcorp.com'
  },
  {
    id: 'int-3',
    name: 'Alex Brown',
    role: 'Engineering Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    email: 'alex.brown@techcorp.com'
  }
];

export const mockInterviews: Interview[] = [
  {
    id: 'INT-2024-0587',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    date: 'Wednesday, 28 May 2024',
    time: '10:30 AM - 11:30 AM (IST)',
    duration: '60 Minutes',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'confirmed',
    difficulty: 'Advanced',
    type: 'Technical + HR',
    panel: mockInterviewers,
    documents: [
      { name: 'Job Description', size: '245 KB', type: 'docx', url: '#' },
      { name: 'Your Resume', size: '658 KB', type: 'pdf', url: '#' },
      { name: 'Interview Guidelines', size: '312 KB', type: 'pdf', url: '#' },
      { name: 'Company Overview', size: '1.2 MB', type: 'pdf', url: '#' },
    ],
    timeline: [
      { title: 'Interview Scheduled', date: 'May 24, 2024', status: 'done', description: 'Initial slot selected by candidate' },
      { title: 'Interview Confirmed', date: 'May 24, 2024', status: 'done', description: 'Interviewer availability matched' },
      { title: 'Upcoming Interview', date: 'May 28, 2024 at 10:30 AM', status: 'active', description: 'Technical round + Portfolio discussion' },
      { title: 'Interview Completed', date: 'Pending', status: 'upcoming', description: 'Standard feedback compilation' },
      { title: 'Feedback Received', date: 'Pending', status: 'upcoming', description: 'Score card grading by panelists' },
      { title: 'Decision', date: 'Pending', status: 'upcoming', description: 'Offer release or screening' }
    ]
  },
  {
    id: 'INT-2024-0982',
    title: 'Technical Architect',
    company: 'InnovateX',
    date: 'Friday, 30 May 2024',
    time: '11:00 AM - 12:00 PM (IST)',
    duration: '60 Minutes',
    meetLink: 'https://meet.google.com/xyz-uvwx-yza',
    status: 'scheduled',
    difficulty: 'Advanced',
    type: 'System Design',
    panel: [mockInterviewers[0], mockInterviewers[2]],
    documents: [
      { name: 'System Design Spec', size: '1.4 MB', type: 'pdf', url: '#' },
      { name: 'Your Resume', size: '658 KB', type: 'pdf', url: '#' }
    ],
    timeline: [
      { title: 'Interview Scheduled', date: 'May 26, 2024', status: 'done' },
      { title: 'Interview Confirmed', date: 'May 27, 2024', status: 'done' },
      { title: 'Upcoming Interview', date: 'May 30, 2024', status: 'active' }
    ]
  },
  {
    id: 'INT-2024-1102',
    title: 'Senior Frontend Developer',
    company: 'BrightMind Technologies',
    date: 'Thursday, 05 June 2024',
    time: '03:00 PM - 04:00 PM (IST)',
    duration: '60 Minutes',
    meetLink: 'https://meet.google.com/mnp-qrst-uvw',
    status: 'scheduled',
    difficulty: 'Advanced',
    type: 'Behavioral Round',
    panel: [mockInterviewers[1]],
    documents: [
      { name: 'Behavioral Prep Sheet', size: '120 KB', type: 'pdf', url: '#' }
    ],
    timeline: [
      { title: 'Interview Scheduled', date: 'May 27, 2024', status: 'done' }
    ]
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@email.com',
    role: 'Frontend Developer',
    stage: 'technical',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    lastActive: '2 hours ago',
    score: 88,
    notes: 'Strong in React 19 concurrent features. Needs validation on CSS-in-JS architecture.'
  },
  {
    id: 'cand-2',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@email.com',
    role: 'Product Designer',
    stage: 'hr',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    lastActive: '4 hours ago',
    score: 94,
    notes: 'Outstanding portfolio. Strong systems thinking and visual aesthetics matches Stripe standard.'
  },
  {
    id: 'cand-3',
    name: 'Arjun Nair',
    email: 'arjun.nair@email.com',
    role: 'Backend Developer',
    stage: 'technical',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    lastActive: '1 day ago',
    score: 82,
    notes: 'Competent in distributed databases. Good query optimization logic.'
  },
  {
    id: 'cand-4',
    name: 'Kavya Singh',
    email: 'kavya.singh@email.com',
    role: 'HR Recruiter',
    stage: 'screening',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    lastActive: '1 day ago',
    score: 75,
    notes: 'Good communication. Initial screening completed successfully.'
  },
  {
    id: 'cand-5',
    name: 'Aditya Verma',
    email: 'aditya.verma@email.com',
    role: 'DevOps Engineer',
    stage: 'applied',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    lastActive: '2 days ago',
    score: 91,
    notes: 'Excellent Terraform and AWS proficiency. Highly recommended for infra panel.'
  }
];

export const mockNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Your interview with TechCorp Solutions is confirmed',
    description: 'Scheduled for May 28, 2024 at 10:30 AM. Join link is now active.',
    time: 'May 27, 2024 • 10:15 AM',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-2',
    title: 'New interview slot available for Senior Frontend Developer',
    description: 'AI detected a conflict-free match on May 30, 2024.',
    time: 'May 26, 2024 • 09:30 AM',
    read: false,
    type: 'info'
  },
  {
    id: 'notif-3',
    title: 'Feedback Form pending completion',
    description: 'Emily Johnson requested notes on candidate Sneha Iyer.',
    time: 'May 25, 2024 • 02:00 PM',
    read: true,
    type: 'warning'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'hr-01',
    senderName: 'Priya Sharma',
    senderRole: 'hr',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    text: 'Hi team, please review John\'s resume. He has good experience in React and system design.',
    timestamp: 'May 27, 2024 • 09:20 AM',
    reactions: [
      { emoji: '👍', count: 2, users: ['Emily Johnson', 'Alex Brown'] },
      { emoji: '👀', count: 1, users: ['Emily Johnson'] }
    ]
  },
  {
    id: 'msg-2',
    senderId: 'int-2',
    senderName: 'Emily Johnson',
    senderRole: 'interviewer',
    senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    text: 'Looks good to me. I especially like his project on real-time chat applications.',
    timestamp: 'May 27, 2024 • 09:22 AM',
    reactions: [
      { emoji: '👍', count: 1, users: ['Priya Sharma'] }
    ]
  },
  {
    id: 'msg-3',
    senderId: 'int-3',
    senderName: 'Alex Brown',
    senderRole: 'interviewer',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    text: 'I\'ve added the technical assessment deck. Please check.',
    timestamp: 'May 27, 2024 • 09:24 AM',
    file: {
      name: 'Technical_Assessment.pptx',
      size: '1.2 MB',
      type: 'pptx',
      url: '#'
    },
    reactions: [
      { emoji: '👍', count: 1, users: ['Emily Johnson'] }
    ]
  },
  {
    id: 'msg-4',
    senderId: 'cand-01',
    senderName: 'David Lee',
    senderRole: 'candidate',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    text: 'Great! I\'ll schedule the interview and share the Google Meet link shortly.',
    timestamp: 'May 27, 2024 • 09:25 AM',
    reactions: [
      { emoji: '👍', count: 2, users: ['Priya Sharma', 'Emily Johnson'] }
    ]
  },
  {
    id: 'msg-5',
    senderId: 'int-2',
    senderName: 'Emily Johnson',
    senderRole: 'interviewer',
    senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    text: 'Perfect! 🔥',
    timestamp: 'May 27, 2024 • 09:26 AM'
  },
  {
    id: 'msg-6',
    senderId: 'hr-01',
    senderName: 'Priya Sharma',
    senderRole: 'hr',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    text: 'Reminder: Interview starts in 30 minutes. 🔔',
    timestamp: 'May 28, 2024 • 09:00 AM',
    reactions: [
      { emoji: '🙏', count: 3, users: ['David Lee', 'John Smith', 'Alex Brown'] }
    ]
  }
];

export const mockCalendarEvents: CalendarSlot[] = [
  {
    id: 'cal-1',
    title: 'Rohan Mehta - Technical Round',
    start: new Date(2024, 4, 28, 10, 0),
    end: new Date(2024, 4, 28, 11, 0),
    status: 'upcoming',
    candidateName: 'Rohan Mehta',
    interviewerName: 'John Smith'
  },
  {
    id: 'cal-2',
    title: 'Sneha Iyer - HR Round',
    start: new Date(2024, 4, 28, 11, 30),
    end: new Date(2024, 4, 28, 12, 30),
    status: 'upcoming',
    candidateName: 'Sneha Iyer',
    interviewerName: 'Emily Johnson'
  },
  {
    id: 'cal-3',
    title: 'David Lee - Senior Frontend Dev',
    start: new Date(2024, 4, 28, 10, 30),
    end: new Date(2024, 4, 28, 11, 30),
    status: 'upcoming',
    candidateName: 'David Lee',
    interviewerName: 'John Smith'
  },
  {
    id: 'cal-4',
    title: 'Arjun Nair - Backend Review',
    start: new Date(2024, 4, 29, 14, 0),
    end: new Date(2024, 4, 29, 15, 0),
    status: 'upcoming',
    candidateName: 'Arjun Nair',
    interviewerName: 'Alex Brown'
  },
  {
    id: 'cal-5',
    title: 'System Architecture Prep',
    start: new Date(2024, 4, 27, 9, 0),
    end: new Date(2024, 4, 27, 10, 0),
    status: 'completed',
    candidateName: 'David Lee',
    interviewerName: 'John Smith'
  }
];

export const mockInterviewTips = [
  'Review the job description thoroughly to align your project examples.',
  'Practice common technical questions regarding React 19 (e.g. hooks, Server Actions, suspense).',
  'Ensure a stable, quiet internet connection and check Google Meet settings.',
  'Join the room 5 minutes early to test audio & video equipment.'
];

export const adminSystemMetrics = {
  serverStatus: 'Healthy',
  cpuUsage: '14.2%',
  memoryUsage: '3.4 GB / 8 GB (42.5%)',
  uptime: '28 days, 4 hours',
  activeConnections: '2,482',
  databaseLatency: '8ms',
  storageUsed: '62.4 GB / 100 GB (62.4%)',
  backups: [
    { time: 'Today, 03:00 AM', status: 'Success', size: '1.2 GB' },
    { time: 'Yesterday, 03:00 AM', status: 'Success', size: '1.18 GB' },
    { time: '26 May 2024, 03:00 AM', status: 'Success', size: '1.19 GB' }
  ],
  auditLogs: [
    { time: '10 mins ago', action: 'Role Update', details: 'User rohan.mehta promoted to Technical Round' },
    { time: '42 mins ago', action: 'Security alert', details: 'Successful admin login from IP 192.168.1.42' },
    { time: '1 hour ago', action: 'Integrations sync', details: 'Google Calendar API batch sync completed successfully' },
    { time: '3 hours ago', action: 'Billing update', details: 'TechCorp Solutions renewed Professional tier license' }
  ]
};
