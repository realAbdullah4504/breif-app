import { Brief } from '../services/briefService';

export const checkBriefSubmissionEligibility = (
  briefs: Brief[],
  deadline: string
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

  // Check if past deadline
  const now = new Date();
  const [deadlineHours, deadlineMinutes] = deadline.split(':').map(Number);
  const deadlineTime = new Date(now);
  deadlineTime.setHours(deadlineHours, deadlineMinutes, 0, 0);

  if (now > deadlineTime) {
    return {
      canSubmit: false,
      message: "Today's submission deadline has passed"
    };
  }

  return {
    canSubmit: true,
    message: ""
  };
};