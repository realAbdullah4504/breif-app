import {
  CheckCircle,
  Clock,
  Eye,
  Search,
  UserPlus,
  XCircle,
  XCircleIcon,
  MessageSquare,
  Calendar,
} from "lucide-react";
import EmptyState from "../../EmptyState";
import Card, { CardBody } from "../../UI/Card";
import { UserAvatar } from "../../UI/UserAvatar";
import Badge from "../../UI/Badge";
import ReminderButton from "./ReminderButton";
import Button from "../../UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatWorkspaceTime,
  DEFAULT_WORKSPACE_TIMEZONE,
} from "../../../utils/workspaceTimeUtils";
import { BriefWithUser } from "../../../types/briefTypes";
import { useState } from "react";
import MemberModal from "./Modal";
import { useDashboardContext } from "../../../context/DashboardContext";
import { useAllUserStreaks } from "../../../hooks/useRecognition";
import { Flame } from "lucide-react";
import { useWorkspaceContext } from "../../../context/WorkspaceContext";
import { useSettings } from "../../../hooks/useSettings";
import { useAdminBriefs } from "../../../hooks/useAdminBriefs";
import { useAuth } from "../../../context/AuthContext";

type MemberSectionProps = {
  viewMode: string;
};

const MemberSection = ({ viewMode }: MemberSectionProps) => {
  const { filters } = useDashboardContext();
  const { selectedWorkspaceId } = useWorkspaceContext();
  const workspaceId = selectedWorkspaceId || "";
  const { settings } = useSettings(workspaceId);
  const { briefs, teamMembers, filteredTeamMembers } = useAdminBriefs(filters);

  const { currentUser } = useAuth();
  const { data: userStreaks } = useAllUserStreaks();
  const [selectedBrief, setSelectedBrief] = useState<BriefWithUser | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewBrief = (brief: BriefWithUser) => {
    setSelectedBrief(brief);
    setIsModalOpen(true);
  };

  // Check if sample data has been deleted for this admin
  const sampleDataKey = `sample_data_deleted_${currentUser?.id}`;
  const sampleDataDeleted = localStorage.getItem(sampleDataKey) === 'true';
  const shouldShowSampleData = !sampleDataDeleted && (!teamMembers?.length || teamMembers?.every(m => m.user_id?.startsWith('demo-')));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -2,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-600 mt-1">
            {filteredTeamMembers?.length || 0} of {teamMembers?.length || 0}{" "}
            members shown
          </p>
        </div>
      </div>

      {!teamMembers?.length && !shouldShowSampleData ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12">
          <EmptyState
            title="No Team Members"
            message="You haven't added any team members yet. Start by inviting team members to join your workspace."
            icon={<UserPlus className="h-8 w-8" />}
          />
        </div>
      ) : !filteredTeamMembers?.length ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12">
          <EmptyState
            title="No Results Found"
            message="No team members match your current filters. Try adjusting your search or filter criteria."
            icon={<Search className="h-8 w-8" />}
          />
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredTeamMembers?.map((member, index) => {
              const memberBrief = briefs.find(
                (brief) => brief?.user_id === member?.user_id
              );
              const workspaceTimezone =
                settings?.timezone || DEFAULT_WORKSPACE_TIMEZONE;
              const submittedAt = memberBrief?.submitted_at
                ? formatWorkspaceTime(
                    memberBrief.submitted_at,
                    workspaceTimezone
                  )
                : "";
              const memberStreak = userStreaks?.find(
                (streak) => streak.user_id === member?.user_id
              );
              return (
                <motion.div
                  key={member?.user_id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    {/* Member Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <UserAvatar
                          src={member?.users?.avatar_url}
                          name={member?.users?.name || "User"}
                          size="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4"
                        />
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {member?.users?.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {member?.users?.email}
                          </p>
                          {memberStreak && memberStreak.current_streak > 0 && (
                            <div className="flex items-center mt-1">
                              <Flame className="h-3 w-3 text-orange-500 mr-1" />
                              <span className="text-xs text-orange-600 font-medium">
                                {memberStreak.current_streak} day streak
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        {memberBrief ? (
                          <Badge
                            variant="success"
                            className="flex items-center px-3 py-1"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Submitted
                          </Badge>
                        ) : (
                          <Badge
                            variant="danger"
                            className="flex items-center px-3 py-1"
                          >
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Brief Preview */}
                    {memberBrief ? (
                      <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            Submitted at {submittedAt}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                          {memberBrief?.accomplishments}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center">
                          <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-xs sm:text-sm text-red-700 font-medium">
                            Brief not submitted yet
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Review Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {memberBrief && memberBrief?.reviewed_by ? (
                          <Badge variant="info" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : memberBrief ? (
                          <Badge
                            variant="warning"
                            className="flex items-center"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Needs Review
                          </Badge>
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-500">
                            No submission to review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-1 sm:space-x-2">
                      {memberBrief ? (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleViewBrief(memberBrief)}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm">View</span>
                        </Button>
                      ) : (
                        <div className="flex-1">
                          <ReminderButton
                            member={member}
                            teamMembers={teamMembers}
                            settings={settings!}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Team Member
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Submission Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Review Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Submitted At
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeamMembers?.map((member, index) => {
                  const memberBrief = briefs.find(
                    (brief) => brief?.user_id === member?.id
                  );
                  const workspaceTimezone =
                    settings?.timezone || DEFAULT_WORKSPACE_TIMEZONE;
                  const submittedAt = memberBrief?.submitted_at
                    ? formatWorkspaceTime(
                        memberBrief.submitted_at,
                        workspaceTimezone
                      )
                    : "";
                  const memberStreak = userStreaks?.find(
                    (streak) => streak.user_id === member?.id
                  );
                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            <UserAvatar
                              src={member.avatar_url}
                              name={member.name || "User"}
                              size="h-8 w-8 sm:h-10 sm:w-10"
                            />
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate max-w-32 sm:max-w-none">
                              {member.email}
                            </div>
                            {memberStreak &&
                              memberStreak.current_streak > 0 && (
                                <div className="flex items-center mt-1">
                                  <Flame className="h-3 w-3 text-orange-500 mr-1" />
                                  <span className="text-xs text-orange-600 font-medium">
                                    {memberStreak.current_streak} day streak
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                        {memberBrief ? (
                          <Badge
                            variant="success"
                            className="flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Submitted
                          </Badge>
                        ) : (
                          <Badge variant="danger" className="flex items-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                        {memberBrief && memberBrief?.reviewed_by ? (
                          <Badge variant="info" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : memberBrief ? (
                          <Badge
                            variant="warning"
                            className="flex items-center"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Needs Review
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {memberBrief ? (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {submittedAt}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex justify-end space-x-1 sm:space-x-2">
                          {memberBrief ? (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => handleViewBrief(memberBrief)}
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          ) : (
                            <ReminderButton
                              member={member}
                              teamMembers={teamMembers}
                              settings={settings!}
                            />
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <MemberModal
        isDarkMode={false}
        settings={settings}
        selectedBrief={selectedBrief!}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default MemberSection;
