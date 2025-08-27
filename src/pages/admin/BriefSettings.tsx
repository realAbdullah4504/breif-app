import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Card, {
  CardHeader,
  CardBody,
  CardFooter,
} from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import TextArea from "../../components/UI/TextArea";
import WeekdaySelector from "../../components/UI/WeekdaySelector";
import { useSettings } from "../../hooks/useSettings";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { generateTimeOptions } from "../../utils/timeUtils";
import { BriefQuestions, WorkspaceSettings } from "../../types/settingTypes";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../hooks/useWorkspaces";
// Common timezones for selection
const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time (MST)" },
  { value: "America/Anchorage", label: "Alaska Time (AKST)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "UTC", label: "UTC" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
];

const BriefSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const { workspaces, isLoading: workspacesLoading, error: workspacesError } = useWorkspaces(currentUser?.id?.trim() || "");
  const workspaceId = workspaces?.[0]?.id || "";
  const { settings, isLoading, error, updateSettings, isUpdating } =
    useSettings(workspaceId || "");
  const timeOptions = generateTimeOptions();

  const [formData, setFormData] = useState<Partial<WorkspaceSettings>>(
    () =>
      settings || {
        questions: {
          accomplishments: "",
          blockers: "",
          priorities: "",
          question4: "",
          question5: "",
        },
        submission_deadline: "17:00:00",
        email_reminders: true,
        name: "My Team Workspace",
        send_on_weekdays: [1, 2, 3, 4, 5],
      }
  );

  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      // Set timezone from settings or default to Eastern Time
      setSelectedTimezone(settings.timezone || "America/New_York");
    }
  }, [settings]);

  const handleQuestionChange = (field: keyof BriefQuestions, value: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: {
        ...prev?.questions,
        [field]: value,
      },
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFormData((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handleDeadlineChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      submission_deadline: value,
    }));
  };

  const handleEmailRemindersChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      email_reminders: checked,
    }));
  };

  const handleWeekdaysChange = (days: number[]) => {
    setFormData((prev) => ({
      ...prev,
      send_on_weekdays: days,
    }));
  };

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
    setFormData((prev) => ({
      ...prev,
      timezone: timezone,
    }));
  };

  const addQuestion = (questionNumber: number) => {
    const field = `question${questionNumber}` as keyof BriefQuestions;
    handleQuestionChange(field, `Question ${questionNumber}`);
  };

  const removeQuestion = (questionNumber: number) => {
    const field = `question${questionNumber}` as keyof BriefQuestions;
    handleQuestionChange(field, "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(formData);
    if (!hasChanges) return;

    try {
      await updateSettings({
        ...settings,
        ...formData,
        timezone: selectedTimezone,
      });
      toast.success("Brief settings saved successfully");
    } catch (error) {
      toast.error("Failed to save brief settings");
    }
  };

  if (isLoading || workspacesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !settings) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500">
          Failed to load brief settings. Please try again.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Brief Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your workspace brief questions and submission settings.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Workspace Configuration
              </h2>
              <Button onClick={handleSave} isLoading={isUpdating}>
                Save Changes
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-8">
              {/* Workspace Name */}
              <div>
                <Input
                  id="workspace-name"
                  label="Workspace Name"
                  placeholder="My Team Workspace"
                  value={formData?.name}
                  onChange={handleNameChange}
                />
              </div>

              {/* Brief Questions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Brief Questions
                </h3>
                <div className="space-y-6">
                  <TextArea
                    id="accomplishments"
                    label="Question 1 (Accomplishments)"
                    value={formData?.questions?.accomplishments}
                    onChange={(e) =>
                      handleQuestionChange("accomplishments", e.target.value)
                    }
                    required
                  />

                  <TextArea
                    id="blockers"
                    label="Question 2 (Blockers)"
                    value={formData?.questions?.blockers}
                    onChange={(e) =>
                      handleQuestionChange("blockers", e.target.value)
                    }
                    required
                  />

                  <TextArea
                    id="priorities"
                    label="Question 3 (Priorities)"
                    value={formData?.questions?.priorities}
                    onChange={(e) =>
                      handleQuestionChange("priorities", e.target.value)
                    }
                    required
                  />

                  {formData?.questions?.question4 !== undefined && (
                    <div className="relative">
                      <TextArea
                        id="question4"
                        label="Question 4 (Optional)"
                        value={formData?.questions?.question4}
                        onChange={(e) =>
                          handleQuestionChange("question4", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeQuestion(4)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  {formData?.questions?.question5 !== undefined && (
                    <div className="relative">
                      <TextArea
                        id="question5"
                        label="Question 5 (Optional)"
                        value={formData?.questions?.question5}
                        onChange={(e) =>
                          handleQuestionChange("question5", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeQuestion(5)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  {(formData?.questions?.question4 === undefined ||
                    formData?.questions?.question5 === undefined) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (formData?.questions?.question4 === undefined) {
                          addQuestion(4);
                        } else if (
                          formData?.questions?.question5 === undefined
                        ) {
                          addQuestion(5);
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  )}
                </div>
              </div>

              {/* Submission Settings */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Submission Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="deadline"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Submission Deadline
                    </label>
                    <select
                      id="deadline"
                      className="input"
                      value={formData?.submission_deadline}
                      onChange={(e) => handleDeadlineChange(e.target.value)}
                    >
                      {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      This deadline applies to all team members in the workspace
                      timezone
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="timezone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Workspace Timezone
                    </label>
                    <select
                      id="timezone"
                      className="input"
                      value={selectedTimezone}
                      onChange={(e) => handleTimezoneChange(e.target.value)}
                    >
                      {timezones.map((timezone) => (
                        <option key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      All times in the workspace will be displayed in this
                      timezone
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Email Reminders
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-gray-300 rounded transition-all duration-200"
                        checked={formData?.email_reminders}
                        onChange={(e) =>
                          handleEmailRemindersChange(e.target.checked)
                        }
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        Send automatic reminders
                      </span>
                    </label>
                    <p className="mt-1 text-xs text-gray-500 ml-6">
                      Automatically remind team members who haven't submitted
                      their brief.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reminder Schedule */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Reminder Schedule
                </h3>
                <WeekdaySelector
                  selectedDays={formData?.send_on_weekdays || [1, 2, 3, 4, 5]}
                  onChange={handleWeekdaysChange}
                  disabled={!formData?.email_reminders}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BriefSettings;
