import React from 'react';
import Login from './features/auth/Login';
import ResetPassword from './features/auth/ResetPassword';
import { AuthProvider } from './features/auth';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrderingPage } from './features/ordering/OrderingPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<OrderingPage />} />
            <Route path="/trade" element={<OrderingPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
