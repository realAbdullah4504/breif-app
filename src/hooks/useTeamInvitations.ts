import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { InviteService } from "../services/inviteService";
import { queryClient } from "../lib/queryClient";
import { useNavigate } from "react-router-dom";

const inviteService = new InviteService();

export const useTeamInvitations = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const invitationsQuery = useQuery({
    queryKey: ["invitations"],
    queryFn: () =>
      currentUser
        ? inviteService.getInvitations(currentUser.id)
        : Promise.reject(new Error("User is not authenticated")),
    refetchOnWindowFocus: false,
  });

  const sendInviteMutation = useMutation({
    mutationFn: async (email: string) => {
      if (!currentUser?.id) {
        throw new Error("User ID is undefined");
      }
      return inviteService.createInvite(email, "member", currentUser.id);
    }
  });

  const setPasswordMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      if (!currentUser?.email) {
        return Promise.reject(new Error("No user email found"));
      }
      return inviteService.setPassword(
        currentUser.id,
        currentUser.email,
        username,
        password
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      navigate("/login");
    },
  });

  const deleteInvite = useMutation({
    mutationFn: (id: string) => {
      if (!currentUser?.id) {
        return Promise.reject(new Error("User ID is undefined"));
      }
      return inviteService.deleteInvitation(id, currentUser?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      console.error("Error deleting invite:", error);
    },
  });
  return {
    invitations: invitationsQuery?.data?.data || [],
    isLoading: invitationsQuery.isFetching,
    isError: invitationsQuery.isError,
    sendInvite: sendInviteMutation.mutate,
    isInviting: sendInviteMutation.isPending,
    setPassword: setPasswordMutation.mutate,
    isSettingPassword: setPasswordMutation.isPending,
    deleteInvite: (id: string) => deleteInvite.mutate(id),
    isDeleting: deleteInvite.isPending,
  };
};
