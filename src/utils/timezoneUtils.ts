// Utility functions for timezone handling

export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Error getting user timezone:', error);
    return 'America/New_York'; // fallback
  }
};

export const convertDeadlineToUserTimezone = (
  deadlineTime: string, // "17:00:00"
  workspaceTimezone: string, // "America/New_York"
  userTimezone?: string // User's preferred timezone or browser timezone
): { time: string; timezone: string } => {
  try {
    const targetTimezone = userTimezone || getUserTimezone();
    
    // Parse the deadline time
    const [hours, minutes] = deadlineTime.split(':').map(Number);
    
    // Create a date object for today with the deadline time in workspace timezone
    const today = new Date();
    const workspaceDate = new Date(today.toLocaleString("en-US", { timeZone: workspaceTimezone }));
    workspaceDate.setHours(hours, minutes, 0, 0);
    
    // Get the UTC time for this deadline
    const utcTime = new Date(workspaceDate.getTime() + (workspaceDate.getTimezoneOffset() * 60000));
    
    // Convert to user's timezone
    const userTime = new Date(utcTime.toLocaleString("en-US", { timeZone: targetTimezone }));
    
    // Format the time for display
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const formattedTime = formatter.format(userTime);
    
    // Get timezone abbreviation
    const timezoneAbbr = getTimezoneAbbreviation(targetTimezone);
    
    return {
      time: formattedTime,
      timezone: timezoneAbbr
    };
  } catch (error) {
    console.error('Error converting deadline timezone:', error);
    return {
      time: '5:00 PM',
      timezone: 'ET'
    };
  }
};

export const getTimezoneAbbreviation = (timezone: string): string => {
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
  
  return abbreviations[timezone] || timezone.split('/')[1]?.replace('_', ' ') || 'Local';
};

export const createDeadlineDate = (
  deadlineTime: string, // "17:00:00"
  workspaceTimezone: string,
  userTimezone?: string
): Date => {
  try {
    const targetTimezone = userTimezone || getUserTimezone();
    const [hours, minutes] = deadlineTime.split(':').map(Number);
    
    // Create deadline in workspace timezone
    const today = new Date();
    const workspaceFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: workspaceTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const todayInWorkspace = workspaceFormatter.format(today);
    const deadlineInWorkspace = new Date(`${todayInWorkspace}T${deadlineTime}`);
    
    // Convert to user's timezone
    const deadlineInUserTz = new Date(deadlineInWorkspace.toLocaleString("en-US", { timeZone: targetTimezone }));
    
    return deadlineInUserTz;
  } catch (error) {
    console.error('Error creating deadline date:', error);
    const fallback = new Date();
    fallback.setHours(17, 0, 0, 0);
    return fallback;
  }
};