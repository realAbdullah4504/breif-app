import { supabase } from '../lib/supabase';
import { Brief, CreateBriefDTO, FilterOptions} from '../types/briefTypes';
import { getFilteredMembers } from '../utils/filters';
import { sendEmail } from './emailService';
import { format } from 'date-fns';
import { RecognitionService } from './recognitionService';

const recognitionService = new RecognitionService();

export class BriefService {
  async submitBrief(brief: CreateBriefDTO, user_id: string,workspaceId: string): Promise<{ data: Brief | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('briefs')
        .insert({
          ...brief,
          user_id,
          workspace_id: workspaceId,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update user streak after successful submission
      try {
        await recognitionService.updateUserStreak(user_id);
      } catch (streakError) {
        console.error('Error updating user streak:', streakError);
        // Don't fail the brief submission if streak update fails
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error submitting brief:', error);
      return { data: null, error: error as Error };
    }
  }

  async sendBriefNotificationToAdmin(brief: Brief, user: any): Promise<void> {
    try {
      // Get admin details
      const { data: memberData, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id,invited_by,users:user_id (email, name)')
        .eq('user_id', user.id)
        .single();
        

      if (memberError || !memberData) {
        console.error('Member not found:', memberError);
        return;
      }

      // Get workspace settings for organization name
      const { data: settings, error: settingsError } = await supabase
        .from('workspace_settings')
        .select('name, questions')
        .eq('id', memberData.workspace_id)
        .single();

      if (settingsError || !settings) {
        console.error('Settings not found:', settingsError);
        return;
      }

      const organizationName = settings?.name || 'Your Organization';
      const questions = settings?.questions || {
        accomplishments: 'What did you accomplish today?',
        blockers: 'Any blockers or challenges?',
        priorities: 'What are your priorities for tomorrow?'
      };

      // Create clean, professional email content
      const emailSubject = `📋 New Brief from ${memberData.users.name} - ${organizationName}`;
      
      const emailBody = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Brief Submitted</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px 24px; text-align: center;">
              <div style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 12px; padding: 16px 20px; border: 1px solid rgba(255,255,255,0.2);">
                <span style="font-size: 24px; margin-right: 8px;">✨</span>
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Briefly</h1>
              </div>
              <h2 style="color: white; margin: 16px 0 8px 0; font-size: 20px; font-weight: 600;">New Brief Submitted</h2>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">${organizationName}</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
              
              <!-- Team Member Info -->
              <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <div style="display: flex; align-items: center;">
                  <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                    <span style="color: white; font-size: 20px; font-weight: 600;">${user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 style="color: #1e293b; margin: 0; font-size: 18px; font-weight: 600;">${user.name}</h3>
                    <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Submitted ${format(new Date(brief.submitted_at), 'EEEE, MMMM d')} at ${format(new Date(brief.submitted_at), 'h:mm a')}</p>
                  </div>
                </div>
              </div>
              
              <!-- Brief Content -->
              <div style="margin-bottom: 32px;">
                
                <!-- Accomplishments -->
                <div style="margin-bottom: 20px;">
                  <div style="background: #10b981; padding: 12px 16px; border-radius: 8px 8px 0 0;">
                    <h4 style="color: white; margin: 0; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
                      <span style="margin-right: 6px;">🎯</span>
                      ${questions.accomplishments}
                    </h4>
                  </div>
                  <div style="background: #f0fdf4; padding: 16px; border-radius: 0 0 8px 8px; border: 1px solid #bbf7d0; border-top: none;">
                    <p style="color: #166534; margin: 0; line-height: 1.5; font-size: 14px;">${brief.accomplishments}</p>
                  </div>
                </div>
                
                <!-- Blockers -->
                <div style="margin-bottom: 20px;">
                  <div style="background: #ef4444; padding: 12px 16px; border-radius: 8px 8px 0 0;">
                    <h4 style="color: white; margin: 0; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
                      <span style="margin-right: 6px;">🚧</span>
                      ${questions.blockers}
                    </h4>
                  </div>
                  <div style="background: #fef2f2; padding: 16px; border-radius: 0 0 8px 8px; border: 1px solid #fecaca; border-top: none;">
                    <p style="color: #991b1b; margin: 0; line-height: 1.5; font-size: 14px;">${brief.blockers || 'No blockers reported'}</p>
                  </div>
                </div>
                
                <!-- Priorities -->
                <div style="margin-bottom: 20px;">
                  <div style="background: #3b82f6; padding: 12px 16px; border-radius: 8px 8px 0 0;">
                    <h4 style="color: white; margin: 0; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
                      <span style="margin-right: 6px;">⭐</span>
                      ${questions.priorities}
                    </h4>
                  </div>
                  <div style="background: #eff6ff; padding: 16px; border-radius: 0 0 8px 8px; border: 1px solid #bfdbfe; border-top: none;">
                    <p style="color: #1e40af; margin: 0; line-height: 1.5; font-size: 14px;">${brief.priorities}</p>
                  </div>
                </div>
                
                ${brief.question4_response && questions.question4 ? `
                  <div style="margin-bottom: 20px;">
                    <div style="background: #8b5cf6; padding: 12px 16px; border-radius: 8px 8px 0 0;">
                      <h4 style="color: white; margin: 0; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
                        <span style="margin-right: 6px;">💡</span>
                        ${questions.question4}
                      </h4>
                    </div>
                    <div style="background: #faf5ff; padding: 16px; border-radius: 0 0 8px 8px; border: 1px solid #d8b4fe; border-top: none;">
                      <p style="color: #6b21a8; margin: 0; line-height: 1.5; font-size: 14px;">${brief.question4_response}</p>
                    </div>
                  </div>
                ` : ''}
                
                ${brief.question5_response && questions.question5 ? `
                  <div style="margin-bottom: 20px;">
                    <div style="background: #f59e0b; padding: 12px 16px; border-radius: 8px 8px 0 0;">
                      <h4 style="color: white; margin: 0; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
                        <span style="margin-right: 6px;">🔥</span>
                        ${questions.question5}
                      </h4>
                    </div>
                    <div style="background: #fffbeb; padding: 16px; border-radius: 0 0 8px 8px; border: 1px solid #fed7aa; border-top: none;">
                      <p style="color: #92400e; margin: 0; line-height: 1.5; font-size: 14px;">${brief.question5_response}</p>
                    </div>
                  </div>
                ` : ''}
              </div>
              
              <!-- Call to Action -->
              <div style="text-align: center; margin: 24px 0;">
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                  <h3 style="color: #1e293b; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Review Dashboard</h3>
                  <p style="color: #64748b; margin: 0 0 16px 0; font-size: 14px;">View and review this brief in your admin dashboard</p>
                  <a href="https://my.brieflyapp.co/admin" 
                     style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                    📊 Open Dashboard
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 12px; line-height: 1.4;">
                This email was sent when <strong>${user.name}</strong> submitted their daily brief.<br>
                You're receiving this as an admin of <strong>${organizationName}</strong>.
              </p>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; margin: 0; font-size: 11px;">
                  Powered by <strong style="color: #6366f1;">Briefly</strong> • <a href="https://my.brieflyapp.co" style="color: #6366f1; text-decoration: none;">my.brieflyapp.co</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      await sendEmail({
        to: memberData.users.email,
        subject: emailSubject,
        html: emailBody
      });

    } catch (error) {
      console.error('Error sending brief notification to admin:', error);
      throw error;
    }
  }
  async getUserBriefs(userId: string,workspaceId: string): Promise<{ data: Brief[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId)
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
      // Get admin's workspace_id
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspace_settings')
        .select('id')
        .eq('admin_id', adminId)
        .single();

      if (workspaceError) throw workspaceError;

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
          if (filters.customRange) {
            startDate = new Date(filters.customRange);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(filters.customRange);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
        }
      }
  
      // Get team members
      const { data: teamMembers, error: teamError } = await supabase
        .from('workspace_members')
        .select('*,users:user_id (id,name,email,avatar_url)')
        .eq('workspace_id', workspaceData.id)
        .eq('role', 'member');

        console.log("teamMembers",teamMembers)
  
      if (teamError) throw teamError;
  
  
      const teamMemberIds = teamMembers?.map(member => member.user_id);
  
      // Fetch briefs with date filter
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
        .in('user_id', teamMemberIds)
        .eq('workspace_id', workspaceData.id)
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
      // Get admin's workspace_id
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspace_settings')
        .select('id')
        .eq('admin_id', adminId)
        .single();

      if (workspaceError) throw workspaceError;

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
        case "custom": {
          if (filters.customRange) {
            startDate = new Date(filters.customRange);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(filters.customRange);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
        }
      }
  
      // Get submitted briefs within date range
      // Get total team members
  
      const { data: teamMembers, error: teamError } = await supabase
        .from('workspace_members')
        .select('count')
        .eq('role', 'member')
        .eq('workspace_id', workspaceData.id);

      if (teamError) throw teamError;

      // Get real submitted briefs within date range
      const { data: submitted, error: submittedError } = await supabase
        .from('briefs')
        .select('*')
        .gte('submitted_at', startDate.toISOString())
        .lt('submitted_at', endDate.toISOString());

      if (submittedError) throw submittedError;
      
      const filteredSubmittedCount = submitted?.filter(
        (brief) => brief?.workspace_id === workspaceData.id
      ).length || 0;
  
      return {
        data: {
          totalMembers: teamMembers[0].count,
          submittedCount: filteredSubmittedCount,
          pendingCount: teamMembers[0].count - filteredSubmittedCount
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

  async deleteSampleData(adminId: string): Promise<{ error: Error | null }> {
    try {
      // Mark sample data as deleted in localStorage
      const { markSampleDataAsDeleted } = await import('../data/mockData');
      markSampleDataAsDeleted(adminId);
      return { error: null };
    } catch (error) {
      console.error('Error deleting sample data:', error);
      return { error: error as Error };
    }
  }
}