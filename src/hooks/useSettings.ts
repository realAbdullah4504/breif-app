import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { SettingsService } from "../services/settingsService";
import { WorkspaceSettings } from "../types/settingTypes";
import { useAuth } from "../context/AuthContext";

const settingsService = new SettingsService();

export const useSettings = () => {
  const { currentUser } = useAuth();
  
  let adminIdForSettings: string | undefined = undefined;
  
  if (currentUser?.role === "admin") {
    const trimmedId = currentUser?.id?.trim();
    adminIdForSettings = trimmedId && trimmedId.length > 0 ? trimmedId : undefined;
  } else if (currentUser?.role === "member") {
    const trimmedInvitedBy = currentUser?.invited_by?.trim();
    adminIdForSettings = trimmedInvitedBy && trimmedInvitedBy.length > 0 ? trimmedInvitedBy : undefined;
  }
  
  console.log(currentUser?.role, adminIdForSettings, "hello");
  const queryClient = useQueryClient();

  const settingsQuery = useSuspenseQuery({
    queryKey: ["workspace-settings", adminIdForSettings],
    queryFn: () => settingsService.getSettings(adminIdForSettings),
    select: (response) => response.data,
    enabled: !!adminIdForSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Partial<WorkspaceSettings>) =>
      settingsService.updateSettings(settings),

    // Optimistically update the cache before the server responds
    onMutate: async (newSettings) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["workspace-settings", adminIdForSettings] });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<WorkspaceSettings>([
        "workspace-settings",
        adminIdForSettings,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["workspace-settings", adminIdForSettings],
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
          ["workspace-settings", adminIdForSettings],
          context.previousSettings
        );
      }
      // You can also show an error toast here
    },

    // Always refetch after error or success to ensure cache is in sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-settings", adminIdForSettings] });
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
