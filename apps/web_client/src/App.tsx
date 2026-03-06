import React from 'react';
import Login from './features/auth/Login';
import ResetPassword from './features/auth/ResetPassword';
// import Dashboard from './features/dashboard/DashboardPage';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<DashboardPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
