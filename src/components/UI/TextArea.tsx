import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'monday';
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  fullWidth = true,
  variant = 'default',
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const textareaClass = variant === 'monday' ? 'input-monday' : 'input';
  const errorClass = error ? 'input-error' : '';
  
  return (
    <div className={widthClass}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <textarea
          className={`${textareaClass} ${errorClass} ${widthClass} resize-none ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
};

export default TextArea;