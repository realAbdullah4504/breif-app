import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
Deno.serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { invitationId, adminId } = await req.json();
    if (!invitationId || !adminId) {
      throw new Error('Missing required fields');
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Verify admin status
    const { data: adminData, error: adminError } = await supabase.from('users').select('role').eq('id', adminId).single();
    if (adminError || !adminData || adminData.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can delete invitations');
    }
    // Get invitation details before deletion
    const { data: invitation, error: inviteError } = await supabase.from('invitations').select('email, status').eq('id', invitationId).single();
    if (inviteError) throw inviteError;
    if (!invitation) throw new Error('Invitation not found');
    const { data: authData, error: authUserError } = await supabase.auth.admin.listUsers();
    if (authUserError) throw authUserError;
    const authUser = authData.users.find((user)=>user.email === invitation.email);
    // Delete from auth if user exists
    if (authUser) {
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(authUser.id);
      if (deleteAuthError) throw deleteAuthError;
    }
    // Delete invitation
    const { error: deleteError } = await supabase.from('invitations').delete().eq('id', invitationId);
    if (deleteError) throw deleteError;
    return new Response(JSON.stringify({
      success: true,
      message: 'Member deleted successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to delete invitation',
      details: error.details || null
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: error.status || 400
    });
  }
});
