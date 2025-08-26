import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { SettingsService } from "../services/settingsService";
import { WorkspaceSettings } from "../types/settingTypes";

const settingsService = new SettingsService();

export const useSettings = (adminId:string) => {
  
  const queryClient = useQueryClient();

  const settingsQuery = useSuspenseQuery({
    queryKey: ["workspace-settings", adminId],
    queryFn: () => settingsService.getSettings(adminId),
    select: (response) => response.data,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Partial<WorkspaceSettings>) =>
      settingsService.updateSettings(settings),

    // Optimistically update the cache before the server responds
    onMutate: async (newSettings) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["workspace-settings", adminId] });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<WorkspaceSettings>([
        "workspace-settings",
        adminId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["workspace-settings", adminId],
        (old: WorkspaceSettings | undefined) => ({
          ...old,
          ...newSettings,
        })
      );

      // Return a context object with the snapshotted value
      return { previousSettings };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(
          ["workspace-settings", adminId],
          context.previousSettings
        );
      }
      // You can also show an error toast here
    },

    // Always refetch after error or success to ensure cache is in sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-settings", adminId] });
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    isSuccess: updateSettingsMutation.isSuccess,
  };
};