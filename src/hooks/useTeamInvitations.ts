import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { InviteService } from "../services/inviteService";
import { queryClient } from "../lib/queryClient";
import { useNavigate } from "react-router-dom";

const inviteService = new InviteService();

export const useTeamInvitations = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const sendInviteMutation = useMutation({
    mutationFn: (email: string) =>
      currentUser?.id
        ? inviteService.createInvite(email, "member", currentUser.id)
        : Promise.reject(new Error("User ID is undefined")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  const setPasswordMutation = useMutation({
    mutationFn: (password: string) => {
      if (!currentUser?.email) {
        return Promise.reject(new Error("No user email found"));
      }
      return inviteService.setPassword(currentUser.id,currentUser.email, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      navigate("/login?setup=success");
    },
  });
  return {
    sendInvite: (email: string) => sendInviteMutation.mutate(email),
    setPassword: (password: string) => setPasswordMutation.mutate(password),
    isInviting: sendInviteMutation.isPending,
    isSettingPassword: setPasswordMutation.isPending,
  };
};
