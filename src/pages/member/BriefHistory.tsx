import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { useBrief } from '../../hooks/useBrief';
import { useSettings } from '../../hooks/useSettings';
import { formatWorkspaceDate, formatWorkspaceTime, DEFAULT_WORKSPACE_TIMEZONE } from '../../utils/workspaceTimeUtils';
import { useAuth } from '../../context/AuthContext';
import { useWorkspaces } from '../../hooks/useWorkspaces';

const BriefHistory: React.FC = () => {
  const { briefs, isLoading } = useBrief();
  const {currentUser}=useAuth()
  const userId=currentUser?.id?.trim() || ""
  const {workspaces}=useWorkspaces(userId)
  const workspaceId=workspaces?.[0]?.id || ""
  const { settings } = useSettings(workspaceId);
  const workspaceTimezone = settings?.timezone || DEFAULT_WORKSPACE_TIMEZONE;

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Brief History</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-500">
              View all your previous brief submissions
            </p>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base sm:text-lg font-medium text-gray-900">All Submissions</h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-200">
            {briefs.length > 0 ? (
              briefs.map((brief) => (
                <div key={brief.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-900">
                        {formatWorkspaceDate(brief.submitted_at, workspaceTimezone)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Submitted at {formatWorkspaceTime(brief.submitted_at, workspaceTimezone)}
                      </p>
                    </div>
                    <Badge variant="success">
                      {brief.reviewed_at ? 'Reviewed' : 'Submitted'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Accomplishments
                      </h3>
                      <div className="mt-1 text-xs sm:text-sm text-gray-900 max-h-24 sm:max-h-32 overflow-y-auto p-2 sm:p-3 bg-gray-50 rounded border break-words whitespace-pre-wrap">
                        {brief.accomplishments}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Blockers
                      </h3>
                      <div className="mt-1 text-xs sm:text-sm text-gray-900 max-h-24 sm:max-h-32 overflow-y-auto p-2 sm:p-3 bg-gray-50 rounded border break-words whitespace-pre-wrap">
                        {brief.blockers}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Priorities
                      </h3>
                      <div className="mt-1 text-xs sm:text-sm text-gray-900 max-h-24 sm:max-h-32 overflow-y-auto p-2 sm:p-3 bg-gray-50 rounded border break-words whitespace-pre-wrap">
                        {brief.priorities}
                      </div>
                    </div>

                    {brief.question4_response && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Additional Question 4
                        </h3>
                        <div className="mt-1 text-xs sm:text-sm text-gray-900 max-h-24 sm:max-h-32 overflow-y-auto p-2 sm:p-3 bg-gray-50 rounded border break-words whitespace-pre-wrap">
                          {brief.question4_response}
                        </div>
                      </div>
                    )}

                    {brief.question5_response && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Additional Question 5
                        </h3>
                        <div className="mt-1 text-xs sm:text-sm text-gray-900 max-h-24 sm:max-h-32 overflow-y-auto p-2 sm:p-3 bg-gray-50 rounded border break-words whitespace-pre-wrap">
                          {brief.question5_response}
                        </div>
                      </div>
                    )}

                    {brief.admin_notes && (
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500">
                          Admin Notes
                        </h3>
                        <div className="mt-1 text-xs sm:text-sm text-gray-900 max-h-24 sm:max-h-32 overflow-y-auto p-2 sm:p-3 bg-white rounded border break-words whitespace-pre-wrap">
                          {brief.admin_notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 sm:p-6 text-center text-gray-500">
                <span className="text-sm sm:text-base">No brief submissions found</span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
};

export default BriefHistory;