import React, { useState } from 'react'
import Button from '../../UI/Button'
import { useEmail } from '../../../hooks/useEmail';
import { WorkspaceSettings } from '../../../types/settingTypes';
import { TeamMember } from '../../../types/briefTypes';
import { formatWorkspaceTime, getWorkspaceTimezoneAbbr, DEFAULT_WORKSPACE_TIMEZONE } from '../../../utils/workspaceTimeUtils';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

type ReminderButtonProps = {
    member: TeamMember;
    teamMembers: TeamMember[];
    settings: Partial<WorkspaceSettings>;
}

const ReminderButton = ({ member, teamMembers, settings }: ReminderButtonProps) => {
    const { sendEmail, isLoading: isSendingEmail } = useEmail();
    const [reminderSent, setReminderSent] = useState<Record<string, boolean>>({});
    const formatDeadlineForEmail = () => {
      if (!settings?.submission_deadline) return "5:00 PM ET";
      
      try {
        const workspaceTimezone = settings?.timezone || DEFAULT_WORKSPACE_TIMEZONE;
        const time = formatWorkspaceTime(
          new Date(`2000-01-01T${settings.submission_deadline}`),
          workspaceTimezone
        );
        const timezoneAbbr = getWorkspaceTimezoneAbbr(workspaceTimezone);
        
        return `${time} ${timezoneAbbr}`;
      } catch (error) {
        return "5:00 PM ET";
      }
    };

    const handleSendReminder = (userId: string) => {
        // Don't send reminders to demo users
        if (userId.startsWith('demo-')) {
            toast.error("This is demo data. Invite real team members to send reminders!");
            return;
        }

        const member = teamMembers.find((m) => m.id === userId);
        if (!member) return;

        sendEmail(
            {
                to: member.email,
                subject:
                    settings?.reminder_template?.subject || "Reminder: Brief Submission",
                html:
                    settings?.reminder_template?.body
                        .replace("{{name}}", member.name)
                        .replace("{{deadline}}", formatDeadlineForEmail())
                        .replace("{{organizationName}}", settings?.name || "Your Organization")
                        .replace("{{dashboardUrl}}", "https://my.brieflyapp.co/dashboard")
                        .replace(/\n/g, "<br>") ||
                    "Please submit your brief.",
            },
            {
                onSuccess: () => {
                    setReminderSent((prev) => ({ ...prev, [userId]: true }));
                    toast.success(`Reminder sent to ${member.name}`);
                },
                onError: (error) => {
                    console.error("Error sending reminder:", error);
                    toast.error(`Failed to send reminder to ${member.name}`);
                },
            }
        );
    };
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendReminder(member?.id)}
            disabled={reminderSent[member?.id]}
            isLoading={isSendingEmail}
        >
            <Bell className="h-4 w-4 mr-1" />
            {reminderSent[member?.id] ? "Sent" : "Remind"}
        </Button>
    )
}

export default ReminderButton