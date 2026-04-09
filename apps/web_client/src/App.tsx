import React from 'react';
import Login from '@/features/auth/Login';
import ResetPassword from '@/features/auth/ResetPassword';
import TermsOfService from '@/features/auth/TermsOfService';
import PrivacyPolicy from '@/features/auth/PrivacyPolicy';
import LandingDashboard from '@/features/auth/LandingDashboard';
import { LandingOrdering } from '@/features/auth/LandingOrdering';
import Dashboard from '@/features/dashboard/DashboardPage';
import { OrderingPage } from '@/features/ordering/OrderingPage';
import LedgerPage from "@/features/ledger/pages/ledgerPage";
import { AuthProvider, ProtectedRoute } from '@/features/auth';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  // Wrap protected routes with ProtectedRoute component to require authentication
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingDashboard />} />
            <Route path="/tradeview" element={<LandingOrdering />} />
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
            <Route path="*" element={
              <Navigate to="/dashboard" replace />
              } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
