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
  async getAllBriefs(adminId: string): Promise<{ teamMembers:BriefWithUser[] | null,data: BriefWithUser[] | null; error: Error | null }> {
    try {
      // First, get all team members under this admin
      const { data: teamMembers, error: teamError } = await supabase
        .from('users')
        .select('*')
        .eq('invited_by', adminId)
        .eq('role', 'member');
  
      if (teamError) throw teamError;
  
      if (!teamMembers?.length) {
        return { teamMembers:[],data: [], error: null };
      }
  
      // Get the user IDs of all team members
      const teamMemberIds = teamMembers.map(member => member.id);
  
      // Then fetch briefs for all these team members
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
        .in('user_id', teamMemberIds)
        .order('submitted_at', { ascending: false });
  
      if (error) throw error;
  
      return { teamMembers:teamMembers,data: data || null, error: null };
    } catch (error) {
      console.error('Error fetching briefs:', error);
      return { teamMembers:null,data: null, error: error as Error };
    }
  }
  async reviewBrief(adminId:string,briefId: string, adminNotes: string) {
    try {

      const { data, error } = await supabase
        .from('briefs')
        .update({
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId,
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