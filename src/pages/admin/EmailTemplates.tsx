import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Card, {
  CardHeader,
  CardBody,
  CardFooter,
} from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import TextArea from "../../components/UI/TextArea";
import Modal from "../../components/UI/Modal";
import { useSettings } from "../../hooks/useSettings";
import { useEmail } from "../../hooks/useEmail";
import toast from "react-hot-toast";
import { format, parse } from "date-fns";

const EmailTemplates: React.FC = () => {
  const { settings, updateSettings, isUpdating } = useSettings();
  const { sendEmail, isLoading: isSendingEmail } = useEmail();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [emailReminders, setEmailReminders] = useState(true);
  const [submissionTime, setSubmissionTime] = useState("17:00");

  // Initialize form with settings data
  useEffect(() => {
    if (settings?.reminder_template) {
      setSubject(settings.reminder_template.subject);
      setBody(settings.reminder_template.body);
      setEmailReminders(settings.email_reminders);
      setSubmissionTime(settings.submission_deadline);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings(
      {
        ...settings,
        reminder_template: {
          subject,
          body,
        },
        email_reminders: emailReminders,
        submission_deadline: submissionTime,
      },
      {
        onSuccess: () => {
          toast.success("Settings saved successfully!");
        },
        onError: (error) => {
          toast.error("Failed to save settings");
          console.error("Error saving settings:", error);
        },
      }
    );
  };

  const sendTestEmail = () => {
    if (!testEmail) return;

    sendEmail(
      {
        to: testEmail,
        subject,
        html: body.replace("{{name}}", "Test User"),
      },
      {
        onSuccess: () => {
          toast.success("Test email sent successfully!");
          setTestEmail("");
        },
        onError: (error) => {
          console.error("Error sending test email:", error);
          toast.error("Failed to send test email");
        },
      }
    );
  };

  // Generate time options for the dropdown
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      options.push(`${i.toString().padStart(2, "0")}:00`);
      options.push(`${i.toString().padStart(2, "0")}:30`);
    }
    return options;
  };

  const hourOptions = generateTimeOptions();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize the email templates sent to your team members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Reminder Email Template
              </h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSave}>
                <div className="space-y-4">
                  <Input
                    id="subject"
                    label="Email Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />

                  <TextArea
                    id="body"
                    label="Email Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={10}
                    required
                  />

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Available Variables
                    </h3>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>
                        <code>{"{{name}}"}</code> - Team member's name
                      </li>
                      <li>
                        <code>{"{{deadline}}"}</code> - Submission deadline
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Send Test Email
                    </h3>
                    <div className="flex space-x-2">
                      <Input
                        id="test-email"
                        placeholder="Enter test email address"
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={sendTestEmail}
                        isLoading={isSendingEmail}
                        disabled={!testEmail}
                      >
                        Send Test
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    Preview Email
                  </Button>
                  <Button type="submit" isLoading={isUpdating}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Email Settings
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={emailReminders}
                      onChange={(e) => setEmailReminders(e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-900">
                    Send automatic reminders
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 ml-6">
                    Automatically send reminders to team members who haven't
                    submitted their brief.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">
                  Email Schedule
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="reminder-time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Send reminders at
                    </label>
                    <select
                      id="reminder-time"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue="4:00 PM"
                    >
                      {hourOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div>
                    <label
                      htmlFor="digest-time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Send daily digest at
                    </label>
                    <select
                      id="digest-time"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue="6:00 PM"
                    >
                      {hourOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="outline" size="sm" fullWidth>
                  Update Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Email Preview"
      >
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-md p-4">
            <div className="mb-2">
              <span className="text-xs text-gray-500">Subject:</span>
              <span className="text-sm ml-1 font-medium">{subject}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm whitespace-pre-wrap">
                {body.replace("{{name}}", "Test User")}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EmailTemplates;
