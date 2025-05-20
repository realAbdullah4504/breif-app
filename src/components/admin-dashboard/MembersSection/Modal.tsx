import React, { useState } from 'react'
import { UserAvatar } from '../../UI/UserAvatar'
import Badge from '../../UI/Badge'
import { CheckCircle, Clock, Download } from 'lucide-react'
import TextArea from '../../UI/TextArea'
import Button from '../../UI/Button'
import { useReviewBriefs } from '../../../hooks/useAdminBriefs'
import { WorkspaceSettings } from '../../../types/settingTypes'
import { BriefWithUser } from '../../../types/briefTypes'
import Modal from '../../UI/Modal'

type ModalProps = {
    settings: WorkspaceSettings;
    isDarkMode: boolean;
    selectedBrief: BriefWithUser;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const MemberModal = ({ isDarkMode, settings, selectedBrief, isModalOpen, setIsModalOpen }: ModalProps) => {
    const { reviewBrief } = useReviewBriefs();
    const [adminNotes, setAdminNotes] = useState("");
    const handleMarkAsReviewed = (briefId: string, userId: string) => {
        reviewBrief({
            briefId,
            userId,
            adminNotes,
        });
        setIsModalOpen(false);
        setAdminNotes("");
        // In a real app, this would update the database
    };
    const handleDownloadBrief = () => {
        // In a real app, this would generate and download a PDF
        alert("PDF download functionality would be implemented here");
    };
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Brief Details"
            size="lg"
        >
            {selectedBrief && (
                <div
                    className={`space-y-4 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <UserAvatar
                                src={selectedBrief.users?.avatar_url}
                                name={selectedBrief.users?.name || "User"}
                                size="h-10 w-10 mr-3"
                            />
                            <div>
                                <h3
                                    className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    {selectedBrief?.users?.name}
                                </h3>
                                <p
                                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    {selectedBrief?.submitted_at} • Submitted at 5:03 PM
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {selectedBrief?.reviewed_by ? (
                                <Badge variant="info" className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Reviewed
                                </Badge>
                            ) : (
                                <Badge variant="warning" className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending Review
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div
                        className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"
                            }`}
                    >
                        <div className="mb-4">
                            <h4
                                className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                    } mb-1`}
                            >
                                {settings?.questions.accomplishments}
                            </h4>
                            <p
                                className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                {selectedBrief.accomplishments}
                            </p>
                        </div>

                        <div className="mb-4">
                            <h4
                                className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                    } mb-1`}
                            >
                                {settings?.questions?.blockers}
                            </h4>
                            <p
                                className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                {selectedBrief.blockers || "None reported"}
                            </p>
                        </div>

                        <div>
                            <h4
                                className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                    } mb-1`}
                            >
                                {settings?.questions?.priorities}
                            </h4>
                            <p
                                className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                {selectedBrief?.priorities}
                            </p>
                        </div>

                        {settings?.questions?.question4 &&
                            selectedBrief?.question4_response && (
                                <div className="mt-4">
                                    <h4
                                        className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                            } mb-1`}
                                    >
                                        {settings?.questions?.question4}
                                    </h4>
                                    <p
                                        className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {selectedBrief.question4_response}
                                    </p>
                                </div>
                            )}

                        {settings?.questions?.question5 &&
                            selectedBrief?.question5_response && (
                                <div className="mt-4">
                                    <h4
                                        className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                            } mb-1`}
                                    >
                                        {settings?.questions?.question5}
                                    </h4>
                                    <p
                                        className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {selectedBrief?.question5_response}
                                    </p>
                                </div>
                            )}
                    </div>

                    <div>
                        <h4
                            className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                } mb-1`}
                        >
                            Admin Notes
                        </h4>
                        <TextArea
                            id="admin-notes"
                            placeholder="Add private notes about this brief..."
                            rows={3}
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className={
                                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                            }
                        />
                    </div>

                    <div className="pt-4 flex justify-between">
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={handleDownloadBrief}>
                                <Download className="h-4 w-4 mr-1" />
                                Download PDF
                            </Button>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Close
                            </Button>
                            {!selectedBrief?.reviewed_by && (
                                <Button
                                    onClick={() => {
                                        handleMarkAsReviewed(
                                            selectedBrief.id,
                                            selectedBrief.user_id
                                        );
                                        setIsModalOpen(false);
                                    }}
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Mark as Reviewed
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    )
}

export default MemberModal
