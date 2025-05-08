import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BriefService } from "../services/briefService";
import { useAuth } from "../context/AuthContext";
import { FilterOptions } from "../types/briefTypes";

const briefService = new BriefService();

export const useAdminBriefs = (filters: FilterOptions) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const statsQuery = useQuery({
    queryKey: ["brief-stats", filters],
    queryFn: () => briefService.getBriefStats(currentUser!.id, filters),
    enabled: !!currentUser,
  });

  const briefsQuery = useQuery({
    queryKey: ["admin-briefs", filters],
    queryFn: () => briefService.getAllBriefs(currentUser!.id, filters),
    enabled: !!currentUser,
  });

  const reviewBriefMutation = useMutation({
    mutationFn: ({
      briefId,
      adminNotes,
    }: {
      briefId: string;
      adminNotes: string;
    }) => briefService.reviewBrief(currentUser!.id, briefId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-briefs"] });
      queryClient.invalidateQueries({ queryKey: ["brief-stats"] });
    },
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
    reviewBrief: reviewBriefMutation.mutate,
    isReviewing: reviewBriefMutation.isPending,
  };
};