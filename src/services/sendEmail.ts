import { supabase } from '../lib/supabase';
import { SendEmailParams, SendEmailResponse } from '../types/supabase';

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
    const { data, error } = await supabase.functions.invoke<SendEmailResponse>('send-email', {
        body: params,
    });

    if (error) {
        throw new Error(error.message || 'Failed to send email');
    }

    return data!;
}
