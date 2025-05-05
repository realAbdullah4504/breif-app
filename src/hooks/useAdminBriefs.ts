import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BriefService } from '../services/briefService';

const briefService = new BriefService();

export const useAdminBriefs = () => {
  const queryClient = useQueryClient();

  const briefsQuery = useQuery({
    queryKey: ['admin-briefs'],
    queryFn: () => briefService.getAllBriefs(),
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const statsQuery = useQuery({
    queryKey: ['brief-stats'],
    queryFn: () => briefService.getBriefStats(),
    refetchInterval: 30000
  });

  const reviewBriefMutation = useMutation({
    mutationFn: ({ briefId, adminNotes }: { briefId: string; adminNotes: string }) =>
      briefService.reviewBrief(briefId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-briefs'] });
      queryClient.invalidateQueries({ queryKey: ['brief-stats'] });
    },
  });

  return {
    briefs: briefsQuery.data?.data || [],
    isLoading: briefsQuery.isLoading,
    error: briefsQuery.error,
    stats: statsQuery.data?.data || {
      totalMembers: 0,
      submittedCount: 0,
      pendingCount: 0
    },
    isLoadingStats: statsQuery.isLoading,
    reviewBrief: reviewBriefMutation.mutate,
    isReviewing: reviewBriefMutation.isPending
  };
};