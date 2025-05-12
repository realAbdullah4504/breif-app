import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BriefService } from "../services/briefService";
import { useAuth } from "../context/AuthContext";
import { CreateBriefDTO } from "../types/briefTypes";
import { useNotificationSender } from "./useNotifications";

const briefService = new BriefService();

export const useBrief = () => {
  const queryClient = useQueryClient();
  const { createNotification } = useNotificationSender();
  const { currentUser } = useAuth();
  const sender_id = currentUser?.id || "";
  const invited_by = currentUser?.user_metadata?.invited_by || "";

  const briefsQuery = useQuery({
    queryKey: ["briefs", currentUser?.id],
    queryFn: () => briefService.getUserBriefs(currentUser?.id || ""),
    enabled: !!currentUser?.id,
  });

  const submitBriefMutation = useMutation({
    mutationFn: async (brief: CreateBriefDTO) =>
      briefService.submitBrief(brief),
    onSuccess: () => {
      createNotification({
        sender_id,
        receiver_id: invited_by,
        message: `${currentUser?.name} has submitted a brief`,
      });
      queryClient.invalidateQueries({ queryKey: ["briefs", currentUser?.id] });
    },
  });

  return {
    briefs: briefsQuery.data?.data || [],
    isLoading: briefsQuery.isLoading,
    error: briefsQuery.error,
    submitBrief: submitBriefMutation.mutate,
    isSubmitting: submitBriefMutation.isPending,
  };
};
