import { supabase } from '../lib/supabase';

export interface ReminderTemplate {
  subject: string;
  body: string;
}

export interface BriefQuestions {
  accomplishments: string;
  blockers: string;
  priorities: string;
  question4?: string;
  question5?: string;
}

export interface WorkspaceSettings {
  id: string;
  questions: BriefQuestions;
  submission_deadline: string;
  email_reminders: boolean;
  reminder_template: ReminderTemplate;
  created_at: string;
  updated_at: string;
}

export class SettingsService {
  async getSettings(): Promise<{ data: WorkspaceSettings | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('workspace_settings')
        .select('*')
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { data: null, error: error as Error };
    }
  }

  async updateSettings(settings: Partial<WorkspaceSettings>): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('workspace_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { error: error as Error };
    }
  }
}