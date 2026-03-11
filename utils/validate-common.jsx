export const textMinLength3Rule = (fieldName = 'Text') => ({
  required: `${fieldName} is required`,
  minLength: {
    value: 3,
    message: `${fieldName} must be at least 3 characters`,
  },
  validate: (value) => {
    if (!value.trim()) return 'Spaces are not allowed';
    if (/^\d+$/.test(value.trim())) return 'Numbers are not allowed';
    return true;
  },
});

const isNumericPhone = (value) => {
  if (!value) return true;
  return /^\d+$/.test(value) || 'Phone number must contain only numbers';
};

const isTenDigitPhone = (value) => {
  if (!value) return true;
  return value.length === 10 || 'Phone must be 10 digits';
};

export const requiredPhoneValidationRule = {
  required: 'Phone number is required',
  validate: {
    isNumericPhone,
    isTenDigitPhone,
  },
};

export const optionalPhoneValidationRule = {
  validate: {
    isNumericPhone,
    isTenDigitPhone,
  },
};

export const emailValidationRule = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format',
  },
};
