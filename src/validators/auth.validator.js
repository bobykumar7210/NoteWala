const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates login input
 * @param {{ username?: string, password?: string }} data
 * @returns {Record<string, string>} Validation errors (empty if valid)
 */
export function validateLogin(data = {}) {
  const errors = {};

  if (!data.username?.trim()) {
    errors.username = "Username is required";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

/**
 * Validates registration input
 * @param {{ name?: string, email?: string, password?: string, confirmPassword?: string, terms?: boolean }} data
 * @returns {Record<string, string>} Validation errors (empty if valid)
 */
export function validateRegister(data = {}) {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = "Username is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "Username must be at least 3 characters";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!data.terms) {
    errors.terms = "You must accept the terms";
  }

  return errors;
}
