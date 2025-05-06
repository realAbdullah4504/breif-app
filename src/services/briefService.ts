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

interface BriefWithUser extends Brief {
  users: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    invited_by: string;
  };
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
  async getAllBriefs(adminId:string): Promise<{ data: BriefWithUser[] | null; error: Error | null }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from('briefs')
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            avatar_url,
            invited_by
          )
        `)
        // .gte('submitted_at', today.toISOString())
        .order('submitted_at', { ascending: false });
        const filtered = data?.filter(
          (brief) => brief.users?.invited_by === adminId
        );

      if (error) throw error;
      return { data: filtered || null, error: null };
    } catch (error) {
      console.error('Error fetching briefs:', error);
      return { data: null, error: error as Error };
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
  async getBriefStats(adminId:string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: members, error: membersError } = await supabase
      .from('users')
      .select('count')
      .eq('role', 'member')
      .eq('invited_by', adminId);

      if (membersError) throw membersError;

      const { data: submitted, error: submittedError } = await supabase
      .from('briefs')
      .select('*, users:user_id (invited_by)')
      // .gte('submitted_at', today.toISOString());

      if (submittedError) throw submittedError;
      
      const filteredSubmittedCount= submitted?.filter(
        (brief) => brief?.users?.invited_by === adminId
      ).length || 0;
      console.log("total",members[0].count, "submitted", filteredSubmittedCount, "pending", members[0].count - filteredSubmittedCount)
      return {
        data: {
          totalMembers: members[0].count,
          submittedCount: filteredSubmittedCount,
          pendingCount: members[0].count - filteredSubmittedCount
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting brief stats:', error);
      return { data: null, error };
    }
  }
}