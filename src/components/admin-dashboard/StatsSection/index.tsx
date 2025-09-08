import React, { useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { format } from "date-fns";
import { Bell, CheckCircle, Clock, XCircle, Sparkles } from "lucide-react";
import {
  formatWorkspaceTime,
  getWorkspaceTimezoneAbbr,
  DEFAULT_WORKSPACE_TIMEZONE,
  getTimeUntilDeadline,
  createWorkspaceDeadline,
} from "../../../utils/workspaceTimeUtils";
import Button from "../../UI/Button";
import { useEmail } from "../../../hooks/useEmail";
import toast from "react-hot-toast";
import { useDashboardContext } from "../../../context/DashboardContext";
import { useAdminBriefs, useSampleData } from "../../../hooks/useAdminBriefs";
import { useWorkspaceContext } from "../../../context/WorkspaceContext";
import { useSettings } from "../../../hooks/useSettings";

const StatsSection = () => {
  const { filters } = useDashboardContext();
  const { selectedWorkspaceId } = useWorkspaceContext();
  const workspaceId = selectedWorkspaceId || "";
  const { settings } = useSettings(workspaceId);
  const { briefs, teamMembers, stats } = useAdminBriefs(filters);

  const totalBriefs = stats?.totalMembers || 0;
  const submittedBriefs = stats?.submittedCount || 0;
  const pendingBriefs = totalBriefs - submittedBriefs;
  const submissionRate =
    totalBriefs > 0 ? (submittedBriefs / totalBriefs) * 100 : 0;

  const workspaceTimezone = settings?.timezone || DEFAULT_WORKSPACE_TIMEZONE;
  const deadline = settings?.submission_deadline
    ? createWorkspaceDeadline(settings.submission_deadline, workspaceTimezone)
    : new Date();

  const timeUntilDeadline =
    settings?.submission_deadline && settings?.timezone
      ? getTimeUntilDeadline(settings.submission_deadline, workspaceTimezone)
      : "No deadline set";

  const { sendEmail, isLoading: isSendingEmail } = useEmail();
  const { deleteSampleData, isDeletingSampleData } = useSampleData();

  // Check if we're showing sample data
  const isShowingSampleData = teamMembers?.some((member) =>
    member?.user_id?.startsWith("demo-")
  );

  const handleSendAllReminders = () => {
    const pendingMembers = teamMembers?.filter(
      (member) =>
        !briefs.some((brief) => brief.user_id === member.user_id) &&
        !member.user_id?.startsWith("demo-")
    );

    // Don't send reminders to demo users
    if (
      pendingMembers?.length === 0 ||
      pendingMembers?.every((member) => member.user_id?.startsWith("demo-"))
    ) {
      toast.error(
        "No real team members to send reminders to. Invite team members first!"
      );
      return;
    }

    let currentIndex = 0;

    const sendNextReminder = () => {
      if (currentIndex >= pendingMembers?.length) {
        toast.success(
          `Finished sending reminders to ${pendingMembers?.length} members`
        );
        return;
      }

      const member = pendingMembers[currentIndex];

      sendEmail(
        {
          to: member.users.email,
          subject:
            settings?.reminder_template?.subject ||
            "⏰ Reminder: Submit your daily brief",
          html:
            settings?.reminder_template?.body
              ?.replace("{{name}}", member.users.name)
              .replace(
                "{{deadline}}",
                (() => {
                  if (!settings?.submission_deadline) return "5:00 PM ET";

                  try {
                    const workspaceTimezone =
                      settings?.timezone || DEFAULT_WORKSPACE_TIMEZONE;
                    const time = formatWorkspaceTime(
                      new Date(`2000-01-01T${settings.submission_deadline}`),
                      workspaceTimezone
                    );
                    const timezoneAbbr =
                      getWorkspaceTimezoneAbbr(workspaceTimezone);

                    return `${time} ${timezoneAbbr}`;
                  } catch (error) {
                    return "5:00 PM ET";
                  }
                })()
              )
              .replace(
                "{{organizationName}}",
                settings?.name || "Your Organization"
              )
              .replace("{{dashboardUrl}}", "https://my.brieflyapp.co/dashboard")
              .replace(/\n/g, "<br>") || "Please submit your brief.",
        },
        {
          onSuccess: () => {
            toast.success(`Reminder sent to ${member.users.name}`);
            currentIndex++;
            setTimeout(sendNextReminder, 500);
          },
          onError: (error) => {
            console.error("Error sending reminder:", error);
            toast.error(`Failed to send reminder to ${member.users.name}`);
            currentIndex++;
            setTimeout(sendNextReminder, 500);
          },
        }
      );
    };

    sendNextReminder();
  };

  const handleDeleteSampleData = () => {
    deleteSampleData();
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 sm:mb-8 lg:mb-10"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-monday rounded-3xl flex items-center justify-center shadow-monday mb-3 sm:mb-0 sm:mr-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Team Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Track daily submissions and team progress
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sample Data Notice */}
      {isShowingSampleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="card-monday p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-2xl mr-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Sample Data Preview
                </h3>
                <p className="text-sm text-gray-600">
                  This is example data to show how your dashboard will look.
                  Delete it when you're ready to invite your team.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSampleData}
              isLoading={isDeletingSampleData}
              className="whitespace-nowrap"
            >
              Delete Sample Data
            </Button>
          </div>
        </motion.div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Brief Submitted Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card-monday p-4 sm:p-6 lg:p-8 hover:shadow-monday-hover transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-success-500 to-success-600 opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 relative z-10">
            <div className="flex items-center">
              <div className="bg-success-50 p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-sm">
                <CheckCircle className="h-5 w-5 sm:h-7 sm:w-7 text-success-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  Briefs Submitted
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Successfully submitted today
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 relative z-10">
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-success-600 tracking-tight">
                <CountUp end={submittedBriefs} duration={1.5} />
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {submittedBriefs === totalBriefs
                  ? "All done!"
                  : "Great progress"}
              </p>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                {Math.round(submissionRate)}% complete
              </p>
              <div className="w-full sm:w-32 h-2 sm:h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full transition-all duration-1000"
                  style={{ width: `${submissionRate}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Deadline Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card-monday p-4 sm:p-6 lg:p-8 hover:shadow-monday-hover transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-secondary-500 to-secondary-600 opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 relative z-10">
            <div className="flex items-center">
              <div className="bg-secondary-50 p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-sm">
                <Clock className="h-5 w-5 sm:h-7 sm:w-7 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  Today's Deadline
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Submission deadline for today
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 relative z-10">
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-600 tracking-tight">
                {format(deadline, "h:mm a")}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {timeUntilDeadline} •{" "}
                {getWorkspaceTimezoneAbbr(
                  settings?.timezone || DEFAULT_WORKSPACE_TIMEZONE
                )}
              </p>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                {submittedBriefs} of {totalBriefs} submitted
              </p>
              <div className="w-full sm:w-32 h-2 sm:h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full transition-all duration-1000"
                  style={{ width: `${submissionRate}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="card-monday p-4 sm:p-6 lg:p-8 hover:shadow-monday-hover transition-all duration-300 relative overflow-hidden sm:col-span-2 lg:col-span-1"
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 ${
              pendingBriefs > 0
                ? "bg-gradient-to-br from-danger-500 to-danger-600"
                : "bg-gradient-to-br from-success-500 to-success-600"
            } opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16`}
          ></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 relative z-10">
            <div className="flex items-center">
              <div
                className={`${
                  pendingBriefs > 0 ? "bg-danger-50" : "bg-success-50"
                } p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-sm`}
              >
                {pendingBriefs > 0 ? (
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-danger-600" />
                ) : (
                  <CheckCircle className="h-5 w-5 sm:h-7 sm:w-7 text-success-600" />
                )}
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  Pending Submissions
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {pendingBriefs === 0
                    ? "All briefs submitted!"
                    : `${pendingBriefs} ${
                        pendingBriefs === 1
                          ? "member hasn't"
                          : "members haven't"
                      } submitted`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 relative z-10">
            <div>
              <p
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
                  pendingBriefs > 0 ? "text-danger-600" : "text-success-600"
                }`}
              >
                <CountUp end={pendingBriefs} duration={1.5} />
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {pendingBriefs === 0 ? "Great job!" : "Need reminders"}
              </p>
            </div>
            {pendingBriefs > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendAllReminders}
                disabled={isSendingEmail}
                isLoading={isSendingEmail}
                className="flex items-center w-full sm:w-auto"
                icon={<Bell className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">Send Reminders</span>
                <span className="sm:hidden">Send</span>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsSection;
