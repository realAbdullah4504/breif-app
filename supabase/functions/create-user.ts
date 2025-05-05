import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    const { email, name, role, phone } = await req.json();
    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);
    // Create auth user with admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name,
        role
      }
    });
    if (authError) {
      throw authError;
    }
    if (!authData.user) {
      throw new Error('User creation failed');
    }
    // Create user profile
    const { data: profile, error: profileError } = await supabase.from('users').insert([
      {
        id: authData.user.id,
        email,
        name,
        role,
        phone
      }
    ]).select().single();
    if (profileError) {
      throw profileError;
    }
    return new Response(JSON.stringify({
      profile,
      password: tempPassword
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error in create-user function:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
