import { CheckCircle, Clock, Eye, Search, UserPlus, XCircle, XCircleIcon } from "lucide-react";
import EmptyState from "../../EmptyState";
import Card, { CardBody } from "../../UI/Card";
import { UserAvatar } from "../../UI/UserAvatar";
import Badge from "../../UI/Badge";
import ReminderButton from "./ReminderButton";
import Button from "../../UI/Button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { BriefWithUser, TeamMember } from "../../../types/briefTypes";
import { useState } from "react";
import { WorkspaceSettings } from "../../../types/settingTypes";
import MemberModal from "./Modal";


type MemberSectionProps = {
    isDarkMode: boolean;
    viewMode: string;
    teamMembers: TeamMember[];
    filteredTeamMembers: TeamMember[];
    settings: WorkspaceSettings;
    briefs: BriefWithUser[];
}

const MemberSection = ({ isDarkMode, viewMode, settings, briefs, teamMembers, filteredTeamMembers }: MemberSectionProps) => {

    const [selectedBrief, setSelectedBrief] = useState<BriefWithUser | null>(
        null
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewBrief = (brief: BriefWithUser) => {
        setSelectedBrief(brief);
        // setAdminNotes("");
        setIsModalOpen(true);
    };

    return (
        <div className="mb-6" >
            {!teamMembers?.length ? (
                <Card>
                    <CardBody>
                        <EmptyState
                            title="No Team Members"
                            message="You haven't added any team members yet. Start by inviting team members to join."
                            icon={<UserPlus className="h-6 w-6" />}
                            isDarkMode={isDarkMode}
                        />
                    </CardBody>
                </Card >
            ) : !filteredTeamMembers?.length ? (
                <Card>
                    <CardBody>
                        <EmptyState
                            title="No Results Found"
                            message="No team members match your current filters. Try adjusting your search or filter criteria."
                            icon={<Search className="h-6 w-6" />}
                            isDarkMode={isDarkMode}
                        />
                    </CardBody>
                </Card>
            ) : viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTeamMembers?.map((member) => {
                        const memberBrief = briefs.find(
                            (brief) => brief?.user_id === member?.id
                        );
                        const submittedAt = memberBrief?.submitted_at
                            ? format(new Date(memberBrief.submitted_at), "h:mm a")
                            : "";
                        return (
                            <motion.div
                                key={member?.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ y: -5 }}
                                className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                                    } rounded-lg shadow-md overflow-hidden`}
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <UserAvatar
                                                src={member?.avatar_url}
                                                name={member?.name || "User"}
                                                size="h-10 w-10 mr-3"
                                            />
                                            <div>
                                                <h3
                                                    className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"
                                                        }`}
                                                >
                                                    {member?.name}
                                                </h3>
                                                {memberBrief && (
                                                    <p
                                                        className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                            }`}
                                                    >
                                                        Submitted at {submittedAt}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {memberBrief ? (
                                                <Badge
                                                    variant="success"
                                                    className="flex items-center"
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Submitted
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="danger"
                                                    className="flex items-center"
                                                >
                                                    <XCircleIcon className="h-3 w-3 mr-1" />
                                                    Pending
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {memberBrief && (
                                        <div className="mb-4">
                                            <p
                                                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                                    } line-clamp-2`}
                                            >
                                                {memberBrief?.accomplishments}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
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
                                                    Pending Review
                                                </Badge>
                                            ) : null}
                                        </div>
                                        <div className="flex space-x-2">
                                            {memberBrief ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewBrief(memberBrief)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                            ) : (
                                                <ReminderButton member={member} teamMembers={teamMembers} settings={settings!} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div
                    className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                        } rounded-lg shadow-md overflow-hidden`}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                                <tr>
                                    <th
                                        scope="col"
                                        className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                            } uppercase tracking-wider`}
                                    >
                                        Team Member
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                            } uppercase tracking-wider`}
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                            } uppercase tracking-wider`}
                                    >
                                        Review Status
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                            } uppercase tracking-wider`}
                                    >
                                        Submitted At
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                            } uppercase tracking-wider`}
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`${isDarkMode
                                    ? "bg-gray-800 divide-gray-700"
                                    : "bg-white divide-gray-200"
                                    }`}
                            >
                                {filteredTeamMembers?.map((member) => {
                                    const memberBrief = briefs.find(
                                        (brief) => brief?.user_id === member?.id
                                    );
                                    const submittedAt = memberBrief?.submitted_at
                                        ? format(new Date(memberBrief.submitted_at), "h:mm a")
                                        : "";
                                    return (
                                        <tr
                                            key={member.id}
                                            className={
                                                isDarkMode
                                                    ? "hover:bg-gray-700"
                                                    : "hover:bg-gray-50"
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={member.avatar_url}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div
                                                            className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"
                                                                }`}
                                                        >
                                                            {member.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {memberBrief ? (
                                                    <Badge
                                                        variant="success"
                                                        className="flex items-center"
                                                    >
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Submitted
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="danger"
                                                        className="flex items-center"
                                                    >
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Pending
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {memberBrief && memberBrief?.reviewed_by ? (
                                                    <Badge
                                                        variant="info"
                                                        className="flex items-center"
                                                    >
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Reviewed
                                                    </Badge>
                                                ) : memberBrief ? (
                                                    <Badge
                                                        variant="warning"
                                                        className="flex items-center"
                                                    >
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Pending Review
                                                    </Badge>
                                                ) : (
                                                    <span
                                                        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                            }`}
                                                    >
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td
                                                className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                                    }`}
                                            >
                                                {memberBrief ? submittedAt : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {memberBrief ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewBrief(memberBrief)}
                                                        className="mr-2"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                ) : (
                                                    <ReminderButton member={member} teamMembers={teamMembers} settings={settings!} />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <MemberModal isDarkMode={isDarkMode} settings={settings} selectedBrief={selectedBrief!} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div >
    );
};

export default MemberSection;