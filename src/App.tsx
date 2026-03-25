import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/useAuth.ts';
import { PublicRoute } from './components/PublicRoute.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { WelcomePage } from './pages/WelcomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignupPage } from './pages/SignupPage.tsx';
import { HomePage } from './pages/HomePage.tsx';

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return <Navigate to={isAuthenticated ? '/home' : '/welcome'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<PublicRoute><WelcomePage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
