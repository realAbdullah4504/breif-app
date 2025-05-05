import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify admin status
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('role')
      .eq('id', adminId)
      .single();

    if (adminError || !adminData || adminData.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can delete invitations');
    }

    // Get invitation details before deletion
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('email, status')
      .eq('id', invitationId)
      .single();

    if (inviteError) throw inviteError;
    if (!invitation) throw new Error('Invitation not found');

    // Delete invitation
    const { error: deleteError } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId);

    if (deleteError) throw deleteError;

    // If invitation was pending, delete the auth user if exists
    if (invitation.status === 'pending') {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', invitation.email)
        .single();

      if (!userError && userData?.id) {
        const { error: authError } = await supabase.auth.admin.deleteUser(userData.id);
        if (authError) throw authError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation deleted successfully'
      }), 
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error deleting invitation:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to delete invitation',
        details: error.details || null
      }), 
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: error.status || 400
      }
    );
  }
});