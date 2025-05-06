import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BriefService } from "../services/briefService";
import { useAuth } from "../context/AuthContext";

const briefService = new BriefService();

export const useAdminBriefs = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const briefsQuery = useQuery({
    queryKey: ["admin-briefs"],
    queryFn: async () => {
      if (currentUser) {
        return await briefService.getAllBriefs(currentUser.id);
      }
      return { data: [], error: null };
    },
  });

  const statsQuery = useQuery({
    queryKey: ["brief-stats"],
    queryFn: async () => {
      if (currentUser) {
        return await briefService.getBriefStats(currentUser?.id);
      }
      return { data: [], error: null };
    },
  });

  const reviewBriefMutation = useMutation({
    mutationFn: ({
      briefId,
      adminNotes,
    }: {
      briefId: string;
      adminNotes: string;
    }) => briefService.reviewBrief(briefId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-briefs"] });
      queryClient.invalidateQueries({ queryKey: ["brief-stats"] });
    },
  });

  return {
    briefs: briefsQuery.data?.data || [],
    teamMembers: briefsQuery.data?.teamMembers || [],
    isLoading: briefsQuery.isLoading,
    error: briefsQuery.error,
    stats: statsQuery.data?.data || {
      totalMembers: 0,
      submittedCount: 0,
      pendingCount: 0,
    },
    isLoadingStats: statsQuery.isLoading,
    reviewBrief: reviewBriefMutation.mutate,
    isReviewing: reviewBriefMutation.isPending,
  };
};
