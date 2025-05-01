export interface SendEmailParams {
    to: string;
    subject: string;
    html?: string;
    text?: string;
}

export interface SendEmailResponse {
    success: boolean;
    message?: string;
}