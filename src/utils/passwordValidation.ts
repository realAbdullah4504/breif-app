export const passwordValidation = {
    minLength: 8,
    requireNumbers: true,
    requireSpecialChars: true,
  };
  
  export const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
  
    if (password.length < passwordValidation.minLength) {
      errors.push(`Password must be at least ${passwordValidation.minLength} characters`);
    }
  
    if (passwordValidation.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  
    if (passwordValidation.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  
    return errors;
  };