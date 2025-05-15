export const UserAvatar: React.FC<{
  src?: string;
  name: string;
  size?: string;
  className?: string;
}> = ({ src, name, size = "h-16 w-16", className = "" }) => {
  // Generate a consistent color based on the name
  const getInitialAndColor = () => {
    const initial = name.charAt(0).toUpperCase();
    
    // Generate a consistent color hash based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert hash to a hue value (0-360)
    const hue = hash % 360;
    // Use a fixed saturation and lightness for good contrast
    return { initial, color: `hsl(${hue}, 70%, 30%)` };
  };

  const { initial, color } = getInitialAndColor();

  if (src) {
    return (
      <img
        className={`${size} rounded-full object-cover ${className}`}
        src={src}
        alt={name}
        onError={(e) => {
          // If image fails to load, set src to empty to trigger fallback
          e.currentTarget.onerror = null;
          e.currentTarget.src = "";
        }}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-white font-medium ${className}`}
      style={{ backgroundColor: color }}
    >
      <span className="text-xl">{initial}</span>
    </div>
  );
};
