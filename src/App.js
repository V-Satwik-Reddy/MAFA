import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from "react";
import api from "./api/axios";
import { useAuth } from "./context/AuthContext";
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignUpPage';
import WelcomePage from './pages/WelcomePage';
import TransactionsPage from './pages/TransactionsPage';
import TradeExecutionPage from './pages/TradeExecutionPage';
import GraphsPage from './pages/GraphsPage';
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/home" replace />;
  return children;
}

function App() {
  const { setAccessToken, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const didRefresh = useRef(false);
  const basename = useMemo(() => {
    if (!process.env.PUBLIC_URL) return "/";

    try {
      const url = new URL(process.env.PUBLIC_URL);
      const pathname = url.pathname.replace(/\/$/, "");
      return pathname || "/";
    } catch {
      return process.env.PUBLIC_URL;
    }
  }, []);

  useEffect(() => {
    if (didRefresh.current) return;
    didRefresh.current = true;

    api.post("/auth/refresh")
      .then(res => {
        setAccessToken(res.data.accessToken);
        return api.get("/profile/me");
      })
      .then(res => {
        setUser(res.data.data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
  }, [setAccessToken, setUser, logout]);

  if (loading) return null; // or spinner

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        
        <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path="/trade" element={<ProtectedRoute><TradeExecutionPage /></ProtectedRoute>} />
        <Route path="/graphs" element={<ProtectedRoute><GraphsPage /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;