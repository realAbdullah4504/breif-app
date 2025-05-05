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
    mutationFn: (email: string) =>
      currentUser?.id
        ? inviteService.createInvite(email, "member", currentUser.id)
        : Promise.reject(new Error("User ID is undefined")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      console.error("Error sending invite:", error);
    },
  });

  const setPasswordMutation = useMutation({
    mutationFn: (password: string) => {
      if (!currentUser?.email) {
        return Promise.reject(new Error("No user email found"));
      }
      return inviteService.setPassword(
        currentUser.id,
        currentUser.email,
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
    sendInvite: (email: string) => sendInviteMutation.mutate(email),
    isInviting: sendInviteMutation.isPending,
    setPassword: (password: string) => setPasswordMutation.mutate(password),
    isSettingPassword: setPasswordMutation.isPending,
    deleteInvite: (id: string) => deleteInvite.mutate(id),
  };
};
