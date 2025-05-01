import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, UserCog, User, AlertTriangle } from 'lucide-react';
import Button from '../../components/UI/Button';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string) => {
    setIsLoading(email);
    setError(null);
    
    try {
      const user = await login(email, 'password123');
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Choose a role to login</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select a role to test the application
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Button
              fullWidth
              onClick={() => handleLogin('admin@briefly.dev')}
              isLoading={isLoading === 'admin@briefly.dev'}
              icon={<UserCog className="h-5 w-5" />}
            >
              Login as Admin
            </Button>

            <Button
              fullWidth
              onClick={() => handleLogin('member@briefly.dev')}
              isLoading={isLoading === 'member@briefly.dev'}
              icon={<User className="h-5 w-5" />}
            >
              Login as Team Member
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login