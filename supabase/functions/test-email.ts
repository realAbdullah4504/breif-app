import { Resend } from 'npm:resend@3.2.0';
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
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const payload = await req.json();
    const { to } = payload;
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error('Invalid email address');
    }
    // Send a test email
    const { data, error } = await resend.emails.send({
      from: 'Briefly <zindy@telehunt.co>',
      to,
      subject: 'Test Email from Briefly',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a56db; margin-bottom: 24px;">Test Email</h2>
          <p style="color: #374151; margin-bottom: 16px;">
            This is a test email from your Briefly application.
          </p>
          <p style="color: #374151; margin-bottom: 24px;">
            If you're receiving this, email functionality is working correctly!
          </p>
          <p style="color: #374151;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    });
    if (error) {
      throw error;
    }
    return new Response(JSON.stringify({
      message: 'Test email sent successfully',
      id: data?.id
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to send test email',
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
