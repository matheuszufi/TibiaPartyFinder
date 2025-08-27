import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { auth } from './lib/firebase';
import { handleRedirectResult } from './lib/auth';
import { useRoomCleanup } from './hooks/useRoomCleanup';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
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

  // Componente para proteger rotas que precisam de email verificado
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    // Se o usuário fez login com Google, o email já é considerado verificado
    if (user.providerData[0]?.providerId === 'google.com' || user.emailVerified) {
      return <>{children}</>;
    }
    
    // Se o email não foi verificado, redirecionar para página de verificação
    return <Navigate to="/verify-email" />;
  };

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
      <ToastProvider>
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
              path="/verify-email" 
              element={user ? <EmailVerificationPage /> : <Navigate to="/login" />} 
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
              path="/my-rooms" 
              element={
                <ProtectedRoute>
                  <MyRoomsPage />
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
            <Route 
              path="/premium" 
              element={
                <ProtectedRoute>
                  <PremiumPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
