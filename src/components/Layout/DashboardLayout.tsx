import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  Settings, 
  Mail, 
  LogOut, 
  Menu, 
  X, 
  Home,
  HelpCircle,
  Bell,
  User,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = currentUser?.role === 'admin';

  const navigation = [
    { 
      name: 'Dashboard', 
      href: isAdmin ? '/admin' : '/dashboard', 
      icon: Home, 
      current: location.pathname === (isAdmin ? '/admin' : '/dashboard'),
      show: true
    },
    { 
      name: 'Team', 
      href: '/team', 
      icon: Users, 
      current: location.pathname === '/team',
      show: isAdmin
    },
    { 
      name: 'Email Templates', 
      href: '/email-templates', 
      icon: Mail, 
      current: location.pathname === '/email-templates',
      show: isAdmin
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings, 
      current: location.pathname === '/settings',
      show: true
    },
    { 
      name: 'FAQ', 
      href: '/faq', 
      icon: HelpCircle, 
      current: location.pathname === '/faq',
      show: true
    },
  ].filter(item => item.show);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown') && profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-dark-primary' : 'bg-gray-100'}`}>
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
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`relative flex-1 flex flex-col max-w-xs w-full ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'}`}
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
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className={`ml-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Briefly
                  </span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? isDarkMode 
                            ? 'bg-dark-hover text-white'
                            : 'bg-gray-100 text-gray-900'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-dark-hover hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={`${
                          item.current 
                            ? 'text-blue-600' 
                            : isDarkMode
                              ? 'text-gray-400 group-hover:text-gray-300'
                              : 'text-gray-400 group-hover:text-gray-500'
                        } mr-4 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className={`flex-shrink-0 flex border-t ${isDarkMode ? 'border-dark-border' : 'border-gray-200'} p-4`}>
                <div className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-10 w-10 rounded-full"
                        src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className={`text-base font-medium ${isDarkMode ? 'text-white group-hover:text-gray-300' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {currentUser?.name || 'User'}
                      </p>
                      <button
                        onClick={handleLogout}
                        className={`text-sm font-medium ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'} flex items-center`}
                      >
                        <LogOut className="mr-1 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className={`flex-1 flex flex-col min-h-0 border-r ${isDarkMode ? 'border-dark-border bg-dark-secondary' : 'border-gray-200 bg-white'}`}>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className={`ml-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Briefly
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? isDarkMode 
                        ? 'bg-dark-hover text-white'
                        : 'bg-gray-100 text-gray-900'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-dark-hover hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200`}
                >
                  <item.icon
                    className={`${
                      item.current 
                        ? 'text-blue-600' 
                        : isDarkMode
                          ? 'text-gray-400 group-hover:text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className={`flex-shrink-0 flex border-t ${isDarkMode ? 'border-dark-border' : 'border-gray-200'} p-4`}>
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white group-hover:text-gray-300' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {currentUser?.name || 'User'}
                  </p>
                  <button
                    onClick={handleLogout}
                    className={`text-xs font-medium ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'} flex items-center`}
                  >
                    <LogOut className="mr-1 h-3 w-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation bar */}
        <div className={`sticky top-0 z-10 ${
          scrolled 
            ? isDarkMode
              ? 'bg-dark-secondary/80 backdrop-blur-md border-b border-dark-border'
              : 'bg-white/80 backdrop-blur-md shadow-sm'
            : isDarkMode
              ? 'bg-dark-secondary'
              : 'bg-transparent'
        } transition-all duration-200`}>
          <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              type="button"
              className={`lg:hidden inline-flex items-center justify-center p-2 rounded-md ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-dark-hover'
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Mobile logo (center) */}
            <div className="lg:hidden flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className={`ml-2 text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Briefly
              </span>
            </div>
            
            {/* Right side navigation items */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  isDarkMode 
                    ? 'bg-dark-hover text-gray-300 hover:text-white'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                } transition-colors duration-200`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button className={`p-1 rounded-full ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-400 hover:text-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              
              {/* Profile dropdown */}
              <div className="relative profile-dropdown">
                <button
                  className={`flex items-center space-x-2 p-1 rounded-full ${
                    isDarkMode 
                      ? 'hover:bg-dark-hover'
                      : 'hover:bg-gray-100'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                    alt=""
                  />
                  <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
                
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                        isDarkMode 
                          ? 'bg-dark-secondary border border-dark-border'
                          : 'bg-white ring-1 ring-black ring-opacity-5'
                      } focus:outline-none`}
                    >
                      <div className="py-1">
                        <Link
                          to="/settings"
                          className={`flex items-center px-4 py-2 text-sm ${
                            isDarkMode 
                              ? 'text-gray-300 hover:bg-dark-hover'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className={`mr-3 h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                          Account Settings
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className={`flex w-full items-center px-4 py-2 text-sm ${
                            isDarkMode 
                              ? 'text-gray-300 hover:bg-dark-hover'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <LogOut className={`mr-3 h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-10">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;