
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, Footer, FloatingQuickAccess } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { TestSelection } from './pages/TestSelection';
import { TestResult } from './pages/TestResult';
import { AgentDashboard } from './pages/AgentDashboard';
import { Profile } from './pages/Profile';
import { Tokens } from './pages/Tokens';
import { FoodScanner } from './pages/FoodScanner';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode, role?: UserRole }> = ({ children, role }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/auth" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/tests" element={<TestSelection />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/tokens" element={<ProtectedRoute><Tokens /></ProtectedRoute>} />
          <Route path="/food-scanner" element={<ProtectedRoute><FoodScanner /></ProtectedRoute>} />
          <Route path="/results/:testId/:score" element={<ProtectedRoute><TestResult /></ProtectedRoute>} />
          <Route path="/agent" element={<ProtectedRoute role={UserRole.AGENT}><AgentDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<div className="pt-32 text-center">Admin Module Coming Soon</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <FloatingQuickAccess />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
