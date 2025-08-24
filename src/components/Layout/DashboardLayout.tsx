import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
  BarChart3,
  Sparkles,
  FileText,
  Sliders,
  ChevronDown,
  ChevronUp,
  Bell,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { UserAvatar } from "../UI/UserAvatar";
import Notifications from "../Notifications";
import { useNotifications } from "../../hooks/useNotifications";
import ErrorBoundary from "../ErrorBoundary";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = currentUser?.role === "admin";

  const navigation = [
    {
      name: "Dashboard",
      href: isAdmin ? "/admin" : "/dashboard",
      icon: BarChart3,
      current: location.pathname === (isAdmin ? "/admin" : "/dashboard"),
      show: true,
      description: "Overview & analytics"
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
      current: location.pathname === "/team",
      show: isAdmin,
      description: "Manage team members"
    },
    {
      name: "Brief Settings",
      href: "/brief-settings",
      icon: Sliders,
      current: location.pathname === "/brief-settings",
      show: isAdmin,
      description: "Configure questions"
    },
    {
      name: "History",
      href: "/brief-history",
      icon: FileText,
      current: location.pathname === "/brief-history",
      show: !isAdmin,
      description: "View past submissions"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location.pathname === "/settings",
      show: true,
      description: "Account preferences"
    },
    {
      name: "Help",
      href: "/faq",
      icon: HelpCircle,
      current: location.pathname === "/faq",
      show: true,
      description: "Support & FAQ"
    },
  ].filter((item) => item.show);

  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Dashboard Error</h1>
          <p className="text-gray-600 mb-4">Something went wrong loading the dashboard</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-50 flex"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-75"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-6 mb-8">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Briefly
                    </span>
                  </div>
                </div>
                <nav className="px-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        item.current
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          item.current
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <UserAvatar
                    src={currentUser?.avatar_url}
                    name={currentUser?.name || "User"}
                    size="h-10 w-10"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {currentUser?.name}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <LogOut className="mr-1 h-3 w-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ease-in-out z-20`}>
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-100 shadow-sm">
          
          {/* Logo section */}
          <div className={`border-t border-gray-100 ${sidebarCollapsed ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} relative`}>
            {sidebarCollapsed ? (
              <div className="flex justify-center">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Briefly
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 px-2 sm:px-3 py-4 sm:py-6 overflow-y-auto">
            <nav className="space-y-2">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    data-tour={item.name === 'Team' ? 'team-nav' : item.name === 'Brief Settings' ? 'settings-nav' : undefined}
                    className={`group flex items-center px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 relative ${
                      item.current 
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    {/* Active indicator */}
                    {item.current && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
                    )}
                    
                    <item.icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        item.current ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      } ${sidebarCollapsed ? '' : 'mr-3 sm:mr-4'} transition-colors duration-200`}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate font-medium text-xs sm:text-sm">{item.name}</span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className={`${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'} flex flex-col flex-1 transition-all duration-300 ease-in-out`}>
        {/* Top navigation bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex-shrink-0 h-12 sm:h-14 flex items-center justify-between px-3 sm:px-4">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile logo */}
            <div className="flex items-center lg:hidden">
              <div className="h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="ml-2 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Briefly
              </span>
            </div>

            {/* Spacer for layout */}
            <div className="flex-1"></div>

            {/* Profile and notifications */}
            <div className="flex items-center space-x-2 sm:space-x-3 relative">
              {/* Notifications */}
              <button
                data-tour="notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <Bell className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  </div>
                )}
              </button>
              
              {/* Profile */}
              <button
                data-tour="profile"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div className="relative">
                  <UserAvatar
                    src={currentUser?.avatar_url}
                    name={currentUser?.name || "User"}
                    size="h-7 w-7 sm:h-8 sm:w-8"
                    className="ring-2 ring-gray-100"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs sm:text-xs text-gray-500 capitalize">
                    {currentUser?.role}
                  </p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''} hidden lg:block`} />
              </button>
              
              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <Link
                        to="/settings"
                        className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-400" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        <span className="hidden sm:inline">Sign Out</span>
                        <span className="sm:hidden">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 max-h-80"
                  >
                    <div className="p-3">
                      <Notifications />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <main className="flex-1 bg-gray-25">
          <div className="py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default DashboardLayout;