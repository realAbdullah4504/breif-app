import React from 'react';

interface WeekdaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  disabled?: boolean;
}

const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  selectedDays,
  onChange,
  disabled = false
}) => {
  const weekdays = [
    { value: 1, label: 'Mon', fullLabel: 'Monday' },
    { value: 2, label: 'Tue', fullLabel: 'Tuesday' },
    { value: 3, label: 'Wed', fullLabel: 'Wednesday' },
    { value: 4, label: 'Thu', fullLabel: 'Thursday' },
    { value: 5, label: 'Fri', fullLabel: 'Friday' },
    { value: 6, label: 'Sat', fullLabel: 'Saturday' },
    { value: 0, label: 'Sun', fullLabel: 'Sunday' }
  ];

  const toggleDay = (dayValue: number) => {
    if (disabled) return;
    
    const newSelectedDays = selectedDays.includes(dayValue)
      ? selectedDays.filter(day => day !== dayValue)
      : [...selectedDays, dayValue].sort((a, b) => {
          // Custom sort to maintain Monday-Sunday order
          const order = [1, 2, 3, 4, 5, 6, 0];
          return order.indexOf(a) - order.indexOf(b);
        });
    
    onChange(newSelectedDays);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Send reminders on
      </label>
      <div className="flex flex-wrap gap-2">
        {weekdays.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              disabled={disabled}
              className={`
                px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200
                ${isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
                ${disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:shadow-sm'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
              title={day.fullLabel}
            >
              {day.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        Select the days when automatic reminders should be sent to team members
      </p>
    </div>
  );
};

export default WeekdaySelector;