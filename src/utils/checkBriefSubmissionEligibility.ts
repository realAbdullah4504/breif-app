import { Brief } from "../types/briefTypes";
import { DEFAULT_WORKSPACE_TIMEZONE } from "./workspaceTimeUtils";

export const checkBriefSubmissionEligibility = (
  briefs: Brief[],
  deadline: string,
  workspaceTimezone?: string,
): { canSubmit: boolean; message: string } => {
  // Check if already submitted today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const hasSubmittedToday = briefs.some(brief => {
    const briefDate = new Date(brief.submitted_at);
    briefDate.setHours(0, 0, 0, 0);
    return briefDate.getTime() === today.getTime();
  });

  if (hasSubmittedToday) {
    return {
      canSubmit: false,
      message: "You've already submitted your brief for today"
    };
  }

  // Check if past deadline (simple time comparison without timezone conversion)
  const now = new Date();
  const [hours, minutes] = deadline.split(':').map(Number);
  const deadlineTime = new Date();
  deadlineTime.setHours(hours, minutes, 0, 0);

  if (now > deadlineTime) {
    return {
      canSubmit: true,
      message: "Today's submission deadline has passed but you can still submit your brief."
    };
  }

  return {
    canSubmit: true,
    message: ""
  };
};