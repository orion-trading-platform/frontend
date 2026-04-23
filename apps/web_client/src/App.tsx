import React from 'react';
import Login from '@/features/auth/pages/Login';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import TermsOfService from '@/features/auth/pages/TermsOfService';
import PrivacyPolicy from '@/features/auth/pages/PrivacyPolicy';
import LandingDashboard from '@/features/auth/pages/LandingDashboard';
import { LandingOrdering } from '@/features/auth/pages/LandingOrdering';
import Dashboard from '@/features/dashboard/DashboardPage';
import { OrderingPage } from '@/features/ordering/OrderingPage';
import LedgerPage from "@/features/ledger/pages/ledgerPage";
import WalletPage from "@/features/wallet/pages/WalletPage";
import { AuthProvider, ProtectedRoute, useAuth } from '@/features/auth';
import { ThemeProvider } from '@/ThemeContext';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Slim pulsing bar shown while an in-flight token refresh is in progress.
const SessionRefreshBanner: React.FC = () => {
  const { isRefreshingSession } = useAuth();
  if (!isRefreshingSession) return null;
  return <div aria-hidden="true" className="fixed top-0 inset-x-0 z-50 h-1 bg-indigo-500 animate-pulse" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
      <AuthProvider>
        <SessionRefreshBanner />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingDashboard />} />
            <Route path="/tickerview" element={<LandingOrdering />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
            <Route path="/trade" element={
              <ProtectedRoute><OrderingPage /></ProtectedRoute>
              } />
            <Route path="/ledger" element={
              <ProtectedRoute><LedgerPage /></ProtectedRoute>
              } />
            <Route path="/wallet" element={
              <ProtectedRoute><WalletPage /></ProtectedRoute>
              } />
            <Route path="*" element={
              <Navigate to="/dashboard" replace />
              } />
          </Routes>
        </div>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
