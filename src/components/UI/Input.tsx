import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'monday';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  variant = 'default',
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const inputClass = variant === 'monday' ? 'input-monday' : 'input';
  const errorClass = error ? 'input-error' : '';
  
  return (
    <div className={widthClass}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <input
          className={`${inputClass} ${errorClass} ${widthClass} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
};

export default Input;