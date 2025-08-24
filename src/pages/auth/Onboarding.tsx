import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Sparkles,
  Target,
  Clock,
  Bell,
  FileText
} from 'lucide-react';
import Button from '../../components/UI/Button';
import { useAuth } from '../../context/AuthContext';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features?: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Briefly! 🎉',
    subtitle: 'Your team communication just got better',
    description: 'Briefly helps teams stay aligned with structured daily check-ins. No more lengthy meetings - just quick, focused updates that keep everyone in the loop.',
    icon: <Sparkles className="w-12 h-12 text-white" />,
    gradient: 'from-primary-500 to-secondary-500',
    features: [
      'Replace daily standup meetings',
      'Keep everyone aligned and informed',
      'Track progress and blockers',
      'Build better team communication'
    ]
  },
  {
    id: 'daily-briefs',
    title: 'Daily Brief Submissions',
    subtitle: 'Share your progress in minutes',
    description: 'Each day, submit a quick brief covering what you accomplished, any blockers you faced, and your priorities for tomorrow. It\'s that simple!',
    icon: <FileText className="w-12 h-12 text-white" />,
    gradient: 'from-success-500 to-success-600',
    features: [
      'Quick 3-question format',
      'Submit before your team deadline',
      'Track your daily accomplishments',
      'Identify and communicate blockers'
    ]
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    subtitle: 'Stay connected with your team',
    description: 'Your manager can review your briefs, provide feedback, and track team progress. Everyone stays informed without the meeting overhead.',
    icon: <Users className="w-12 h-12 text-white" />,
    gradient: 'from-blue-500 to-indigo-600',
    features: [
      'Manager reviews and feedback',
      'Team progress visibility',
      'Async communication',
      'Historical brief tracking'
    ]
  },
  {
    id: 'notifications',
    title: 'Smart Reminders',
    subtitle: 'Never miss a submission',
    description: 'Get gentle reminders before your deadline. We\'ll help you build the habit of consistent communication without being pushy.',
    icon: <Bell className="w-12 h-12 text-white" />,
    gradient: 'from-warning-500 to-orange-500',
    features: [
      'Deadline reminders via email',
      'Customizable reminder timing',
      'Streak tracking for motivation',
      'Flexible submission windows'
    ]
  },
  {
    id: 'insights',
    title: 'Progress Insights',
    subtitle: 'Track your growth',
    description: 'View your brief history, track submission streaks, and see your progress over time. Celebrate your consistency and growth!',
    icon: <BarChart3 className="w-12 h-12 text-white" />,
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Brief history and archives',
      'Submission streak tracking',
      'Progress visualization',
      'Personal growth insights'
    ]
  }
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Mark onboarding as completed in localStorage
    localStorage.setItem('onboarding_completed', 'true');
    
    // Small delay for better UX
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/dashboard');
  };

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-monday rounded-xl flex items-center justify-center mr-3 shadow-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient-monday">Briefly</span>
        </div>
        
        <button
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          Skip tour
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <span className="text-sm text-gray-500">
              Welcome, {currentUser?.name?.split(' ')[0]}!
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-monday h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`w-24 h-24 bg-gradient-to-br ${currentStepData.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-monday`}
              >
                {currentStepData.icon}
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-12"
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                  {currentStepData.title}
                </h1>
                <h2 className="text-xl text-gray-600 mb-6 font-medium">
                  {currentStepData.subtitle}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
                  {currentStepData.description}
                </p>

                {/* Features */}
                {currentStepData.features && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
                  >
                    {currentStepData.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="flex items-center text-left bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                      >
                        <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-success-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-primary-500 scale-125'
                    : index < currentStep
                    ? 'bg-success-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            isLoading={isCompleting}
            size="lg"
            className="px-8"
            icon={isLastStep ? <CheckCircle className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;