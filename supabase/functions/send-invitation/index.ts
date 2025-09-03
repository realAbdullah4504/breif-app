import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@3.2.0';
// Helper to generate secure random token
function generateToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b)=>b.toString(16).padStart(2, '0')).join('');
}
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Parse request body
    const { email, role, adminId } = await req.json();
    if (!email || !adminId || !role) {
      throw new Error('Missing required fields: email, role, and adminId are required');
    }
    // Validate email format
    if (!email.includes('@') || email.length > 255) {
      throw new Error('Invalid email format');
    }
    // Initialize Supabase client
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Verify admin
    const { data: adminData, error: adminError } = await supabase.from('users').select('name, role').eq('id', adminId).single();
    if (adminError || !adminData || adminData.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can send invites');
    }
    // Get workspace for admin
    const { data: workspaceData, error: workspaceError } = await supabase.from('workspace_settings').select('id').eq('admin_id', adminId).single();
    if (workspaceError || !workspaceData) {
      throw new Error('Workspace not found for admin');
    }
    // Generate token and expiry
    const token = generateToken(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const { data: adminUsers, adminUsersError } = await supabase.from("users").select("*").eq("role", "admin");
    const isExistAdmin = adminUsers.find((user)=>user.email === email);
    if (isExistAdmin) {
      throw new Error(`the Admin user already exists ${isExistAdmin.email}`);
    }
    // Insert invitation
    const { error: insertError } = await supabase.from('invitations').insert({
      email,
      role,
      invited_by: adminId,
      status: 'pending',
      workspace_id: workspaceData.id,
      token,
      expires_at: expiresAt.toISOString()
    });
    if (insertError) {
      throw new Error(`Failed to insert invitation: ${insertError.message}`);
    }
    // Check if user already exists in auth
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Error fetching users: ${listError.message}`);
    }
    const existingAuthUser = userList.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    console.log(existingAuthUser, 'existing');
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    // Set the appropriate redirect URL based on user existence
    const redirectUrl = existingAuthUser 
      ? `http://localhost:5173/auth/accept-invite?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
      : `http://localhost:5173/auth/set-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

    const buttonText = existingAuthUser ? 'Accept Invitation' : 'Complete Registration';
    
    // Send custom email via Resend
    const { error: resendError } = await resend.emails.send({
      from: 'Briefly <zindy@telehunt.co>',
      to: email,
      subject: 'You have been invited',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a56db; margin-bottom: 24px;">You've been invited to join Briefly!</h2>
          <p style="color: #374151; margin-bottom: 16px;">
            ${adminData.name} has invited you to join Briefly as a ${role}.
          </p>
          <a href="${redirectUrl}"
            style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            ${buttonText}
          </a>
          <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">
            Or copy this link: ${redirectUrl}
          </p>
          <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">
            This invitation will expire in 7 days.
          </p>
        </div>
      `
    });
    
    if (resendError) {
      throw new Error(`Failed to send email: ${resendError.message}`);
    }
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
      status: 400
    });
  }
});
