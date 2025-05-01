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

const MemberDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [accomplishments, setAccomplishments] = useState('');
  const [blockers, setBlockers] = useState('');
  const [priorities, setPriorities] = useState('');
  const [question4, setQuestion4] = useState('');
  const [question5, setQuestion5] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setAccomplishments('');
        setBlockers('');
        setPriorities('');
        setQuestion4('');
        setQuestion5('');
      }, 500);
    }, 1000);
  };

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  
  // Format the deadline time for display
  const formatDeadlineTime = () => {
    const deadlineHour = parseInt(mockSettings.submissionDeadline.split(':')[0]);
    const amPm = deadlineHour >= 12 ? 'PM' : 'AM';
    const hour12 = deadlineHour > 12 ? deadlineHour - 12 : deadlineHour === 0 ? 12 : deadlineHour;
    return `${hour12}:00 ${amPm}`;
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {currentUser?.name || 'Team Member'}</h1>
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
                  <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Brief submitted successfully!</h3>
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
                      label={mockSettings.questions.accomplishments}
                      rows={3}
                      required
                      value={accomplishments}
                      onChange={(e) => setAccomplishments(e.target.value)}
                    />
                    
                    <TextArea
                      id="blockers"
                      label={mockSettings.questions.blockers}
                      rows={3}
                      value={blockers}
                      onChange={(e) => setBlockers(e.target.value)}
                    />
                    
                    <TextArea
                      id="priorities"
                      label={mockSettings.questions.priorities}
                      rows={3}
                      required
                      value={priorities}
                      onChange={(e) => setPriorities(e.target.value)}
                    />
                    
                    {mockSettings.questions.question4 && (
                      <TextArea
                        id="question4"
                        label={mockSettings.questions.question4}
                        rows={3}
                        value={question4}
                        onChange={(e) => setQuestion4(e.target.value)}
                      />
                    )}
                    
                    {mockSettings.questions.question5 && (
                      <TextArea
                        id="question5"
                        label={mockSettings.questions.question5}
                        rows={3}
                        value={question5}
                        onChange={(e) => setQuestion5(e.target.value)}
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Today at {formatDeadlineTime()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Don't forget to submit your brief before the deadline</p>
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