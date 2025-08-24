import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/UI/Button';
import AuthLayout from '../../components/Layout/AuthLayout';
import { AuthService } from '../../services/auth';

const authService = new AuthService();

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authService.resetPassword(email);
      
      if (error) {
        throw error;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while sending the reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>. 
            Click the link in the email to reset your password.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
            >
              Try again
            </Button>
            <Link to="/login">
              <Button variant="ghost" fullWidth>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a reset link"
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

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Send reset link
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-500 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;