import { supabase } from "../lib/supabase";
import { WorkspaceSettings } from "../types/settingTypes";

export class SettingsService {
  async getSettings(
    workspaceId: string
  ): Promise<{ data: WorkspaceSettings | null; error: Error | null }> {
    // Validate adminId before making the query
    if (!workspaceId || workspaceId.trim() === "") {
      console.error("Invalid or empty workspaceId provided to getSettings");
      return { data: null, error: new Error("Invalid workspace ID provided") };
    }

    try {
      const { data, error } = await supabase
        .from("workspace_settings")
        .select("*")
        .eq("id", workspaceId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching settings:", error);
        return { data: null, error: error as Error };
      }
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching settings:", error);
      return { data: null, error: error as Error };
    }
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
