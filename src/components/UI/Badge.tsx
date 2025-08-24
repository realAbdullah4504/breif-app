import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'monday-green' | 'monday-blue' | 'monday-purple' | 'monday-orange' | 'monday-red';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  children,
  className = '',
}) => {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    'monday-green': 'badge-monday-green',
    'monday-blue': 'badge-monday-blue',
    'monday-purple': 'badge-monday-purple',
    'monday-orange': 'badge-monday-orange',
    'monday-red': 'badge-monday-red',
  };

  return (
    <span
      className={`${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;