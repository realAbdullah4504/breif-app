import React, { useState } from 'react'
import { motion } from "framer-motion";
import CountUp from 'react-countup';
import { Bell, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../../UI/Button';
import { useEmail } from '../../../hooks/useEmail';
import toast from 'react-hot-toast';
import { useDashboardContext } from '../../../context/DashboardContext';

type StatsProps = {
    isDarkMode: boolean;
}

const StatsSection = ({ isDarkMode }: StatsProps) => {
    const { settings, teamMembers, briefs, stats } = useDashboardContext();
    const { totalBriefs, submittedBriefs, submissionRate, pendingBriefs, deadline, timeUntilDeadline } = stats;
    const { sendEmail, isLoading: isSendingEmail } = useEmail();
    const [reminderSent, setReminderSent] = useState<Record<string, boolean>>({});

    const handleSendAllReminders = () => {
        const pendingMembers = teamMembers.filter(
            (member) => !briefs.some((brief) => brief.user_id === member.id)
        );

        // Send reminders sequentially with delay
        let currentIndex = 0;

        const sendNextReminder = () => {
            if (currentIndex >= pendingMembers.length) {
                toast.success(
                    `Finished sending reminders to ${pendingMembers.length} members`
                );
                return;
            }

            const member = pendingMembers[currentIndex];

            sendEmail(
                {
                    to: member.email,
                    subject:
                        settings?.reminder_template?.subject ||
                        "Reminder: Brief Submission",
                    html:
                        settings?.reminder_template?.body
                            ?.replace(/\n/g, "<br>") // Convert newlines to HTML line breaks
                            .replace("{{name}}", member.name)
                            .replace("{{deadline}}", format(deadline, "h:mm a")) || // Convert Date to string
                        "Please submit your brief.",
                },
                {
                    onSuccess: () => {
                        setReminderSent((prev) => ({ ...prev, [member.id]: true }));
                        toast.success(`Reminder sent to ${member.name}`);
                        currentIndex++;
                        // Add 500ms delay before sending next reminder (2 requests/second limit)
                        setTimeout(sendNextReminder, 500);
                    },
                    onError: (error) => {
                        console.error("Error sending reminder:", error);
                        toast.error(`Failed to send reminder to ${member.name}`);
                        currentIndex++;
                        // Continue with next reminder after error
                        setTimeout(sendNextReminder, 500);
                    },
                }
            );
        };

        // Start sending reminders
        sendNextReminder();
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg shadow-md p-6`}
            >
                <div className="flex items-center justify-between">
                    <h3
                        className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Submission Rate
                    </h3>
                    <div
                        className={`h-10 w-10 rounded-full ${isDarkMode ? "bg-blue-900" : "bg-blue-100"
                            } flex items-center justify-center`}
                    >
                        <CheckCircle
                            className={`h-5 w-5 ${isDarkMode ? "text-blue-300" : "text-blue-600"
                                }`}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                        >
                            <CountUp end={submittedBriefs} duration={1.5} /> of{" "}
                            {totalBriefs} briefs submitted
                        </span>
                        <span
                            className={`text-sm font-medium ${isDarkMode ? "text-blue-300" : "text-blue-600"
                                }`}
                        >
                            <CountUp
                                end={submissionRate}
                                duration={1.5}
                                decimals={0}
                                suffix="%"
                            />
                        </span>
                    </div>
                    <div
                        className={`w-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } rounded-full overflow-hidden`}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${submissionRate}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-blue-600 rounded-full"
                        ></motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg shadow-md p-6`}
            >
                <div className="flex items-center justify-between">
                    <h3
                        className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Pending Briefs
                    </h3>
                    <div
                        className={`h-10 w-10 rounded-full ${pendingBriefs > 0
                            ? isDarkMode
                                ? "bg-red-900"
                                : "bg-red-100"
                            : isDarkMode
                                ? "bg-green-900"
                                : "bg-green-100"
                            } flex items-center justify-center`}
                    >
                        {pendingBriefs > 0 ? (
                            <XCircle
                                className={`h-5 w-5 ${isDarkMode ? "text-red-300" : "text-red-600"
                                    }`}
                            />
                        ) : (
                            <CheckCircle
                                className={`h-5 w-5 ${isDarkMode ? "text-green-300" : "text-green-600"
                                    }`}
                            />
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <p
                        className={`text-2xl font-bold ${pendingBriefs > 0
                            ? isDarkMode
                                ? "text-red-300"
                                : "text-red-600"
                            : isDarkMode
                                ? "text-green-300"
                                : "text-green-600"
                            }`}
                    >
                        <CountUp end={pendingBriefs} duration={1.5} />
                    </p>
                    <p
                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"
                            }`}
                    >
                        {pendingBriefs === 0
                            ? "All briefs submitted!"
                            : pendingBriefs === 1
                                ? "team member hasn't submitted"
                                : "team members haven't submitted"}
                    </p>
                    {pendingBriefs > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={handleSendAllReminders}
                            disabled={isSendingEmail}
                            isLoading={isSendingEmail}
                        >
                            <Bell className="h-4 w-4 mr-1" />
                            Send All Reminders
                        </Button>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg shadow-md p-6`}
            >
                <div className="flex items-center justify-between">
                    <h3
                        className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Submission Deadline
                    </h3>
                    <div
                        className={`h-10 w-10 rounded-full ${isDarkMode ? "bg-purple-900" : "bg-purple-100"
                            } flex items-center justify-center`}
                    >
                        <Clock
                            className={`h-5 w-5 ${isDarkMode ? "text-purple-300" : "text-purple-600"
                                }`}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <p
                        className={`text-2xl font-bold ${isDarkMode ? "text-purple-300" : "text-purple-600"
                            }`}
                    >
                        {format(deadline, "h:mm a")}
                    </p>
                    <p
                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"
                            }`}
                    >
                        {timeUntilDeadline}
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default StatsSection
