import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";

// Add error boundary for the entire app
import ErrorBoundary from "./components/ErrorBoundary";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Onboarding from "./pages/auth/Onboarding";

// Admin Pages
import EmailTemplates from "./pages/admin/EmailTemplates";
import TeamManagement from "./pages/admin/TeamManagement";
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import BriefSettings from "./pages/admin/BriefSettings";

// Member Pages
import MemberDashboard from "./pages/member/MemberDashboard";
import BriefHistory from "./pages/member/BriefHistory";

// Shared Pages
import Settings from "./pages/settings/Settings";
import FAQ from "./pages/FAQ";
import ErrorPage from "./pages/ErrorPage";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "react-hot-toast";
import AcceptInvitation from "./pages/auth/AcceptInvitation";
import { WorkspaceProvider } from "./context/WorkspaceContext";

// Protected Route Component
const ProtectedRoute: React.FC<{
  element: React.ReactElement;
  requiredRole?: "admin" | "member";
}> = ({ element, requiredRole }) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required but user doesn't have it, redirect to dashboard or show unauthorized
  if (requiredRole && currentUser?.role !== requiredRole) {
    // You might want to redirect to a "not authorized" page or back to dashboard
    return <Navigate to="/login" replace />;
  }

  return element;
};

const DashboardRedirect = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (currentUser.role === "member") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#374151",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              maxWidth: "400px",
              zIndex: 9999,
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
          containerStyle={{
            zIndex: 9999,
          }}
        />
        <ThemeProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={<ProtectedRoute element={<DashboardRedirect />} />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/register" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/auth/update-password"
                    element={<ResetPassword />}
                  />
                  <Route
                    path="/auth/accept-invite"
                    element={<AcceptInvitation />}
                  />
                  <Route path="/onboarding" element={<Onboarding />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ErrorBoundary
                        fallback={
                          <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                              <h1 className="text-xl font-bold text-gray-900 mb-2">
                                Dashboard Error
                              </h1>
                              <p className="text-gray-600">
                                Unable to load admin dashboard
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <ProtectedRoute
                          element={<AdminDashboardPage />}
                          requiredRole="admin"
                        />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/email-templates"
                    element={
                      <ProtectedRoute
                        element={<EmailTemplates />}
                        requiredRole="admin"
                      />
                    }
                  />
                  <Route
                    path="/team"
                    element={
                      <ProtectedRoute
                        element={<TeamManagement />}
                        requiredRole="admin"
                      />
                    }
                  />
                  <Route
                    path="/brief-settings"
                    element={
                      <ProtectedRoute
                        element={<BriefSettings />}
                        requiredRole="admin"
                      />
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ErrorBoundary
                        fallback={
                          <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                              <h1 className="text-xl font-bold text-gray-900 mb-2">
                                Dashboard Error
                              </h1>
                              <p className="text-gray-600">
                                Unable to load member dashboard
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <ProtectedRoute
                          element={<MemberDashboard />}
                          requiredRole="member"
                        />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/brief-history"
                    element={
                      <ProtectedRoute
                        element={<BriefHistory />}
                        requiredRole="member"
                      />
                    }
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

                  {/* 404 Route */}
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </Router>
            </WorkspaceProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
