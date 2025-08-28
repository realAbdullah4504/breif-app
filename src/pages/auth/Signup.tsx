import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  User,
  Building,
  AlertTriangle,
  Sparkles,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";
import zxcvbn from "zxcvbn";
import Button from "../../components/UI/Button";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";

const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");
  const inviteEmail = searchParams.get("email");
  const workspaceName = searchParams.get("workspace") || "Team Workspace";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(inviteEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Default to admin unless there's an invite token (then they're a member)
  const role: UserRole = inviteToken ? "member" : "admin";

  // Evaluate password strength when password changes
  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordScore(result.score);

      // Set feedback based on score
      if (result.score === 0) {
        setPasswordFeedback("Very weak");
      } else if (result.score === 1) {
        setPasswordFeedback("Weak");
      } else if (result.score === 2) {
        setPasswordFeedback("Fair");
      } else if (result.score === 3) {
        setPasswordFeedback("Good");
      } else {
        setPasswordFeedback("Strong");
      }
    } else {
      setPasswordScore(0);
      setPasswordFeedback("");
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!inviteToken && !companyName.trim()) {
      setError("Please enter your company name");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the Terms and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      const user = await signUp(name, email, password, role, companyName);
      console.log("user====================>", user);
      if (user.role === "admin") {
        navigate("/admin", {
          state: {
            message:
              "Account created successfully! You can now sign in with your credentials.",
            email: email,
          },
        });
      }
    } catch (err: any) {
      console.error("Signup error:", err);

      // Provide more specific error messages based on the error
      if (err?.message?.includes("Unable to connect")) {
        setError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else if (
        err?.message?.toLowerCase()?.includes("user already registered")
      ) {
        navigate("/login", {
          state: {
            message:
              "An account with this email already exists. Please sign in.",
            email: email,
          },
        });
        return;
      } else if (err?.message?.includes("Invalid email")) {
        setError("Please enter a valid email address.");
      } else if (err?.message?.includes("Password")) {
        setError(
          "Password does not meet requirements. Please try a stronger password."
        );
      } else if (err?.message?.includes("Failed to fetch")) {
        setError(
          "Unable to connect to the authentication service. The app is now running in demo mode."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = () => {
    if (passwordScore === 0) return "bg-red-500";
    if (passwordScore === 1) return "bg-orange-500";
    if (passwordScore === 2) return "bg-yellow-500";
    if (passwordScore === 3) return "bg-green-500";
    return "bg-green-600";
  };

  const features = [
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless daily check-ins for your entire team",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Beautiful insights and analytics dashboard",
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Smart reminders and notifications",
    },
  ];

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
              {inviteToken ? "Join your team" : "Start your journey"}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                {inviteToken
                  ? `with ${workspaceName}`
                  : "with better team communication"}
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {inviteToken
                ? "You've been invited to collaborate with your team using Briefly's powerful brief management platform."
                : "Join thousands of teams who trust Briefly to streamline their daily communication and boost productivity."}
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-center"
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Signup form */}
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
                {inviteToken ? "Join your team" : "Create your account"}
              </h2>
              <p className="text-gray-600">
                {inviteToken
                  ? `You've been invited to join ${workspaceName}`
                  : "Start managing your team's daily briefs today"}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-2xl bg-danger-50 p-4 border border-danger-200"
              >
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-danger-500" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-danger-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="input-monday pl-12 pr-4 py-4 text-base"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                    className="input-monday pl-12 pr-4 py-4 text-base"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!inviteEmail}
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
                    autoComplete="new-password"
                    required
                    className="input-monday pl-12 pr-12 py-4 text-base"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`${getScoreColor()} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${(passwordScore + 1) * 20}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                        {passwordFeedback}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use at least 8 characters with a mix of letters, numbers &
                      symbols
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="input-monday pl-12 pr-12 py-4 text-base"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p className="mt-2 text-xs text-red-600">
                      Passwords don't match
                    </p>
                  )}
              </div>

              {!inviteToken && (
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Organization Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      required
                      className="input-monday pl-12 pr-4 py-4 text-base"
                      placeholder="Your Organization Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {inviteToken && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization
                  </label>
                  <div className="flex items-center px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-base text-gray-700">
                      {workspaceName}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-3 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-500 font-semibold"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-500 font-semibold"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                className="py-4 text-base font-semibold"
                icon={<ArrowRight className="h-5 w-5" />}
              >
                {inviteToken ? "Join workspace" : "Create account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
