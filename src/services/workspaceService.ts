import { supabase } from "../lib/supabase";

export class WorkspaceService {
  async getAllWorkspaces(user_id: string) {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("*,workspace_settings(name, id, admin_id)")
      .eq("user_id", user_id);

    const workspaces = data?.map((workspace) => ({
      name: workspace.workspace_settings.name,
      id: workspace.workspace_settings.id,
      admin_id: workspace.workspace_settings.admin_id,
    }));
    if (error) {
      console.error("Error fetching workspaces:", error);
    } else {
      console.log("Workspaces fetched:", workspaces);
    }
    return { data: workspaces || [], error: null };
  }
  async acceptInvitation(token: string, email: string) {
    const { data: invitation, error: inviteError } = await supabase
      .from("invitations")
      .update({ status: "accepted" })
      .eq("email", email)
      .eq("token", token)
      .select("invited_by, role, workspace_id")
      .single();

    if (inviteError) throw inviteError;
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    await supabase.from("workspace_members").insert({
      workspace_id: invitation?.workspace_id,
      user_id: user.id,
      role: invitation?.role,
      invited_by: invitation?.invited_by,
      status: "accepted",
    });
    await supabase
      ?.from("invitations")
      .update({ token: "" })
      .eq("email", email)
      .eq("token", token);
    return { error: null };
  }
}
