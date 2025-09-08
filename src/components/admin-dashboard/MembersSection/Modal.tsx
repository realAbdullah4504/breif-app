import React, { useState } from "react";
import { UserAvatar } from "../../UI/UserAvatar";
import Badge from "../../UI/Badge";
import { CheckCircle, Clock, Download, Check } from "lucide-react";
import Button from "../../UI/Button";
import TextArea from "../../UI/TextArea";
import { useReviewBriefs } from "../../../hooks/useAdminBriefs";
import { WorkspaceSettings } from "../../../types/settingTypes";
import { BriefWithUser } from "../../../types/briefTypes";
import Modal from "../../UI/Modal";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import {
  formatWorkspaceDate,
  formatWorkspaceTime,
} from "../../../utils/workspaceTimeUtils";
import { useDashboardContext } from "../../../context/DashboardContext";

type ModalProps = {
  settings: WorkspaceSettings;
  isDarkMode: boolean;
  selectedBrief: BriefWithUser;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MemberModal = ({
  isDarkMode,
  settings,
  selectedBrief,
  isModalOpen,
  setIsModalOpen,
}: ModalProps) => {
  const { filters } = useDashboardContext();
  const { reviewBrief, isReviewing } = useReviewBriefs(filters);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsReviewed = (briefId: string, userId: string) => {
    // Don't allow reviewing demo briefs
    if (briefId.startsWith("demo-") || userId.startsWith("demo-")) {
      toast.error(
        "This is demo data. Invite real team members to review their briefs!"
      );
      return;
    }

    reviewBrief({
      briefId,
      userId,
      adminNotes: "",
    });
    setIsModalOpen(false);
  };

  const handleDownloadBrief = () => {
    setIsLoading(true);
    try {
      const doc = new jsPDF();
      const lineHeight = 10;
      let yPos = 20;

      // Add title
      doc.setFontSize(20);
      doc.text(`Brief Report - ${selectedBrief.users?.name}`, 20, yPos);
      yPos += lineHeight * 2;

      // Add submission info
      doc.setFontSize(12);
      doc.text(
        `Submitted on: ${format(
          new Date(selectedBrief.submitted_at),
          "MMMM d, yyyy h:mm a"
        )}`,
        20,
        yPos
      );
      yPos += lineHeight * 2;

      // Add questions and answers
      const addSection = (question: string, answer: string) => {
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(question, 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(12);
        doc.setFont(undefined, "normal");
        const lines = doc.splitTextToSize(answer || "No response", 170);
        doc.text(lines, 20, yPos);
        yPos += lines.length * lineHeight + lineHeight;
      };

      addSection(
        settings.questions.accomplishments,
        selectedBrief.accomplishments
      );
      addSection(
        settings.questions.blockers,
        selectedBrief.blockers || "None reported"
      );
      addSection(settings.questions.priorities, selectedBrief.priorities);

      if (settings.questions.question4 && selectedBrief.question4_response) {
        addSection(
          settings.questions.question4,
          selectedBrief.question4_response
        );
      }

      if (settings.questions.question5 && selectedBrief.question5_response) {
        addSection(
          settings.questions.question5,
          selectedBrief.question5_response
        );
      }

      // Save the PDF
      doc.save(
        `brief-${selectedBrief.users?.name}-${format(
          new Date(selectedBrief.submitted_at),
          "yyyy-MM-dd"
        )}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Brief Details"
      size="lg"
    >
      {selectedBrief && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserAvatar
                src={selectedBrief.users?.avatar_url}
                name={selectedBrief.users?.name || "User"}
                size="h-10 w-10 mr-3"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedBrief?.users?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatWorkspaceDate(
                    selectedBrief.submitted_at,
                    settings.timezone
                  )}{" "}
                  • Submitted at{" "}
                  {formatWorkspaceTime(
                    selectedBrief.submitted_at,
                    settings.timezone
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedBrief?.reviewed_by ? (
                <Badge variant="info\" className="flex items-center">
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

          <div className="p-4 rounded-lg bg-gray-50">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                {settings?.questions.accomplishments}
              </h4>
              <div className="text-sm text-gray-900 max-h-32 overflow-y-auto p-3 bg-white rounded border break-words whitespace-pre-wrap">
                {selectedBrief.accomplishments}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                {settings?.questions?.blockers}
              </h4>
              <div className="text-sm text-gray-900 max-h-32 overflow-y-auto p-3 bg-white rounded border break-words whitespace-pre-wrap">
                {selectedBrief.blockers || "None reported"}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                {settings?.questions?.priorities}
              </h4>
              <div className="text-sm text-gray-900 max-h-32 overflow-y-auto p-3 bg-white rounded border break-words whitespace-pre-wrap">
                {selectedBrief?.priorities}
              </div>
            </div>

            {settings?.questions?.question4 &&
              selectedBrief?.question4_response && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    {settings?.questions?.question4}
                  </h4>
                  <div className="text-sm text-gray-900 max-h-32 overflow-y-auto p-3 bg-white rounded border break-words whitespace-pre-wrap">
                    {selectedBrief.question4_response}
                  </div>
                </div>
              )}

            {settings?.questions?.question5 &&
              selectedBrief?.question5_response && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    {settings?.questions?.question5}
                  </h4>
                  <div className="text-sm text-gray-900 max-h-32 overflow-y-auto p-3 bg-white rounded border break-words whitespace-pre-wrap">
                    {selectedBrief?.question5_response}
                  </div>
                </div>
              )}
          </div>

          <div className="pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={handleDownloadBrief}
              isLoading={isLoading}
            >
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
            <div className="flex space-x-2">
              {!selectedBrief?.reviewed_by && (
                <Button
                  onClick={() =>
                    handleMarkAsReviewed(
                      selectedBrief.id,
                      selectedBrief.user_id
                    )
                  }
                  isLoading={isReviewing}
                  variant="primary"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Reviewed
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MemberModal;
