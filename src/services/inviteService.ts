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
  async getInvitations(): Promise<{ data: any[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching invitations:", error);
      return { data: [], error: error as Error };
    }
  }

  async deleteInvitation(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.from("invitations").delete().eq("id", id);
    console.log("error", error);
    if (error) throw error;
    return { error: null };
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
