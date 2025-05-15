export interface ReminderTemplate {
  subject: string;
  body: string;
}
export interface BriefQuestions {
  accomplishments: string;
  blockers: string;
  priorities: string;
  question4?: string;
  question5?: string;
}

export interface FormData {
  questions: BriefQuestions;
  submission_deadline: string;
  email_reminders: boolean;
}

export interface WorkspaceSettings {
  id: string;
  questions: BriefQuestions;
  submission_deadline: string;
  email_reminders: boolean;
  reminder_template: ReminderTemplate;
  admin_id:string;
  name:string;
  send_reminders_at:string;
  created_at: string;
  updated_at: string;
}