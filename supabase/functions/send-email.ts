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
    // Get the request body
    const payload = await req.json();
    const { to, subject, html, text } = payload;
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error('Invalid email address');
    }
    // Validate required fields
    if (!to || !subject || !html && !text) {
      throw new Error('Missing required fields');
    }
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Briefly <zindy@telehunt.co>',
      to,
      subject,
      html: html || undefined,
      text: text || undefined
    });
    if (error) {
      throw error;
    }
    return new Response(JSON.stringify({
      message: 'Email sent successfully',
      id: data?.id
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to send email',
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
