import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Button from "../../components/UI/Button";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaceInvitation } from "../../hooks/useWorkspaces";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { acceptMemberWorkspaceInvitation,isAccepting } = useWorkspaceInvitation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const user = await login(formData.email, formData.password);
      // Invitation acceptance logic
      const inviteToken = location.state?.inviteToken;
      const invitedEmail = location.state?.email;
      if (inviteToken && invitedEmail) {
        if (user?.email?.toLowerCase() === invitedEmail.toLowerCase()) {
          acceptMemberWorkspaceInvitation(
            {
              token: inviteToken,
              email: invitedEmail,
            },
            {
              onSuccess: () => {
                navigate("/dashboard");
                setIsLoading(false);
              },
              onError: () => {
                setError("Failed to accept invitation");
              },
            }
          );
          return;
        } else {
          setError(
            `This invitation is for ${invitedEmail}, but you are signed in as ${user.email}. Please use the correct account.`
          );
          setIsLoading(false);
          return;
        }
      }
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "member") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-monday"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>

        <div className="relative z-10 flex flex-col justify-center px-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">Briefly</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Transform your team's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                daily communication
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Streamline daily check-ins, track progress, and keep your team
              aligned with beautiful, intuitive brief management.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-4"></div>
                <span className="text-white/90">
                  Real-time team collaboration
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-4"></div>
                <span className="text-white/90">
                  Automated progress tracking
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-4"></div>
                <span className="text-white/90">
                  Beautiful insights & analytics
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-monday rounded-xl flex items-center justify-center mr-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-monday">
                Briefly
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue
              </p>
            </div>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-2xl bg-success-50 p-4 border border-success-200"
              >
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-success-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-success-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-2xl bg-danger-50 p-4 border border-danger-200"
              >
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-danger-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-danger-800">
                      {error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-monday pl-12 pr-4 py-4 text-base"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-monday pl-12 pr-12 py-4 text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading || isAccepting}
                className="py-4 text-base font-semibold"
                icon={<ArrowRight className="h-5 w-5" />}
              >
                Sign in
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
