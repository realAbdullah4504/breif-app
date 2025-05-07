import { useMutation } from '@tanstack/react-query';
import { sendEmail } from '../services/emailService';
import { SendEmailParams } from '../types/supabase';

export const useEmail = () => {
  const sendEmailMutation = useMutation({
    mutationFn: (params: SendEmailParams) => sendEmail(params),
  });

  return {
    sendEmail: sendEmailMutation.mutate,
    isLoading: sendEmailMutation.isPending,
    error: sendEmailMutation.error
  };
};