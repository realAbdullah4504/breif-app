import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Auth Pages
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmailTemplates from './pages/admin/EmailTemplates';
import TeamManagement from './pages/admin/TeamManagement';

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import BriefHistory from './pages/member/BriefHistory';

// Shared Pages
import Settings from './pages/settings/Settings';
import FAQ from './pages/FAQ';
import ErrorPage from './pages/ErrorPage';

// Protected Route Component
const ProtectedRoute: React.FC<{
  element: React.ReactElement;
  requiredRole?: 'admin' | 'member';
}> = ({ element, requiredRole }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to={
      currentUser?.role === 'admin' ? '/admin' : '/dashboard'
    } replace />;
  }

  return element;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} 
            />
            <Route 
              path="/email-templates" 
              element={<ProtectedRoute element={<EmailTemplates />} requiredRole="admin" />} 
            />
            <Route 
              path="/team" 
              element={<ProtectedRoute element={<TeamManagement />} requiredRole="admin" />} 
            />
            
            {/* Member Routes */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute element={<MemberDashboard />} requiredRole="member" />} 
            />
            <Route 
              path="/brief-history" 
              element={<ProtectedRoute element={<BriefHistory />} requiredRole="member" />} 
            />
            
            {/* Shared Routes */}
            <Route 
              path="/settings" 
              element={<ProtectedRoute element={<Settings />} />} 
            />
            <Route 
              path="/faq" 
              element={<ProtectedRoute element={<FAQ />} />} 
            />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;