import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import TextArea from '../../components/UI/TextArea';
import Modal from '../../components/UI/Modal';
import { supabase } from '../../lib/supabase';

const EmailTemplates: React.FC = () => {
  const [subject, setSubject] = useState('Reminder: Submit your daily brief');
  const [body, setBody] = useState(
    'Hi {{name}},\n\nThis is a friendly reminder to submit your daily brief for today. It only takes a minute!\n\nBest regards,\nThe Briefly Team'
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Save template to database
      const { error } = await supabase
        .from('workspace_settings')
        .update({
          reminder_template: {
            subject,
            body
          }
        })
        .eq('id', 1); // Assuming we have a single workspace settings record

      if (error) throw error;
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) return;
    
    setIsSending(true);
    try {
      await sendEmail({
        to: testEmail,
        subject,
        html: body.replace('{{name}}', 'Test User')
      });

      alert('Test email sent successfully!');
      setTestEmail(''); // Clear the test email input after successful send
    } catch (error) {
      console.error('Error sending test email:', error);
      alert(error instanceof Error ? error.message : 'Failed to send test email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const previewEmail = () => {
    setIsPreviewOpen(true);
  };

  // Generate all hours in 12-hour format (AM/PM)
  const generateHourOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const hour12 = i % 12 || 12;
      const amPm = i < 12 ? 'AM' : 'PM';
      
      options.push(`${hour12}:00 ${amPm}`);
      options.push(`${hour12}:30 ${amPm}`);
    }
    return options;
  };

  const hourOptions = generateHourOptions();

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
              <h2 className="text-lg font-medium text-gray-900">Reminder Email Template</h2>
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
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Available Variables</h3>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li><code>{'{{name}}'}</code> - Team member's name</li>
                      <li><code>{'{{date}}'}</code> - Current date</li>
                      <li><code>{'{{deadline}}'}</code> - Submission deadline</li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Send Test Email</h3>
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
                        isLoading={isSending}
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
                    onClick={previewEmail}
                  >
                    Preview Email
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSaving}
                  >
                    {isSaved ? 'Saved!' : 'Save Template'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Email Settings</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-900">Send automatic reminders</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 ml-6">
                    Automatically send reminders to team members who haven't submitted their brief by the deadline.
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-900">Send daily digest</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 ml-6">
                    Send a daily digest of all submitted briefs to admins.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Email Schedule</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700">
                      Send reminders at
                    </label>
                    <select
                      id="reminder-time"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue="4:00 PM"
                    >
                      {hourOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="digest-time" className="block text-sm font-medium text-gray-700">
                      Send daily digest at
                    </label>
                    <select
                      id="digest-time"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue="6:00 PM"
                    >
                      {hourOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
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
        size="md"
      >
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-md p-4">
            <div className="mb-2">
              <span className="text-xs text-gray-500">From:</span>
              <span className="text-sm ml-1">Briefly Team &lt;notifications@briefly.com&gt;</span>
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500">To:</span>
              <span className="text-sm ml-1">Jamie Smith &lt;jamie@briefly.com&gt;</span>
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500">Subject:</span>
              <span className="text-sm ml-1 font-medium">{subject}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm whitespace-pre-wrap">
                {body.replace('{{name}}', 'Jamie')}
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