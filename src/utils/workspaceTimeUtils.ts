/**
 * Workspace-level timezone utilities
 * All times are stored in UTC and displayed in workspace timezone
 */

export const DEFAULT_WORKSPACE_TIMEZONE = 'America/New_York';

/**
 * Convert UTC timestamp to workspace timezone for display
 */
export const convertUTCToWorkspaceTime = (
  utcTimestamp: string | Date,
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE
): Date => {
  try {
    const utcDate = typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp;
    
    // Create a new date in the workspace timezone
    const workspaceTime = new Date(utcDate.toLocaleString("en-US", { 
      timeZone: workspaceTimezone 
    }));
    
    return workspaceTime;
  } catch (error) {
    console.error('Error converting UTC to workspace time:', error);
    return new Date();
  }
};

/**
 * Format time for display in workspace timezone
 */
export const formatWorkspaceTime = (
  utcTimestamp: string | Date,
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  try {
    const utcDate = typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: workspaceTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(utcDate);
  } catch (error) {
    console.error('Error formatting workspace time:', error);
    return 'Invalid time';
  }
};

/**
 * Format date for display in workspace timezone
 */
export const formatWorkspaceDate = (
  utcTimestamp: string | Date,
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  try {
    const utcDate = typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: workspaceTimezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(utcDate);
  } catch (error) {
    console.error('Error formatting workspace date:', error);
    return 'Invalid date';
  }
};

/**
 * Format full datetime for display in workspace timezone
 */
export const formatWorkspaceDateTime = (
  utcTimestamp: string | Date,
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE
): string => {
  try {
    const utcDate = typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp;
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: workspaceTimezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(utcDate);
  } catch (error) {
    console.error('Error formatting workspace datetime:', error);
    return 'Invalid datetime';
  }
};

/**
 * Create deadline date in workspace timezone for today
 */
export const createWorkspaceDeadline = (
  deadlineTime: string, // "17:00:00"
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE
): Date => {
  try {
    const [hours, minutes, seconds = 0] = deadlineTime.split(':').map(Number);
    
    // Get today's date in workspace timezone
    const now = new Date();
    const todayInWorkspace = new Date(now.toLocaleString("en-US", { 
      timeZone: workspaceTimezone 
    }));
    
    // Set the deadline time
    todayInWorkspace.setHours(hours, minutes, seconds, 0);
    
    return todayInWorkspace;
  } catch (error) {
    console.error('Error creating workspace deadline:', error);
    const fallback = new Date();
    fallback.setHours(17, 0, 0, 0);
    return fallback;
  }
};

/**
 * Check if a submission is late based on workspace timezone
 */
export const isSubmissionLate = (
  submissionUTC: string | Date,
  deadlineTime: string, // "17:00:00"
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE
): boolean => {
  try {
    const submissionDate = typeof submissionUTC === 'string' ? new Date(submissionUTC) : submissionUTC;
    
    // Convert submission to workspace timezone
    const submissionInWorkspace = convertUTCToWorkspaceTime(submissionDate, workspaceTimezone);
    
    // Create deadline for the submission date in workspace timezone
    const submissionDay = new Date(submissionInWorkspace);
    const [hours, minutes, seconds = 0] = deadlineTime.split(':').map(Number);
    submissionDay.setHours(hours, minutes, seconds, 0);
    
    return submissionInWorkspace > submissionDay;
  } catch (error) {
    console.error('Error checking if submission is late:', error);
    return false;
  }
};

/**
 * Get timezone abbreviation for display
 */
export const getWorkspaceTimezoneAbbr = (workspaceTimezone: string): string => {
  const abbreviations: Record<string, string> = {
    'America/New_York': 'ET',
    'America/Chicago': 'CT',
    'America/Denver': 'MT',
    'America/Los_Angeles': 'PT',
    'America/Phoenix': 'MST',
    'America/Anchorage': 'AKST',
    'Pacific/Honolulu': 'HST',
    'UTC': 'UTC',
    'Europe/London': 'GMT',
    'Europe/Paris': 'CET',
    'Asia/Tokyo': 'JST',
    'Australia/Sydney': 'AEST'
  };
  
  return abbreviations[workspaceTimezone] || workspaceTimezone.split('/')[1]?.replace('_', ' ') || 'Local';
};

/**
 * Get current time in workspace timezone
 */
export const getCurrentWorkspaceTime = (
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE
): Date => {
  return convertUTCToWorkspaceTime(new Date(), workspaceTimezone);
};

/**
 * Check if current time is past deadline in workspace timezone
 */
export const isPastDeadline = (
  deadlineTime: string, // "17:00:00"
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE
): boolean => {
  try {
    const now = getCurrentWorkspaceTime(workspaceTimezone);
    const deadline = createWorkspaceDeadline(deadlineTime, workspaceTimezone);
    
    return now > deadline;
  } catch (error) {
    console.error('Error checking if past deadline:', error);
    return false;
  }
};

/**
 * Get time until deadline in workspace timezone
 */
export const getTimeUntilDeadline = (
  deadlineTime: string, // "17:00:00"
  workspaceTimezone: string = DEFAULT_WORKSPACE_TIMEZONE
): string => {
  try {
    const now = getCurrentWorkspaceTime(workspaceTimezone);
    const deadline = createWorkspaceDeadline(deadlineTime, workspaceTimezone);
    
    const diffMs = deadline.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Deadline passed';
    }
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  } catch (error) {
    console.error('Error calculating time until deadline:', error);
    return 'Unknown';
  }
};