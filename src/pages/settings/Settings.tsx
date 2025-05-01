import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import TextArea from '../../components/UI/TextArea';
import { mockSettings } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
  const [settings, setSettings] = useState(mockSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      
      // Reset saved state after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 1000);
  };

  const handleQuestionChange = (field: keyof typeof settings.questions, value: string) => {
    setSettings({
      ...settings,
      questions: {
        ...settings.questions,
        [field]: value
      }
    });
  };

  const handleDeadlineChange = (value: string) => {
    setSettings({
      ...settings,
      submissionDeadline: value
    });
  };

  const handleEmailRemindersChange = (checked: boolean) => {
    setSettings({
      ...settings,
      emailReminders: checked
    });
  };

  const addQuestion = (questionNumber: number) => {
    const field = `question${questionNumber}` as keyof typeof settings.questions;
    handleQuestionChange(field, `Question ${questionNumber}`);
  };

  const removeQuestion = (questionNumber: number) => {
    const field = `question${questionNumber}` as keyof typeof settings.questions;
    handleQuestionChange(field, '');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account and workspace settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isAdmin && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Brief Questions</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Customize the questions your team members will answer in their daily briefs.
                </p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    <TextArea
                      id="accomplishments"
                      label="Question 1 (Accomplishments)"
                      value={settings.questions.accomplishments}
                      onChange={(e) => handleQuestionChange('accomplishments', e.target.value)}
                      required
                    />
                    
                    <TextArea
                      id="blockers"
                      label="Question 2 (Blockers)"
                      value={settings.questions.blockers}
                      onChange={(e) => handleQuestionChange('blockers', e.target.value)}
                      required
                    />
                    
                    <TextArea
                      id="priorities"
                      label="Question 3 (Priorities)"
                      value={settings.questions.priorities}
                      onChange={(e) => handleQuestionChange('priorities', e.target.value)}
                      required
                    />
                    
                    {settings.questions.question4 && (
                      <div className="relative">
                        <TextArea
                          id="question4"
                          label="Question 4 (Optional)"
                          value={settings.questions.question4}
                          onChange={(e) => handleQuestionChange('question4', e.target.value)}
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
                    
                    {settings.questions.question5 && (
                      <div className="relative">
                        <TextArea
                          id="question5"
                          label="Question 5 (Optional)"
                          value={settings.questions.question5}
                          onChange={(e) => handleQuestionChange('question5', e.target.value)}
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
                    
                    {(!settings.questions.question4 || !settings.questions.question5) && (
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
                      <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Submission Deadline
                      </label>
                      <select
                        id="deadline"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={settings.submissionDeadline}
                        onChange={(e) => handleDeadlineChange(e.target.value)}
                      >
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="21:00">9:00 PM</option>
                        <option value="22:00">10:00 PM</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          checked={settings.emailReminders}
                          onChange={(e) => handleEmailRemindersChange(e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">Send automatic reminders</span>
                      </label>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                        Automatically send reminders to team members who haven't submitted their brief by the deadline.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isSaving}
                    >
                      {isSaved ? 'Saved!' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <Button variant="outline" size="sm">
                      Change avatar
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input
                      id="name"
                      label="Full name"
                      defaultValue={currentUser?.name || ''}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Input
                      id="email"
                      label="Email address"
                      type="email"
                      defaultValue={currentUser?.email || ''}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Input
                      id="password"
                      label="New password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Input
                      id="confirm-password"
                      label="Confirm password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-end">
                <Button>
                  Update Account
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          {isAdmin && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Workspace Settings</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
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
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h2>
            </CardHeader>
            <CardBody>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">Email notifications</span>
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