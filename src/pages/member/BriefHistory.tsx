import React from 'react';
import { format } from 'date-fns';
import { Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { mockUserBriefs } from '../../data/mockData';

const BriefHistory: React.FC = () => {
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
            {mockUserBriefs.map((brief) => (
              <div key={brief.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {format(new Date(brief.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Submitted at 5:03 PM
                    </p>
                  </div>
                  <Badge variant="success">Submitted</Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Accomplishments</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{brief.accomplishments}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Blockers</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{brief.blockers}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Priorities</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{brief.priorities}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
};

export default BriefHistory;