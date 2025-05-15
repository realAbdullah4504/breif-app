export const defaultSettings = {
  questions: {
    blockers: "Any blockers or challenges you would like to share?",
    priorities: "What are your priorities for tomorrow?",
    accomplishments: "What have you worked on today?",
  },
  submission_deadline: "17:00:00",
  email_reminders: true,
  reminder_template: {
    subject: "Reminder: Submit your daily brief!",
    body: `Hi {{name}},\n\nThis is a friendly reminder to submit your daily brief for today. the deadline is {{deadline}}\n\nIt only takes a minute!\n\nhttps://breifly-app.netlify.app/email-templates\n\nBest regards,\nTelehunt`,
  },
};
