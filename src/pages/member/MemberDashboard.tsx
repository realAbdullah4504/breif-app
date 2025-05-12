import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
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

const MemberDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { submitBrief, briefs, isSubmitting: isSubmittingBrief } = useBrief();
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
  useEffect(() => {
    if (settings?.submission_deadline && briefs) {
      const status = checkBriefSubmissionEligibility(
        briefs,
        settings.submission_deadline
      );
      setSubmissionStatus(status);

      // If user already submitted, show success state
      if (!status.canSubmit && status.message.includes("already submitted")) {
        setIsSubmitted(true);
      }
    }
  }, [briefs, settings?.submission_deadline]);
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
      setFormData({
        accomplishments: "",
        blockers: "",
        priorities: "",
        question4: "",
        question5: "",
      });

  };

  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  // Format the deadline time for display
  const formatDeadlineTime = () => {
    if (!settings?.submission_deadline) return "5:00 PM";
    const [hours] = settings.submission_deadline.split(":");
    const hour = parseInt(hours);
    const amPm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${hour12}:00 ${amPm}`;
  };

  if (isLoadingSettings) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {currentUser?.name || "Team Member"}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Submit your daily brief and keep your team updated.
        </p>
      </div>
      {submissionStatus?.canSubmit && submissionStatus?.message && (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
            {submissionStatus.message}
          </h3>
          {/* <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {submissionStatus.message}
        </p> */}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Today's Brief
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {today}
                </span>
              </div>
            </CardHeader>
            <CardBody>
              {isSubmitted ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
                    Brief submitted for today!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    You can submit your next brief tomorrow.
                  </p>
                </div>
              ) : !submissionStatus.canSubmit ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
                    Submission Not Available
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {submissionStatus.message}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <TextArea
                      id="accomplishments"
                      label={settings?.questions.accomplishments || ""}
                      rows={3}
                      required
                      value={formData.accomplishments}
                      onChange={(e) =>
                        handleInputChange("accomplishments", e.target.value)
                      }
                    />

                    <TextArea
                      id="blockers"
                      label={settings?.questions.blockers || ""}
                      rows={3}
                      required
                      value={formData.blockers}
                      onChange={(e) =>
                        handleInputChange("blockers", e.target.value)
                      }
                    />

                    <TextArea
                      id="priorities"
                      label={settings?.questions.priorities || ""}
                      rows={3}
                      required
                      value={formData.priorities}
                      onChange={(e) =>
                        handleInputChange("priorities", e.target.value)
                      }
                    />

                    {settings?.questions.question4 && (
                      <TextArea
                        id="question4"
                        label={settings.questions.question4}
                        rows={3}
                        value={formData.question4}
                        onChange={(e) =>
                          handleInputChange("question4", e.target.value)
                        }
                      />
                    )}

                    {settings?.questions.question5 && (
                      <TextArea
                        id="question5"
                        label={settings.questions.question5}
                        rows={3}
                        value={formData.question5}
                        onChange={(e) =>
                          handleInputChange("question5", e.target.value)
                        }
                      />
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button type="submit" isLoading={isSubmittingBrief}>
                      Submit Brief
                    </Button>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Submission History
              </h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {briefs.length > 0 ? (
                  briefs.slice(0, 3).map((brief) => (
                    <div key={brief.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {format(
                              new Date(brief.submitted_at),
                              "MMMM d, yyyy"
                            )}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Submitted at{" "}
                            {format(new Date(brief.submitted_at), "h:mm a")}
                          </p>
                        </div>
                        <Badge variant="success">Submitted</Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {brief.accomplishments}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No submissions yet
                  </div>
                )}
              </div>
            </CardBody>
            <CardFooter>
              <Link to="/brief-history">
                <Button variant="outline" size="sm" fullWidth>
                  View All History
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Submission Deadline
                </h2>
              </CardHeader>
              <CardBody>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock
                      className={`h-5 w-5 ${
                        !submissionStatus.canSubmit && !isSubmitted
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Today at {formatDeadlineTime()}
                    </p>
                    <p
                      className={`text-xs ${
                        !submissionStatus.canSubmit && !isSubmitted
                          ? "text-red-500 font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {submissionStatus.message ||
                        "Don't forget to submit your brief before the deadline"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;
