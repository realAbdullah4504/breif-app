import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BriefService } from "../services/briefService";
import { useAuth } from "../context/AuthContext";
import { CreateBriefDTO } from "../types/briefTypes";
import { useNotificationSender } from "./useNotifications";
import { useSettings } from "./useSettings";

const briefService = new BriefService();

export const useBrief = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const { createNotification } = useNotificationSender();
  const { currentUser } = useAuth();
  const sender_id = currentUser?.id || "";
  const { settings } = useSettings(workspaceId);

  const briefsQuery = useQuery({
    queryKey: ["briefs", currentUser?.id, workspaceId],
    queryFn: () =>
      briefService.getUserBriefs(currentUser?.id || "", workspaceId),
    enabled: !!currentUser?.id && !!workspaceId,
  });

  const submitBriefMutation = useMutation({
    mutationFn: async (brief: CreateBriefDTO) =>
      briefService.submitBrief(brief, currentUser?.id || "", workspaceId),
    onSuccess: async (result) => {
      createNotification({
        sender_id,
        receiver_id: settings?.admin_id || "",
        message: `${currentUser?.name} has submitted a brief`,
      });

      // Send email notification to admin
      if (result.data && settings?.admin_id) {
        try {
          await briefService.sendBriefNotificationToAdmin(
            result.data,
            currentUser,
            workspaceId
          );
        } catch (error) {
          console.error("Failed to send email notification to admin:", error);
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
