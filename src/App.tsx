import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { auth } from './lib/firebase';
import { handleRedirectResult } from './lib/auth';
import { useRoomCleanup } from './hooks/useRoomCleanup';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyRoomsPage from './pages/MyRoomsPage';
import { ProfilePage } from './pages/ProfilePage';
import PremiumPage from './pages/PremiumPage';

function App() {
  const [user, loading] = useAuthState(auth);
  
  // Ativar limpeza automática de salas expiradas
  useRoomCleanup();

  // Lidar com resultado de redirecionamento do Google
  useEffect(() => {
    handleRedirectResult();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen tibia-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 tibia-spinner mx-auto mb-4"></div>
          <p className="tibia-text text-lg" style={{ color: 'var(--tibia-gold-light)' }}>
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen tibia-bg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <DashboardPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-rooms" 
            element={user ? <MyRoomsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/premium" 
            element={user ? <PremiumPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
