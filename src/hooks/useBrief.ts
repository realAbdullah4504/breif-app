import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BriefService } from "../services/briefService";
import { useAuth } from "../context/AuthContext";
import { CreateBriefDTO } from "../types/briefTypes";
import { useNotificationSender } from "./useNotifications";
import { useEmail } from "./useEmail";

const briefService = new BriefService();

export const useBrief = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const { createNotification } = useNotificationSender();
  const { sendEmail } = useEmail();
  const { currentUser } = useAuth();
  const sender_id = currentUser?.id || "";
  const invited_by = currentUser?.user_metadata?.invited_by || "";

  const briefsQuery = useQuery({
    queryKey: ["briefs", currentUser?.id,workspaceId],
    queryFn: () => briefService.getUserBriefs(currentUser?.id || "",workspaceId),
    enabled: !!currentUser?.id && !!workspaceId,
  });

  const submitBriefMutation = useMutation({
    mutationFn: async (brief: CreateBriefDTO) =>
      briefService.submitBrief(brief,currentUser?.id || "",workspaceId),
    onSuccess: async (result) => {
      createNotification({
        sender_id,
        receiver_id: invited_by,
        message: `${currentUser?.name} has submitted a brief`,
      });
      
      // Send email notification to admin
      if (result.data && invited_by) {
        try {
          await briefService.sendBriefNotificationToAdmin(result.data, currentUser);
        } catch (error) {
          console.error('Failed to send email notification to admin:', error);
        }
      }
      
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
