import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { InviteService } from "../services/inviteService";
import { queryClient } from "../lib/queryClient";
import { useNavigate } from "react-router-dom";
import { ExtendedUser } from "../services/auth";
import { useWorkspaceContext } from "../context/WorkspaceContext";

const inviteService = new InviteService();

export const useTeamInvitations = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const invitationsQuery = useQuery({
    queryKey: ["invitations",currentUser?.id],
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
    },
  });

  const verifyTokenMutation = useMutation({
    mutationFn: async ({ token, email }: { token: string; email: string }) => {
      return inviteService.verifyToken(token, email);
    },
  });

  const setPasswordMutation = useMutation({
    mutationFn: ({
      token,
      email,
      username,
      password,
    }: {
      token: string;
      email: string;
      username: string;
      password: string;
    }) => {
      return inviteService.setPassword(token, email, username, password);
    },
    onSuccess: (user: ExtendedUser) => {
      setCurrentUser(user);
      queryClient.invalidateQueries({
        queryKey: ["workspaces", currentUser?.id],
      });
    },
    onError: (error) => {
      console.error("Error setting password:", error);
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
      queryClient.invalidateQueries({ queryKey: ["invitations",currentUser?.id] });
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

    verifyToken: verifyTokenMutation.mutate,
    isVerifyingToken: verifyTokenMutation.isPending,

    setPassword: setPasswordMutation.mutate,
    isSettingPassword: setPasswordMutation.isPending,

    deleteInvite: (id: string) => deleteInvite.mutate(id),
    isDeleting: deleteInvite.isPending,
  };
};
