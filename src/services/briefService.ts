import { supabase } from '../lib/supabase';

export interface Brief {
  id: string;
  user_id: string;
  accomplishments: string;
  blockers: string;
  priorities: string;
  question4_response?: string;
  question5_response?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBriefDTO {
  accomplishments: string;
  blockers: string;
  priorities: string;
  question4_response?: string;
  question5_response?: string;
}

export class BriefService {
  async submitBrief(brief: CreateBriefDTO): Promise<{ data: Brief | null; error: Error | null }> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('briefs')
        .insert({
          ...brief,
          user_id: userData.user.id,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error submitting brief:', error);
      return { data: null, error: error as Error };
    }
  }

  async getUserBriefs(userId: string): Promise<{ data: Brief[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching user briefs:', error);
      return { data: [], error: error as Error };
    }
  }
  async getAllBriefs() {
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching briefs:', error);
      return { data: null, error };
    }
  }
  async reviewBrief(briefId: string, adminNotes: string) {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('briefs')
        .update({
          reviewed_at: new Date().toISOString(),
          reviewed_by: userData.user.id,
          admin_notes: adminNotes
        })
        .eq('id', briefId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error reviewing brief:', error);
      return { data: null, error };
    }
  }
  async getBriefStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: members, error: membersError } = await supabase
        .from('users')
        .select('count')
        .eq('role', 'member');

      if (membersError) throw membersError;

      const { data: submitted, error: submittedError } = await supabase
        .from('briefs')
        .select('count')
        .gte('submitted_at', today.toISOString());

      if (submittedError) throw submittedError;

      return {
        data: {
          totalMembers: members[0].count,
          submittedCount: submitted[0].count,
          pendingCount: members[0].count - submitted[0].count
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting brief stats:', error);
      return { data: null, error };
    }
  }
}