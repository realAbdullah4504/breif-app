import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Card, {
  CardHeader,
  CardBody,
  CardFooter,
} from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import TextArea from "../../components/UI/TextArea";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../hooks/useSettings";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { generateTimeOptions } from "../../utils/timeUtils";
import { BriefQuestions, WorkspaceSettings } from "../../types/settingTypes";
import { useProfile } from "../../hooks/useProfile";

const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    password: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const { settings, isLoading, error, updateSettings, isUpdating } =
    useSettings();

  const {
    uploadAvatar,
    deleteAvatar,
    updateProfile,
    updatePassword,
    isUploading,
    isUpdatingUser,
    isUpdatingPassword,
  } = useProfile();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file)
      e.target.value = '';
    }
  };
  const handleUpdate=()=>{
    if (profileData.name !== currentUser?.name) {
      updateProfile({ name: profileData.name });
    }
    if (profileData.password) {
        updatePassword({
        password: profileData.password,
        confirmPassword: profileData.confirmPassword
      });
      // Clear password fields after update
      setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
    if(avatar)
    {
      uploadAvatar(avatar);
      setAvatar(undefined);
    }

  }
  const isAdmin = currentUser?.role === "admin";
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
      }
  );

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);
  // Update handlers to modify local state instead of calling updateSettings
  const handleQuestionChange = (field: keyof BriefQuestions, value: string) => {
    setFormData((prev) => {
      if (!prev?.questions) {
        return {
          ...prev,
          questions: {
            accomplishments: "",
            blockers: "",
            priorities: "",
            [field]: value,
          },
        };
      }

      return {
        ...prev,
        questions: {
          ...prev.questions,
          [field]: value,
        },
      };
    });
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

  const addQuestion = (questionNumber: number) => {
    const field = `question${questionNumber}` as keyof BriefQuestions;
    handleQuestionChange(field, `Question ${questionNumber}`);
  };

  const removeQuestion = (questionNumber: number) => {
    const field = `question${questionNumber}` as keyof BriefQuestions;

    setFormData((prev) => {
      if (!prev.questions) return prev;

      const updatedQuestions = { ...prev.questions };
      delete updatedQuestions[field];

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };


  // Update save handler to save all changes at once
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await updateSettings({
        ...settings,
        ...formData,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  if (isLoading) {
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
          Failed to load settings. Please try again.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account and workspace settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isAdmin && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Brief Questions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Customize the questions your team members will answer in their
                  daily briefs.
                </p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSave}>
                  <div className="space-y-4">
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

                    {formData?.questions?.question4 && (
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
                          className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                          onClick={() => removeQuestion(4)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    {formData?.questions?.question5 && (
                      <div className="relative">
                        <TextArea
                          id="question5"
                          label="Question 5 (Optional)"
                          value={formData.questions.question5}
                          onChange={(e) =>
                            handleQuestionChange("question5", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                          onClick={() => removeQuestion(5)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    {(!settings.questions.question4 ||
                      !settings.questions.question5) && (
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!settings.questions.question4) {
                              addQuestion(4);
                            } else if (!settings.questions.question5) {
                              addQuestion(5);
                            }
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                    )}

                    <div className="mt-4">
                      <label
                        htmlFor="deadline"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Submission Deadline
                      </label>
                      <select
                        id="deadline"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={settings.submission_deadline}
                        onChange={(e) => handleDeadlineChange(e.target.value)}
                      >
                        {timeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          checked={settings.email_reminders}
                          onChange={(e) =>
                            handleEmailRemindersChange(e.target.checked)
                          }
                        />
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          Send automatic reminders
                        </span>
                      </label>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                        Automatically send reminders to team members who haven't
                        submitted their brief by the deadline.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button type="submit" isLoading={isUpdating}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Account Settings
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 relative group">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={currentUser?.avatar_url || "/default-avatar.png"}
                      alt={currentUser?.name || "Avatar"}
                    />
                    {currentUser?.avatar_url && (
                      <button
                        onClick={deleteAvatar}
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-6 w-6 text-white" />
                      </button>
                    )}
                  </div>
                  <div className="ml-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={currentUser?.avatar_url ? true : false}
                    >
                      Change avatar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input
                      id="name"
                      label="Full name"
                      defaultValue={currentUser?.name || ""}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      id="email"
                      label="Email address"
                      type="email"
                      disabled
                      defaultValue={currentUser?.email || ""}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      id="password"
                      label="New password"
                      type="password"
                      placeholder="••••••••"
                      onChange={(e) => setProfileData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      id="confirm-password"
                      label="Confirm password"
                      type="password"
                      placeholder="••••••••"
                      onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-end">
                <Button onClick={handleUpdate} isLoading={isUploading || isUpdating || isUpdatingPassword}>Update Account</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div>
          {isAdmin && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Workspace Settings
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="workspace-name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Workspace Name
                    </label>
                    <Input
                      id="workspace-name"
                      placeholder="My Team Workspace"
                      defaultValue="My Team Workspace"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timezone
                    </label>
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue="America/New_York"
                    >
                      <option value="America/New_York">
                        Eastern Time (ET)
                      </option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">
                        Pacific Time (PT)
                      </option>
                    </select>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="outline" size="sm" fullWidth>
                  Update Workspace
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Notification Preferences
              </h2>
            </CardHeader>
            <CardBody>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    Email notifications
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                  Receive email notifications for reminders and updates.
                </p>
              </div>
            </CardBody>
            <CardFooter>
              <Button variant="outline" size="sm" fullWidth>
                Update Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
