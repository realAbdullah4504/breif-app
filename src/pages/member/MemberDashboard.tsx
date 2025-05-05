import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import TextArea from '../../components/UI/TextArea';
import Badge from '../../components/UI/Badge';
import { mockUserBriefs, mockSettings } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../hooks/useSettings';

const MemberDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  
  const [formData, setFormData] = useState({
    accomplishments: '',
    blockers: '',
    priorities: '',
    question4: '',
    question5: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call - Replace with real API call later
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          accomplishments: '',
          blockers: '',
          priorities: '',
          question4: '',
          question5: ''
        });
      }, 500);
    }, 1000);
  };

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  
  // Format the deadline time for display
  const formatDeadlineTime = () => {
    if (!settings?.submission_deadline) return '5:00 PM';
    const [hours] = settings.submission_deadline.split(':');
    const hour = parseInt(hours);
    const amPm = hour >= 12 ? 'PM' : 'AM';
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
          Welcome, {currentUser?.name || 'Team Member'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Submit your daily brief and keep your team updated.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Today's Brief</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{today}</span>
              </div>
            </CardHeader>
            <CardBody>
              {isSubmitted ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
                    Brief submitted successfully!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Thank you for submitting your daily brief. Your team will be notified.
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Submit another brief
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <TextArea
                      id="accomplishments"
                      label={settings?.questions.accomplishments || ''}
                      rows={3}
                      required
                      value={formData.accomplishments}
                      onChange={(e) => handleInputChange('accomplishments', e.target.value)}
                    />
                    
                    <TextArea
                      id="blockers"
                      label={settings?.questions.blockers || ''}
                      rows={3}
                      required
                      value={formData.blockers}
                      onChange={(e) => handleInputChange('blockers', e.target.value)}
                    />
                    
                    <TextArea
                      id="priorities"
                      label={settings?.questions.priorities || ''}
                      rows={3}
                      required
                      value={formData.priorities}
                      onChange={(e) => handleInputChange('priorities', e.target.value)}
                    />
                    
                    {settings?.questions.question4 && (
                      <TextArea
                        id="question4"
                        label={settings.questions.question4}
                        rows={3}
                        value={formData.question4}
                        onChange={(e) => handleInputChange('question4', e.target.value)}
                      />
                    )}
                    
                    {settings?.questions.question5 && (
                      <TextArea
                        id="question5"
                        label={settings.questions.question5}
                        rows={3}
                        value={formData.question5}
                        onChange={(e) => handleInputChange('question5', e.target.value)}
                      />
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                    >
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
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Submission History</h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* We'll add real brief history here later */}
                {mockUserBriefs.map((brief) => (
                  <div key={brief.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {format(new Date(brief.date), 'MMMM d, yyyy')}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Submitted at 5:03 PM
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
                ))}
                <div className="p-4 text-center text-sm text-gray-500">
                  No submissions yet
                </div>
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
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Submission Deadline</h2>
              </CardHeader>
              <CardBody>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Today at {formatDeadlineTime()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Don't forget to submit your brief before the deadline
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