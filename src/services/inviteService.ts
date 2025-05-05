import { supabase } from "../lib/supabase";

export class InviteService {
  async createInvite(
    email: string,
    role: string = "member",
    adminId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "send-invitation",
        {
          body: { email, role, adminId },
        }
      );

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Error creating invite:", error);
      return { error: error as Error };
    }
  }
  async getInvitations(id:string): Promise<{ data: any[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("invited_by", id)

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching invitations:", error);
      return { data: [], error: error as Error };
    }
  }

  async deleteInvitation(invitationId: string, adminId: string): Promise<{ error: Error | null }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'delete-invitation',
        {
          body: { invitationId, adminId }
        }
      );

      if (data?.error) {
        throw new Error(data.error);
      }

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error deleting invitation:', error);
      return { 
        error: error instanceof Error ? error : new Error('Failed to delete invitation')
      };
    }
  }

  async setPassword(
    id: string,
    email: string,
    password: string,
    role: string = "member"
  ): Promise<{ error: Error | null }> {
    try {
      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordError) throw passwordError;

      const { error: updateError } = await supabase
        .from("invitations")
        .update({ status: "accepted" })
        .eq("email", email)
        .single();

      await supabase.from("users").upsert({
        id,
        email,
        role,
      });

      if (updateError) throw updateError;

      return { error: null };
    } catch (error) {
      console.error("Error setting password:", error);
      return { error: error as Error };
    }
  }
}
