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
    const { email, role, adminId } = await req.json();
    if (!email || !adminId || !role) {
      throw new Error('Missing required fields');
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Verify admin status
    const { data: adminData, error: adminError } = await supabase.from('users').select('name, role').eq('id', adminId).single();
    if (adminError || !adminData || adminData.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can send invites');
    }
    // Check if user already exists
    const { data: existingUser, error: userError } = await supabase.from('users').select('id, email').eq('email', email).single();
    if (existingUser) {
      throw new Error('User already exists');
    }
    // Create invitation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const { error: insertError } = await supabase.from('invitations').insert({
      email,
      role,
      invited_by: adminId,
      status: 'pending',
      expires_at: expiresAt.toISOString()
    });
    if (insertError) throw insertError;
    // Send invitation email
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        role,
        invited_by: adminId
      },
      redirectTo: `${Deno.env.get('SITE_URL')}/auth/set-password`
    });
    if (inviteError) throw inviteError;
    return new Response(JSON.stringify({
      success: true,
      message: 'Invitation sent successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to send invitation',
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
