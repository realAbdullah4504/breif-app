import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsService} from '../services/settingsService';
import { WorkspaceSettings } from '../types/settingTypes';

const settingsService = new SettingsService();

export const useSettings = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['workspace-settings'],
    queryFn: () => settingsService.getSettings(),
    select: (response) => response.data
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Partial<WorkspaceSettings>) => 
      settingsService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-settings'] });
    }
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    isSuccess: updateSettingsMutation.isSuccess
  };
};