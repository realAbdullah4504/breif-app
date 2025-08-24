export const formatDeadlineTime = (timeString: string | undefined | null, timezone?: string) => {
  if (!timeString) return new Date();
  try {
    // Parse time string in 24-hour format "18:00:00"
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    
    // If timezone is provided, adjust the time accordingly
    if (timezone && timezone !== 'America/New_York') {
      // Create a date in the specified timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      // Get current time in the specified timezone
      const timeInTimezone = formatter.format(new Date());
      const [tzHours, tzMinutes] = timeInTimezone.split(':').map(Number);
      
      // Calculate offset from Eastern Time
      const easternFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const easternTime = easternFormatter.format(new Date());
      const [etHours] = easternTime.split(':').map(Number);
      
      const offset = tzHours - etHours;
      const adjustedHours = (hours + offset + 24) % 24;
      date.setHours(adjustedHours, minutes, seconds);
    }
    
    return date;
  } catch (error) {
    console.error("Error parsing time:", error);
    return new Date();
  }
};
