export const generateTimeOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 || 12; // Convert 24h to 12h format (0 becomes 12)
    const ampm = i < 12 ? 'AM' : 'PM';
    const value = `${i.toString().padStart(2, '0')}:00:00`;
    const label = `${hour}:00 ${ampm}`;
    options.push({ value, label });
  }
  return options;
};