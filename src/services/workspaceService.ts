import { supabase } from "../lib/supabase";

export class WorkspaceService {
  async getMemberWorkspaces(userId: string) {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Error fetching workspaces:", error);
    } else {
      console.log("Workspaces fetched:", data);
    }
    return { data: data || [], error: null };
  }
  async acceptInvitation(token: string, email: string) {
    const { data: invitation, error: inviteError } = await supabase
      .from("invitations")
      .update({ status: "accepted" })
      .eq("email", email)
      .eq("token", token)
      .select("invited_by, role")
      .single();

    if (inviteError) throw inviteError;
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // Get workspace_id from the admin who invited them
    const { data: workspaceData, error: workspaceError } = await supabase
      .from("workspace_settings")
      .select("id")
      .eq("admin_id", invitation?.invited_by)
      .single();

    if (workspaceError) throw workspaceError;

    await supabase.from("workspace_members").insert({
      workspace_id: workspaceData?.id,
      user_id: user.id,
      role: invitation?.role,
      invited_by: invitation?.invited_by,
      status: "accepted",
    });
    await supabase?.from("invitations").update({token:""}).eq("email",email).eq("token",token)
    return { error: null };
  }
}
