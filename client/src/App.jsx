import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import PlayPage from './pages/PlayPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import RegisterPage from './pages/Register.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
           <Route path='/' element={<LandingPage />} />
           <Route path='/register' element={<RegisterPage />} />
           <Route path='/welcome' element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
           <Route path='/my-list' element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
           <Route path='/play' element={<ProtectedRoute><PlayPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
