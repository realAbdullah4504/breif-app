export const formatDeadlineTime = (timeString: string | undefined | null) => {
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
