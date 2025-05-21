import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { SettingsService } from "../services/settingsService";
import { WorkspaceSettings } from "../types/settingTypes";
import { useAuth } from "../context/AuthContext";

const settingsService = new SettingsService();

export const useSettings = () => {
  const { currentUser } = useAuth();
  let id = currentUser?.id || "";
  if (currentUser?.role === "member") id = currentUser?.invited_by || "";
  console.log(currentUser?.role,id,"hello")
  const queryClient = useQueryClient();

  const settingsQuery = useSuspenseQuery({
    queryKey: ["workspace-settings", id],
    queryFn: () => settingsService.getSettings(id),
    select: (response) => response.data,
    // enabled: !!id,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Partial<WorkspaceSettings>) =>
      settingsService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-settings"] });
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
