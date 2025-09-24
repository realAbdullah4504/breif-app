import React from "react";
import { useTeamInvitations } from "../../hooks/useTeamInvitations";
import { Trash2 } from "lucide-react";

const DeleteMember = ({
  invitationId,
  isInviting,
}: {
  invitationId: string;
  isInviting: boolean;
}) => {
  const { deleteInvite, isDeleting } = useTeamInvitations();
  const handleDeleteInvitation = (id: string) => {
    if (isInviting) return;
    deleteInvite(id);
  };
  return (
    <div className="flex">
      <button
        type="button"
        className="text-gray-400 hover:text-red-500"
        onClick={() => handleDeleteInvitation(invitationId)}
        disabled={isDeleting || isInviting}
      >
        {isDeleting ? (
          <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default DeleteMember;
