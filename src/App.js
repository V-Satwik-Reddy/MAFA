import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignUpPage';
import WelcomePage from './pages/WelcomePage';
import verify from './api/verify';

function App() {
  // Protected / public route wrappers that use your verify() API
  function ProtectedRoute({ children }) {
    const [auth, setAuth] = React.useState(null); // null = checking, false = not authed, true = authed

    React.useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const ok = await verify(); // should resolve truthy when token is valid
          if (mounted) setAuth(Boolean(ok));
        } catch (e) {
          if (mounted) setAuth(false);
        }
      })();
      return () => { mounted = false; };
    }, []);

    if (auth === null) return null; // or a spinner/loading indicator
    return auth ? children : <Navigate to="/login" replace />;
  }

  // Optional: redirect logged-in users away from login/signup/welcome
  function PublicRoute({ children }) {
    const [auth, setAuth] = React.useState(null);

    React.useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const ok = await verify();
          if (mounted) setAuth(Boolean(ok));
        } catch (e) {
          if (mounted) setAuth(false);
        }
      })();
      return () => { mounted = false; };
    }, []);

    if (auth === null) return null;
    return auth ? <Navigate to="/home" replace /> : children;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <WelcomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected routes - only accessible when verify() returns truthy */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
