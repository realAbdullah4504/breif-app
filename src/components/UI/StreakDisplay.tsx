import React from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  size?: 'sm' | 'md' | 'lg';
  showLongest?: boolean;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  size = 'md',
  showLongest = true,
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-3',
      icon: 'h-4 w-4',
      number: 'text-lg',
      label: 'text-xs',
    },
    md: {
      container: 'p-4',
      icon: 'h-5 w-5',
      number: 'text-2xl',
      label: 'text-sm',
    },
    lg: {
      container: 'p-6',
      icon: 'h-6 w-6',
      number: 'text-3xl',
      label: 'text-base',
    },
  };

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-400';
    if (streak < 7) return 'text-orange-500';
    if (streak < 30) return 'text-red-500';
    return 'text-purple-500';
  };

  const getStreakBg = (streak: number) => {
    if (streak === 0) return 'bg-gray-50';
    if (streak < 7) return 'bg-orange-50';
    if (streak < 30) return 'bg-red-50';
    return 'bg-purple-50';
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex gap-4">
      {/* Current Streak */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${classes.container} ${getStreakBg(currentStreak)} rounded-xl border border-gray-200 flex-1`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Flame className={`${classes.icon} ${getStreakColor(currentStreak)} mr-2`} />
            <span className={`${classes.label} font-medium text-gray-600`}>
              Current Streak
            </span>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className={`${classes.number} font-bold ${getStreakColor(currentStreak)}`}>
            {currentStreak}
          </span>
          <span className={`${classes.label} text-gray-500 ml-1`}>
            {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
        {currentStreak > 0 && (
          <div className={`${classes.label} text-gray-500 mt-1`}>
            Keep it up! 🔥
          </div>
        )}
      </motion.div>

      {/* Longest Streak */}
      {showLongest && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`${classes.container} bg-secondary-50 rounded-xl border border-gray-200 flex-1`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Trophy className={`${classes.icon} text-secondary-600 mr-2`} />
              <span className={`${classes.label} font-medium text-gray-600`}>
                Best Streak
              </span>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className={`${classes.number} font-bold text-secondary-600`}>
              {longestStreak}
            </span>
            <span className={`${classes.label} text-gray-500 ml-1`}>
              {longestStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          {longestStreak > 0 && (
            <div className={`${classes.label} text-gray-500 mt-1`}>
              Personal record! 🏆
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StreakDisplay;