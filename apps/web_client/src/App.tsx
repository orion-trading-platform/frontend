import React from 'react';
import Login from '@/features/auth/Login';
import ResetPassword from '@/features/auth/ResetPassword';
import TermsOfService from '@/features/auth/TermsOfService';
import PrivacyPolicy from '@/features/auth/PrivacyPolicy';
import { AuthProvider } from '@/features/auth';
import Dashboard from '@/features/dashboard/DashboardPage';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
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
            {/* <Route path="*" element={<Dashboard />} /> */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
