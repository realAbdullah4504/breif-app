import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { BriefService } from "../services/briefService";
import { useAuth } from "../context/AuthContext";
import { FilterOptions } from "../types/briefTypes";
import { useNotificationSender } from "./useNotifications";

const briefService = new BriefService();

export const useAdminBriefs = (filters: FilterOptions) => {
  const { currentUser } = useAuth();

  const statsQuery = useSuspenseQuery({
    queryKey: ["brief-stats", filters],
    queryFn: () => briefService.getBriefStats(currentUser!.id, filters),
    // enabled: !!currentUser,
  });

  const briefsQuery = useSuspenseQuery({
    queryKey: ["admin-briefs", filters],
    queryFn: () => briefService.getAllBriefs(currentUser!.id, filters),
    // enabled: !!currentUser,
  });

  return {
    briefs: briefsQuery.data?.data || [],
    teamMembers: briefsQuery.data?.teamMembers || [],
    filteredTeamMembers: briefsQuery.data?.filteredTeamMembers || [],
    isLoading: briefsQuery.isLoading,
    error: briefsQuery.error as Error | null,
    stats: statsQuery.data?.data || {
      totalMembers: 0,
      submittedCount: 0,
      pendingCount: 0,
    },
    isLoadingStats: statsQuery.isLoading,
  };
};

export const useReviewBriefs = () => {
  const queryClient = useQueryClient();
  const { createNotification } = useNotificationSender();
  const { currentUser } = useAuth();
  const sender_id = currentUser?.id || "";

  const reviewBriefMutation = useMutation({
    mutationFn: ({
      briefId,
      userId,
      adminNotes,
    }: {
      briefId: string;
      userId: string;
      adminNotes: string;
    }) => briefService.reviewBrief(currentUser!.id, briefId, adminNotes),
    onSuccess: (_, variables) => {
      createNotification({
        sender_id,
        receiver_id: variables.userId,
        message: `${currentUser?.name} has reviewed your brief`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-briefs"] });
      queryClient.invalidateQueries({ queryKey: ["brief-stats"] });
    },
  });
  return {
    reviewBrief: reviewBriefMutation.mutate,
    isReviewing: reviewBriefMutation.isPending,
  };
};
