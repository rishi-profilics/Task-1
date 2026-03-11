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
  if (/^\d+$/.test(value)){
    return true;
  } 
  return 'Phone number must contain only numbers';
};

const isTenDigitPhone = (value) => {
  if (value.length !== 10){
    return 'Phone must be 10 digits';
  }
  return true;
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
