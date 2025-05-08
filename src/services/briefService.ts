import { supabase } from '../lib/supabase';
import { Brief, CreateBriefDTO, FilterOptions} from '../types/briefTypes';
import { getFilteredMembers } from '../utils/filters';


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
  async getAllBriefs(adminId: string,filters:FilterOptions) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      let startDate = today;
      let endDate = tomorrow;
  
      switch (filters.date) {
        case "today":
          // startDate and endDate already set
          break;
        case "yesterday": {
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 1);
          endDate = today;
          break;
        }
        case "custom": {
          if (filters.customRange?.start && filters.customRange?.end) {
            startDate = new Date(filters.customRange.start);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(filters.customRange.end);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
        }
      }
  
      // Get team members
      const { data: teamMembers, error: teamError } = await supabase
        .from('users')
        .select('*')
        .eq('invited_by', adminId)
        .eq('role', 'member');
  
      if (teamError) throw teamError;
  
      if (!teamMembers?.length) {
        return { teamMembers: [], data: [], error: null };
      }
  
      const teamMemberIds = teamMembers.map(member => member.id);
  
      // Fetch briefs with date filter
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
        .gte('submitted_at', startDate.toISOString())
        .lt('submitted_at', endDate.toISOString())
        .order('submitted_at', { ascending: false });
  
      if (error) throw error;
  
      const filteredTeamMembers = getFilteredMembers(teamMembers, data, filters.status, filters.review);
        return { teamMembers, filteredTeamMembers, data: data || null, error: null };
    } catch (error) {
        console.error('Error fetching briefs:', error);
        return { 
            teamMembers: null, 
            filteredTeamMembers: null, // Initialize this properly
            data: null, 
            error: error as Error 
        };
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
  async getBriefStats(adminId: string, filters: FilterOptions) {
    try {
      // Set up date range based on filters
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      let startDate = today;
      let endDate = tomorrow;
  
      switch (filters.date) {
        case "today":
          // startDate and endDate already set
          break;
        case "yesterday": {
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 1);
          endDate = today;
          break;
        }
        case "week": {
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 7);
          endDate = tomorrow;
          break;
        }
        case "custom": {
          if (filters.customRange?.start && filters.customRange?.end) {
            startDate = new Date(filters.customRange.start);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(filters.customRange.end);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
        }
      }
  
      // Get total team members
      const { data: members, error: membersError } = await supabase
        .from('users')
        .select('count')
        .eq('role', 'member')
        .eq('invited_by', adminId);
  
      if (membersError) throw membersError;
  
      // Get submitted briefs within date range
      const { data: submitted, error: submittedError } = await supabase
        .from('briefs')
        .select('*, users:user_id (invited_by)')
        .gte('submitted_at', startDate.toISOString())
        .lt('submitted_at', endDate.toISOString());
  
      if (submittedError) throw submittedError;
      
      const filteredSubmittedCount = submitted?.filter(
        (brief) => brief?.users?.invited_by === adminId
      ).length || 0;
  
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
      return { 
        data: null, 
        error: error as Error 
      };
    }
  }
}