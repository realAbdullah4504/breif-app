import { useMutation, useQuery } from "@tanstack/react-query";
import { WorkspaceService } from "../services/workspaceService";

const workspaceService = new WorkspaceService();
export const useWorkspaces = (userId: string) => {
  const { data, isFetching, error } = useQuery({
    queryKey: ["workspaces", userId],
    queryFn: () => workspaceService.getAllWorkspaces(userId),
    select: (response) => response.data,
    enabled: !!userId,
  });
  return {
    workspaces: data,
    isLoading: isFetching,
    error: error,
  };
};

export const useWorkspaceInvitation = () => {
  const acceptMemberWorkspaceInvitationMutation = useMutation({
    mutationFn: async ({ token, email }: { token: string; email: string }) => {
      const { user } = await workspaceService.acceptInvitation(token, email);
      return user;
    },
    onSuccess: () => {},
    onError: () => {
      console.log("error");
    },
  });
  return {
    acceptMemberWorkspaceInvitation:
      acceptMemberWorkspaceInvitationMutation.mutate,
    isAccepting: acceptMemberWorkspaceInvitationMutation.isPending,
  };
};
