import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
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
    const { email, name, role, phone, organizationName, password } = await req.json();
    // Generate a random password
    const tempPassword = password || Math.random().toString(36).slice(-8);
    // Create auth user with admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name,
        role,
        invited_by: null
      }
    });
    if (authError) {
      throw authError;
    }
    if (!authData.user) {
      throw new Error('User creation failed');
    }
    
    // Create workspace settings for admin users
    let workspaceId = null;
    if (role === 'admin') {
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspace_settings')
        .insert({
          admin_id: authData.user.id,
          name: organizationName || 'My Team Workspace',
          questions: {
            accomplishments: "What have you worked on today?",
            blockers: "Any blockers or challenges you would like to share?",
            priorities: "What are your priorities for tomorrow?"
          },
          submission_deadline: "17:00:00",
          send_reminders_at: "16:00:00",
          email_reminders: true,
          reminder_template: {
            subject: "Reminder: Submit your daily brief!",
            body: "Hi {{name}},\n\nThis is a friendly reminder to submit your daily brief for today. The deadline is {{deadline}}.\n\nIt only takes a minute!\n\n<a href=\"{{dashboardUrl}}\" style=\"display: inline-block; background: linear-gradient(135deg, #6366f1, #d946ef); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0;\">📝 Submit Your Brief</a>\n\nBest regards,\nThe Briefly Team\n\n---\nPowered by Briefly • https://my.brieflyapp.co"
          },
          send_on_weekdays: [1, 2, 3, 4, 5],
          timezone: "America/New_York"
        })
        .select('id')
        .single();
      
      if (workspaceError) {
        throw workspaceError;
      }
      
      workspaceId = workspaceData.id;
    }
    
    
    // Create workspace settings if user is admin
    let workspace_id = null;
    if (role === 'admin') {
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspace_settings')
        .insert([{
          admin_id: authData.user.id,
          name: organizationName || 'My Team Workspace'
        }])
        .select()
        .single();
        
      if (workspaceError) {
        console.error('Error creating workspace settings:', workspaceError);
        // Continue without workspace_id if creation fails
      } else {
        workspace_id = workspaceData.id;
      }
    }
    
    // Create user profile
    const { data: profile, error: profileError } = await supabase.from('users').insert([
      {
        id: authData.user.id,
        email,
        name,
        role,
        phone,
        workspace_id
      }
    ]).select().single();
    if (profileError) {
      throw profileError;
    }
    return new Response(JSON.stringify({
      profile,
      password: password ? undefined : tempPassword
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
}
)