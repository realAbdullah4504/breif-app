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
      // Get admin's workspace to filter invitations
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspace_settings")
        .select("id")
        .eq("admin_id", id)
        .single();

      if (workspaceError) throw workspaceError;

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

  async verifyToken(
    token: string,
    email: string
  ): Promise<{ error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("email", email)
        .eq("token", token)
        .eq("status", "pending") // 👈 good to add if you track invite status
        .single();

      if (error || !data) {
        throw new Error("Invalid or expired token");
      }

      return { error: null };
    } catch (err) {
      console.error("Error verifying token:", err);
      throw err;
    }
  }

  async setPassword(
    token: string,
    email: string,
    name: string,
    password: string,
    role: string = "member"
  ) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name,
          },
        },
      });

      if (authError || !authData) throw authError;

      const { data: invitation, error: invitationError } = await supabase
        .from("invitations")
        .update({ status: "accepted" })
        .eq("email", email)
        .eq("token", token)
        .select("workspace_id, invited_by")
        .single();

      if (invitationError || !invitation) throw invitationError;

      const { data: userSelected, error: userError } = await supabase
        .from("users")
        .upsert({
          id: authData?.user?.id,
          name,
          email,
          role,
        })
        .select("*")
        .single();
      if (userError) throw userError;
      await supabase.from("workspace_members").insert({
        workspace_id: invitation?.workspace_id,
        user_id: authData?.user?.id,
        role,
        invited_by: invitation?.invited_by,
        status: "accepted",
      });
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (user) {
        return { ...user, ...userSelected };
      }
      if (error) throw error;
      return { error };
    } catch (error) {
      console.error("Error setting password:", error);
      throw error;
    }
  }
}
