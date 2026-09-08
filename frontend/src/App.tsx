import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { GoldenDemoModal } from './components/demo/GoldenDemoModal';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { ChallengeExplorer } from './pages/public/ChallengeExplorer';
import { ChallengeDetail } from './pages/public/ChallengeDetail';
import { AboutFramework } from './pages/public/AboutFramework';
import { LoginPage } from './pages/auth/LoginPage';
import { SubmitChallengeWizard } from './pages/citizen/SubmitChallengeWizard';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { GovernmentDashboard } from './pages/government/GovernmentDashboard';
import { SystemicClusters } from './pages/government/SystemicClusters';
import { GeospatialRadar } from './pages/government/GeospatialRadar';
import { ImpactAnalytics } from './pages/government/ImpactAnalytics';
import { UniversityDashboard } from './pages/university/UniversityDashboard';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { IndustryDashboard } from './pages/industry/IndustryDashboard';
import { ProjectWorkspace } from './pages/projects/ProjectWorkspace';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const AppContent: React.FC = () => {
  const [goldenDemoOpen, setGoldenDemoOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onOpenGoldenDemo={() => setGoldenDemoOpen(true)} />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage onOpenGoldenDemo={() => setGoldenDemoOpen(true)} />} />
          <Route path="/about" element={<AboutFramework />} />
          <Route path="/challenges" element={<ChallengeExplorer />} />
          <Route path="/challenge/:id" element={<ChallengeDetail />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Citizen Portal */}
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
          <Route path="/citizen/challenges/new" element={<SubmitChallengeWizard />} />
          <Route path="/citizen/challenges/:id" element={<ChallengeDetail />} />

          {/* Government / ULB Portal */}
          <Route path="/government/dashboard" element={<GovernmentDashboard />} />
          <Route path="/government/challenges" element={<ChallengeExplorer />} />
          <Route path="/government/clusters" element={<SystemicClusters />} />
          <Route path="/government/map" element={<GeospatialRadar />} />
          <Route path="/government/analytics" element={<ImpactAnalytics />} />

          {/* University Portal */}
          <Route path="/university/dashboard" element={<UniversityDashboard />} />
          <Route path="/university/matches" element={<ChallengeExplorer />} />

          {/* Faculty & Student Modules */}
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />

          {/* Industry / CSR Portal */}
          <Route path="/industry/dashboard" element={<IndustryDashboard />} />

          {/* Collaborative Project Workspace */}
          <Route path="/projects/:id" element={<ProjectWorkspace />} />

          {/* Admin Panel */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Interactive Golden Demo Scenario Guide */}
      <GoldenDemoModal
        isOpen={goldenDemoOpen}
        onClose={() => setGoldenDemoOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
