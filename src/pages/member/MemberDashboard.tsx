import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle, Clock, FileText,Calendar, AlertCircle, Sparkles, Target, ArrowRight, Zap, History, Award, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Card, {
  CardHeader,
  CardBody,
  CardFooter,
} from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import TextArea from "../../components/UI/TextArea";
import Badge from "../../components/UI/Badge";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../hooks/useSettings";
import { useBrief } from "../../hooks/useBrief";
import toast from "react-hot-toast";
import { checkBriefSubmissionEligibility } from "../../utils/checkBriefSubmissionEligibility";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../../hooks/useWorkspaces";

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {workspaces, isLoading: isLoadingWorkspaces}=useWorkspaces(currentUser?.id?.trim() || "")
  const workspaceId=workspaces?.[0]?.id || ""
  const { settings, isLoading: isLoadingSettings } = useSettings(workspaceId);
  const { submitBrief, briefs, isSubmitting: isSubmittingBrief } = useBrief(workspaceId);
  const [submissionStatus, setSubmissionStatus] = useState<{
    canSubmit: boolean;
    message: string;
  }>({ canSubmit: true, message: "" });

  const [formData, setFormData] = useState({
    accomplishments: "",
    blockers: "",
    priorities: "",
    question4: "",
    question5: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (settings?.submission_deadline && briefs) {
      const status = checkBriefSubmissionEligibility(
        briefs,
        settings.submission_deadline,
        settings.timezone,
      );
      setSubmissionStatus(status);

      // If user already submitted, show success state
      if (!status.canSubmit && status.message.includes("already submitted")) {
        setIsSubmitted(true);
      }
    }
  }, [briefs, settings?.submission_deadline, settings?.timezone]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionStatus.canSubmit) {
      toast.error(submissionStatus.message);
      return;
    }

    submitBrief({
      accomplishments: formData.accomplishments,
      blockers: formData.blockers,
      priorities: formData.priorities,
      question4_response: formData.question4 || undefined,
      question5_response: formData.question5 || undefined,
    });

    setIsSubmitted(true);
    setShowConfetti(true);
    
    // Stop confetti after 4 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    setFormData({
      accomplishments: "",
      blockers: "",
      priorities: "",
      question4: "",
      question5: "",
    });
  };

  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  // Get deadline in user's timezone
  const getDeadlineDisplay = () => {
    if (!settings?.submission_deadline || !settings?.timezone) {
      return "5:00 PM";
    }
    
    // Simply format the admin's deadline time without timezone conversion
    const [hours, minutes] = settings.submission_deadline.split(':').map(Number);
    const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const recentBriefs = briefs.slice(0, 3);

  if (isLoadingSettings || isLoadingWorkspaces) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left ml-4 sm:ml-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-monday rounded-3xl flex items-center justify-center shadow-monday mb-4 sm:mb-0 sm:mr-6">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Welcome back, {currentUser?.name?.split(' ')[0] || "there"}! 👋
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mt-2">
                Ready to share your daily progress?
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start space-y-2 sm:space-y-0 sm:space-x-8 text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">{today}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Deadline: {getDeadlineDisplay()}</span>
            </div>
          </div>
        </motion.div>

        {/* Status Alert */}
        {submissionStatus?.canSubmit && submissionStatus?.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto p-3 sm:p-4 bg-warning-50 border border-warning-200 rounded-2xl"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-warning-600 mr-3" />
              <p className="text-warning-800 font-medium text-sm sm:text-base">{submissionStatus.message}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Brief Form */}
          <div className="lg:col-span-2">
            <Card variant="monday" className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 sm:p-6 lg:p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-6">
                      <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Today's Brief</h2>
                      <p className="text-white/90 text-sm sm:text-base lg:text-lg">Share your progress and priorities</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 sm:py-16 lg:py-20"
                  >
                    <div className="mx-auto flex items-center justify-center h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-success-100 mb-6 sm:mb-8 shadow-lg">
                      <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-success-600" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                      Brief Submitted Successfully! 🎉
                    </h3>
                    <p className="text-gray-600 mb-6 sm:mb-10 text-base sm:text-lg lg:text-xl max-w-md mx-auto leading-relaxed px-4">
                      Thank you for sharing your progress. Your brief has been submitted and will be reviewed by your manager.
                    </p>
                    <div className="bg-success-50 rounded-3xl p-4 sm:p-6 lg:p-8 max-w-lg mx-auto border border-success-200">
                      <p className="text-success-800 font-semibold text-base sm:text-lg">
                        You can submit your next brief tomorrow. Keep up the great work! 🚀
                      </p>
                    </div>
                  </motion.div>
                ) : !submissionStatus.canSubmit ? (
                  <div className="text-center py-12 sm:py-16 lg:py-20">
                    <div className="mx-auto flex items-center justify-center h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-warning-100 mb-6 sm:mb-8 shadow-lg">
                      <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-warning-600" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
                      Submission Not Available
                    </h3>
                    <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-md mx-auto px-4">
                      {submissionStatus.message}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div className="space-y-6 sm:space-y-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <TextArea
                          id="accomplishments"
                          label={settings?.questions.accomplishments || "What did you accomplish today?"}
                          rows={5}
                          required
                          variant="monday"
                          className="text-sm sm:text-base"
                          onChange={(e) =>
                            handleInputChange("accomplishments", e.target.value)
                          }
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <TextArea
                          id="blockers"
                          label={settings?.questions.blockers || "Any blockers or challenges?"}
                          rows={4}
                          variant="monday"
                          value={formData.blockers}
                          className="text-sm sm:text-base"
                          onChange={(e) =>
                            handleInputChange("blockers", e.target.value)
                          }
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <TextArea
                          id="priorities"
                          label={settings?.questions.priorities || "What are your priorities for tomorrow?"}
                          rows={4}
                          required
                          variant="monday"
                          value={formData.priorities}
                          className="text-sm sm:text-base"
                          onChange={(e) =>
                            handleInputChange("priorities", e.target.value)
                          }
                        />
                      </motion.div>

                      {settings?.questions.question4 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <TextArea
                            id="question4"
                            label={settings.questions.question4}
                            rows={4}
                            variant="monday"
                            value={formData.question4}
                            onChange={(e) =>
                              handleInputChange("question4", e.target.value)
                            }
                            className="text-sm sm:text-base"
                          />
                        </motion.div>
                      )}

                      {settings?.questions.question5 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <TextArea
                            id="question5"
                            label={settings.questions.question5}
                            rows={4}
                            variant="monday"
                            value={formData.question5}
                            onChange={(e) =>
                              handleInputChange("question5", e.target.value)
                            }
                            className="text-sm sm:text-base"
                          />
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="pt-6"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                        <Button
                          type="submit"
                          variant="monday"
                          size="lg"
                          fullWidth
                          disabled={isSubmittingBrief || !submissionStatus.canSubmit}
                          className="relative text-base sm:text-lg font-bold py-4 sm:py-5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 hover:from-primary-600 hover:via-secondary-600 hover:to-primary-700 border-0 shadow-monday hover:shadow-monday-hover transform hover:scale-[1.02] transition-all duration-300 group"
                        >
                          {isSubmittingBrief ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                              <span className="font-semibold">Submitting your brief...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <div className="flex items-center bg-white/20 rounded-xl px-3 py-1 mr-3 group-hover:bg-white/30 transition-all duration-200">
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                              <span className="font-bold text-white">
                                <span className="hidden sm:inline">Submit Today's Brief</span>
                                <span className="sm:hidden">Submit Brief</span>
                              </span>
                              <div className="flex items-center bg-white/20 rounded-xl px-3 py-1 ml-3 group-hover:bg-white/30 group-hover:translate-x-1 transition-all duration-200">
                                <ArrowRight className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  </form>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Briefs Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card variant="monday">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-lg">
                      <History className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        Recent Briefs
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Your latest submissions
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {recentBriefs.length > 0 ? (
                    <div className="space-y-3">
                      {recentBriefs.map((brief, index) => (
                        <motion.div
                          key={brief.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {format(new Date(brief.submitted_at), 'MMM d, yyyy')}
                            </span>
                            <Badge variant={brief.reviewed_at ? "success" : "monday-blue"} className="text-xs">
                              {brief.reviewed_at ? "Reviewed" : "Under Review"}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {brief.accomplishments}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base">No briefs submitted yet</p>
                    </div>
                  )}
                </CardBody>
                <CardFooter>
                  <Link to="/brief-history" className="w-full">
                    <Button variant="outline" fullWidth className="flex items-center justify-center">
                      <History className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">View All History</span>
                      <span className="sm:hidden">History</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card variant="monday">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-lg">
                      <Zap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        Pro Tips
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Make your briefs shine
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        <strong>Be specific:</strong> Include concrete achievements
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        <strong>Highlight blockers:</strong> Mention challenges early
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-success-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        <strong>Plan ahead:</strong> Clear priorities help alignment
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;