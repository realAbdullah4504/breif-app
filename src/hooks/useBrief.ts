import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BriefService, CreateBriefDTO } from '../services/briefService';
import { useAuth } from '../context/AuthContext';

const briefService = new BriefService();

export const useBrief = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const briefsQuery = useQuery({
    queryKey: ['briefs', currentUser?.id],
    queryFn: () => briefService.getUserBriefs(currentUser?.id || ''),
    enabled: !!currentUser?.id
  });

  const submitBriefMutation = useMutation({
    mutationFn: (brief: CreateBriefDTO) => briefService.submitBrief(brief),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefs', currentUser?.id] });
    }
  });

  return {
    briefs: briefsQuery.data?.data || [],
    isLoading: briefsQuery.isLoading,
    error: briefsQuery.error,
    submitBrief: submitBriefMutation.mutate,
    isSubmitting: submitBriefMutation.isPending
  };
};