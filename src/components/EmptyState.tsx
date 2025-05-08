const EmptyState: React.FC<{ 
    title: string; 
    message: string;
    icon?: React.ReactNode;
    isDarkMode?: boolean;
  }> = ({ title, message, icon, isDarkMode }) => (
    <div className={`flex flex-col items-center justify-center p-8 ${
      isDarkMode ? 'text-gray-300' : 'text-gray-500'
    }`}>
      <div className={`rounded-full p-3 mb-4 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        {icon || <AlertTriangle className="h-6 w-6" />}
      </div>
      <h3 className={`text-lg font-medium mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      <p className="text-center text-sm">{message}</p>
    </div>
  );

  export default EmptyState;