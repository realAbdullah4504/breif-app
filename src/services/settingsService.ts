import { defaultSettings } from "../data/settingsData";
import { supabase } from "../lib/supabase";
import { WorkspaceSettings } from "../types/settingTypes";

export class SettingsService {
  async getSettings(
    adminId: string
  ): Promise<{ data: WorkspaceSettings | null; error: Error | null }> {
    // Validate adminId before making the query
    if (!adminId || adminId.trim() === "") {
      console.error("Invalid or empty adminId provided to getSettings");
      return { data: null, error: new Error("Invalid admin ID provided") };
    }

    try {
      const { data, error } = await supabase
        .from("workspace_settings")
        .select("*")
        .eq("admin_id", adminId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching settings:", error);
        return { data: null, error: error as Error };
      }

      // If no settings found, create default settings
      if (!data) {
        console.log(
          "No settings found, creating default settings for admin:",
          adminId
        );
        await this.insertDefaultSettings(adminId);

        // Fetch the newly created settings
        const { data: newData, error: newError } = await supabase
          .from("workspace_settings")
          .select("*")
          .eq("admin_id", adminId)
          .single();

        if (newError) {
          console.error("Error fetching newly created settings:", newError);
          return { data: null, error: newError as Error };
        }

        return { data: newData, error: null };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching settings:", error);
      return { data: null, error: error as Error };
    }
  }

  async insertDefaultSettings(admin_id: string, organizationName?: string) {
    const settings = {
      ...defaultSettings,
      admin_id,
      name: organizationName || defaultSettings.name || "My Team Workspace",
    };

    const { data, error } = await supabase
      .from("workspace_settings")
      .insert(settings)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
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
