interface UsernameValidationOptions {
  min?: number;
  max?: number;
  minMessage?: string;
  maxMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
}

interface EmailValidationOptions {
  pattern?: RegExp;
  message?: string;
}

interface UrlValidationOptions {
  allowEmpty?: boolean;
  message?: string;
}

interface PasswordValidationOptions {
  min?: number;
  max?: number;
  minMessage?: string;
  maxMessage?: string;
}

const usernameValidation = ({
  min = 3,
  max = 30,
  minMessage = `Username must be at least ${min} characters`,
  maxMessage = `Username must not exceed ${max} characters`,
  pattern = /^[a-zA-Z0-9_-]+$/,
  patternMessage = "Username can only contain letters, numbers, hyphens, and underscores",
}: UsernameValidationOptions = {}) => ({
  minLength: { value: min, message: minMessage },
  maxLength: { value: max, message: maxMessage },
  pattern: { value: pattern, message: patternMessage },
});

const emailValidation = ({
  pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message = "Invalid email format",
}: EmailValidationOptions = {}) => ({
  pattern: { value: pattern, message },
});

const urlValidation = ({
  allowEmpty = true,
  message = "URL must start with https://",
}: UrlValidationOptions = {}) => ({
  pattern: {
    value: allowEmpty ? /^(https:\/\/.+)?$/ : /^https:\/\/.+$/,
    message,
  },
});

const passwordValidation = ({
  min = 8,
  max = 16,
  minMessage = `Password must be at least ${min} characters`,
  maxMessage = `Password must not exceed ${max} characters`,
}: PasswordValidationOptions = {}) => ({
  minLength: { value: min, message: minMessage },
  maxLength: { value: max, message: maxMessage },
});

export {
  usernameValidation,
  emailValidation,
  urlValidation,
  passwordValidation,
};
