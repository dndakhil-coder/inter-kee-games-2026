import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import PublicLeaderboard from './pages/PublicLeaderboard';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Leaderboard - No login required */}
        <Route path="/" element={<PublicLeaderboard apiUrl={API_URL} />} />
        <Route path="/leaderboard" element={<PublicLeaderboard apiUrl={API_URL} />} />

        {/* Admin Login */}
        <Route 
          path="/admin/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/admin/dashboard" /> : 
              <Login onLogin={handleAdminLogin} apiUrl={API_URL} />
          } 
        />

        {/* Admin Dashboard - Protected */}
        <Route 
          path="/admin/dashboard" 
          element={
            isAuthenticated ? 
              <AdminDashboard onLogout={handleAdminLogout} apiUrl={API_URL} /> : 
              <Navigate to="/admin/login" />
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
