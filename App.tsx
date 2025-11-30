import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DiscoveryPage from './pages/DiscoveryPage';
import MatchesPage from './pages/MatchesPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { User } from './types';
import { db } from './services/mockDb';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session simulation
    // For this demo, we usually start logged out unless specifically saved
    const savedId = localStorage.getItem('lh_current_user_id');
    if (savedId) {
       const user = db.getUser(savedId);
       if (user) setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('lh_current_user_id', user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lh_current_user_id');
  };

  if (loading) return null;

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/" 
          element={!currentUser ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/discovery" />} 
        />
        
        <Route
          path="/discovery"
          element={
            currentUser ? (
              <Layout>
                <DiscoveryPage currentUser={currentUser} />
              </Layout>
            ) : <Navigate to="/" />
          }
        />

        <Route
          path="/matches"
          element={
            currentUser ? (
              <Layout>
                <MatchesPage currentUser={currentUser} />
              </Layout>
            ) : <Navigate to="/" />
          }
        />

        <Route
          path="/profile"
          element={
            currentUser ? (
              <Layout>
                <ProfilePage currentUser={currentUser} onLogout={handleLogout} />
              </Layout>
            ) : <Navigate to="/" />
          }
        />

        <Route
            path="/admin"
            element={
                currentUser && currentUser.isAdmin ? (
                    <Layout hideNav>
                        <AdminPage />
                    </Layout>
                ) : <Navigate to="/" />
            }
        />
        
      </Routes>
    </HashRouter>
  );
};

export default App;