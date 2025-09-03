import { useMutation, useQuery } from "@tanstack/react-query";
import { WorkspaceService } from "../services/workspaceService";
import { queryClient } from "../lib/queryClient";
import { useWorkspaceContext } from "../context/WorkspaceContext";

const workspaceService = new WorkspaceService();
export const useWorkspaces = (userId: string) => {
  const { setWorkspaceId } = useWorkspaceContext();
  const { data, isFetching, error } = useQuery({
    queryKey: ["workspaces", userId],
    queryFn: () => workspaceService.getAllWorkspaces(userId),
    select: (response) => response.data,
    enabled: !!userId,
  });
  const acceptMemberWorkspaceInvitationMutation = useMutation({
    mutationFn: async ({ token, email }: { token: string; email: string }) => {
      const { user } = await workspaceService.acceptInvitation(token, email);
      return user;
    },
    onSuccess: (user) => {
      setWorkspaceId(user.workspaceId);
      queryClient.invalidateQueries({ queryKey: ["workspaces", userId] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return {
    workspaces: data,
    isLoading: isFetching,
    error: error,
    acceptMemberWorkspaceInvitation:
      acceptMemberWorkspaceInvitationMutation.mutate,
    isAccepting: acceptMemberWorkspaceInvitationMutation.isPending,
  };
};
