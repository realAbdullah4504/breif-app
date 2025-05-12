import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { InvitationWithUser } from "../types/invitationTypes";

export class InviteService {
  async createInvite(
    email: string,
    role: string = "member",
    adminId: string
  ): Promise<{ error: Error | null }> {
    const { data, error } = await supabase.functions.invoke("send-invitation", {
      body: { email, role, adminId },
    });
    // Check for Supabase error
    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorData = await error.context.json();
        throw new Error(errorData.error || "Failed to send invitation");
      }
      throw error;
    }

    return { error: null };
  }
  async getInvitations(id: string): Promise<{
    data: InvitationWithUser[];
    error: Error | null;
  }> {
    try {
      // First get all invitations
      const { data: invitations, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("invited_by", id);

      if (error) throw error;
      if (!invitations?.length) return { data: [], error: null };

      // Get user data for each invitation's email
      const invitationsWithUsers = await Promise.all(
        invitations.map(async (invitation) => {
          if (invitation.status !== "pending") {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("name, avatar_url")
              .eq("email", invitation.email)
              .single();

            if (userError && userError.code !== "PGRST116") {
              // Ignore not found error
              console.warn(
                `Could not fetch user data for ${invitation.email}:`,
                userError
              );
            }

            return {
              ...invitation,
              user: userData || null,
            };
          }
          return {
            ...invitation,
            user: null,
          };
        })
      );

      return { data: invitationsWithUsers, error: null };
    } catch (error) {
      console.error("Error fetching invitations:", error);
      return { data: [], error: error as Error };
    }
  }

  async deleteInvitation(
    invitationId: string,
    adminId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "delete-invitation",
        {
          body: { invitationId, adminId },
        }
      );

      if (data?.error) {
        throw new Error(data.error);
      }

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Error deleting invitation:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Failed to delete invitation"),
      };
    }
  }

  async setPassword(
    id: string,
    email: string,
    name: string,
    password: string,
    role: string = "member"
  ) {
    try {
      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordError) throw passwordError;

      const { data: invitation, error: inviteError } = await supabase
        .from("invitations")
        .select("invited_by")
        .eq("email", email)
        .single();

      if (inviteError) throw inviteError;

      const { error: updateError } = await supabase
        .from("invitations")
        .update({ status: "accepted" })
        .eq("email", email)
        .single();

      if (updateError) throw updateError;

      await supabase.from("users").upsert({
        id,
        name,
        email,
        role,
        invited_by: invitation.invited_by,
      });

      if (updateError) throw updateError;

      return { error: null };
    } catch (error) {
      console.error("Error setting password:", error);
      return { error: error as Error };
    }
  }
}
