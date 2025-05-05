import React from 'react';
import { format } from 'date-fns';
import { Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { useBrief } from '../../hooks/useBrief';

const BriefHistory: React.FC = () => {
  const { briefs, isLoading } = useBrief();

  if (isLoading) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brief History</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View all your previous brief submissions
            </p>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">All Submissions</h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {briefs.length > 0 ? (
              briefs.map((brief) => (
                <div key={brief.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {format(new Date(brief.submitted_at), 'MMMM d, yyyy')}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Submitted at {format(new Date(brief.submitted_at), 'h:mm a')}
                      </p>
                    </div>
                    <Badge variant="success">
                      {brief.reviewed_at ? 'Reviewed' : 'Submitted'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Accomplishments
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {brief.accomplishments}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Blockers
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {brief.blockers}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Priorities
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {brief.priorities}
                      </p>
                    </div>

                    {brief.question4_response && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Additional Question 4
                        </h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {brief.question4_response}
                        </p>
                      </div>
                    )}

                    {brief.question5_response && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Additional Question 5
                        </h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {brief.question5_response}
                        </p>
                      </div>
                    )}

                    {brief.admin_notes && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Admin Notes
                        </h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {brief.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No brief submissions found
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
};

export default BriefHistory;