import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'monday';
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const baseClass = variant === 'monday' ? 'card-monday' : 'card';
  return (
    <div className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
};

export default Card;