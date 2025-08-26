import { useMutation, useQuery } from "@tanstack/react-query";
import { WorkspaceService } from "../services/workspaceService";

const workspaceService = new WorkspaceService();
export const useWorkspaces = (userId: string) => {
  const { data, isFetching, error } = useQuery({
    queryKey: ["workspaces", userId],
    queryFn: () => workspaceService.getMemberWorkspaces(userId),
    select: (response) => response.data,
    enabled: !!userId,
  });
  const acceptMemberWorkspaceInvitationMutation = useMutation({
    mutationFn: async ({ token, email }: { token: string; email: string }) => {
      await workspaceService.acceptInvitation(token, email);
    },
  });
  return {
    workspaces: data,
    loading: isFetching,
    error: error,
    acceptMemberWorkspaceInvitation:
      acceptMemberWorkspaceInvitationMutation.mutate,
    isAccepting: acceptMemberWorkspaceInvitationMutation.isPending,
  };
};
