import { useMutation, useQuery } from "@tanstack/react-query";
import { WorkspaceService } from "../services/workspaceService";
import { queryClient } from "../lib/queryClient";

const workspaceService = new WorkspaceService();
export const useWorkspaces = (userId: string) => {
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
    onSuccess: () => {
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
