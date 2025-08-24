import { supabase } from '../lib/supabase';

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_submission_date: string | null;
  created_at: string;
  updated_at: string;
}

export class RecognitionService {
  async updateUserStreak(userId: string): Promise<{ data: UserStreak | null; error: Error | null }> {
    try {
      // For now, just return a mock response to prevent errors
      // This can be implemented later when achievements are re-added
      console.log('Streak update called for user:', userId);
      return { data: null, error: null };
    } catch (error) {
      console.error('Error updating user streak:', error);
      return { data: null, error: error as Error };
    }
  }

  async getUserStreak(userId: string): Promise<{ data: UserStreak | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { data: data || null, error: null };
    } catch (error) {
      console.error('Error fetching user streak:', error);
      return { data: null, error: error as Error };
    }
  }

  async getAllUserStreaks(adminId: string): Promise<{ data: UserStreak[] | null; error: Error | null }> {
    try {
      // Get admin's workspace_id
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspace_settings')
        .select('id')
        .eq('admin_id', adminId)
        .single();

      if (workspaceError) throw workspaceError;

      // Get team members first
      const { data: teamMembers, error: teamError } = await supabase
        .from('users')
        .select('id')
        .eq('workspace_id', workspaceData.id)
        .eq('role', 'member');

      if (teamError) throw teamError;

      if (!teamMembers?.length) {
        return { data: [], error: null };
      }

      const teamMemberIds = teamMembers.map(member => member.id);

      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .in('user_id', teamMemberIds);

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching all user streaks:', error);
      return { data: [], error: error as Error };
    }
  }

  async getUserAchievements(userId: string): Promise<{ data: any[] | null; error: Error | null }> {
    try {
      // Return empty array for now since achievements are removed
      return { data: [], error: null };
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return { data: [], error: error as Error };
    }
  }
}