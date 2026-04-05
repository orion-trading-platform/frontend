import React from 'react';
import Login from '@/features/auth/Login';
import ResetPassword from '@/features/auth/ResetPassword';
import TermsOfService from '@/features/auth/TermsOfService';
import PrivacyPolicy from '@/features/auth/PrivacyPolicy';
import { AuthProvider, ProtectedRoute } from '@/features/auth';
import Dashboard from '@/features/dashboard/DashboardPage';
import { OrderingPage } from './features/ordering/OrderingPage';
import LedgerPage from "./features/ledger/pages/ledgerPage";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  // wrap protected routes with ProtectedRoute component to require authentication
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trade" element={<OrderingPage />} />
            <Route path="/ledger" element={<LedgerPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
