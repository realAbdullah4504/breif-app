import { WorkspaceSettings } from "../types/settingTypes";

export const defaultSettings:Partial<WorkspaceSettings> = {
  name:"My Team Workspace",
  timezone: "America/New_York",
  questions: {
    blockers: "Any blockers or challenges you would like to share?",
    priorities: "What are your priorities for tomorrow?",
    accomplishments: "What have you worked on today?",
  },
  submission_deadline: "17:00:00",
  send_reminders_at:"16:00:00",
  email_reminders: true,
  reminder_template: {
    subject: "Reminder: Submit your daily brief!",
    body: `Hi {{name}},\n\nThis is a friendly reminder to submit your daily brief for today. The deadline is {{deadline}}.\n\nIt only takes a minute!\n\n<a href="{{dashboardUrl}}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #d946ef); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0;">📝 Submit Your Brief</a>\n\nBest regards,\nThe Briefly Team\n\n---\nPowered by Briefly • https://my.brieflyapp.co`,
  },
};
