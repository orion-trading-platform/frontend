import React from 'react';
import Login from './features/auth/Login';
// import Dashboard from './features/dashboard/Dashboard';
// import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
