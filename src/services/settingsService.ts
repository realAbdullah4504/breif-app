import { defaultSettings } from "../data/settingsData";
import { supabase } from "../lib/supabase";
import { WorkspaceSettings } from "../types/settingTypes";

export class SettingsService {
  async getSettings(
    adminId: string
  ): Promise<{ data: WorkspaceSettings | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("workspace_settings")
        .select("*")
        .eq("admin_id", adminId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching settings:", error);
      return { data: null, error: error as Error };
    }
  }
  async insertDefaultSettings(admin_id: string) {
    const { error } = await supabase
      .from("workspace_settings")
      .insert({ ...defaultSettings, admin_id });
    if (error) throw error;
  }
  async updateSettings(
    settings: Partial<WorkspaceSettings>
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from("workspace_settings")
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Error updating settings:", error);
      return { error: error as Error };
    }
  }
}
