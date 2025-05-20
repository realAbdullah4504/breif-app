import React, { useState } from 'react'
import Button from '../../UI/Button'
import { useEmail } from '../../../hooks/useEmail';
import { WorkspaceSettings } from '../../../types/settingTypes';
import { TeamMember } from '../../../types/briefTypes';
import { format } from 'date-fns';
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

     const formatDeadlineTime = (timeString: string | undefined | null) => {
        if (!timeString) return new Date();
        try {
          // Parse time string in 24-hour format "18:00:00"
          const [hours, minutes, seconds] = timeString.split(":").map(Number);
          const date = new Date();
          date.setHours(hours, minutes, seconds);
          return date;
        } catch (error) {
          console.error("Error parsing time:", error);
          return new Date();
        }
      };
    
      // The rest of the deadline calculations remain the same
      const deadline =
        formatDeadlineTime(settings?.submission_deadline) || new Date();

    const handleSendReminder = (userId: string) => {
        const member = teamMembers.find((m) => m.id === userId);
        if (!member) return;

        sendEmail(
            {
                to: member.email,
                subject:
                    settings?.reminder_template?.subject || "Reminder: Brief Submission",
                html:
                    settings?.reminder_template?.body
                        ?.replace(/\n/g, "<br>") // Convert newlines to HTML line breaks
                        .replace("{{name}}", member.name)
                        .replace("{{deadline}}", format(deadline, "h:mm a")) || // Convert Date to string
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
