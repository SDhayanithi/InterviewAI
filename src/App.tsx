import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { CandidateCalendar } from './pages/CandidateCalendar';
import { CandidateSettings } from './pages/CandidateSettings';
import { CandidateDocuments } from './pages/CandidateDocuments';
import { CandidateInterviews } from './pages/CandidateInterviews';
import { InterviewDetails } from './pages/InterviewDetails';
import { InterviewRoom } from './pages/InterviewRoom';
import { InterviewChat } from './pages/InterviewChat';
import { HRDashboard } from './pages/HRDashboard';
import { HRCandidates } from './pages/HRCandidates';
import { HRCalendar } from './pages/HRCalendar';
import { HRPipeline } from './pages/HRPipeline';
import { HRSettings } from './pages/HRSettings';
import { HRInterviews } from './pages/HRInterviews';
import { AdminPortal } from './pages/AdminPortal';
import { DashboardLayout } from './layouts/DashboardLayout';
import { NotificationProvider } from './context/NotificationContext';
import { AIChatProvider } from './context/AIChatContext';
const AIChatWidget = lazy(() => import('./components/AIChatWidget').then(m => ({ default: m.AIChatWidget })));
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AIChatProvider>
            <ToastProvider>
              <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Private Dashboard Shell Routes */}
              <Route element={<DashboardLayout />}>
                {/* Candidate Portal */}
                <Route path="/candidate" element={<CandidateDashboard />} />
                <Route path="/candidate/interviews" element={<CandidateInterviews />} />
                <Route path="/candidate/interview/:id" element={<InterviewDetails />} />
                <Route path="/candidate/interview/room/:id" element={<InterviewRoom />} />
                <Route path="/candidate/slots" element={<CandidateCalendar />} />
                <Route path="/candidate/documents" element={<CandidateDocuments />} />
                <Route path="/candidate/messages" element={<InterviewChat />} />
                <Route path="/candidate/settings" element={<CandidateSettings />} />

                {/* HR Coordinator Portal */}
                <Route path="/hr" element={<HRDashboard />} />
                <Route path="/hr/candidates" element={<HRCandidates />} />
                <Route path="/hr/interviews" element={<HRInterviews />} />
                <Route path="/hr/calendar" element={<HRCalendar />} />
                <Route path="/hr/pipeline" element={<HRPipeline />} />
                <Route path="/hr/messages" element={<InterviewChat />} />
                <Route path="/hr/settings" element={<HRSettings />} />

                {/* Administrator Security Portal */}
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/admin/users" element={<AdminPortal />} />
                <Route path="/admin/permissions" element={<AdminPortal />} />
                <Route path="/admin/calendar" element={<AdminPortal />} />
                <Route path="/admin/settings" element={<AdminPortal />} />
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Suspense fallback={null}>
              <AIChatWidget />
            </Suspense>
          </BrowserRouter>
            </ToastProvider>
          </AIChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
