// Validation helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Register validation
export const registerSchema = (data: any) => {
  const errors: string[] = [];
  const { body } = data;

  if (!body) {
    return { success: false, errors: ["Request body is required"] };
  }

  if (!body.email || typeof body.email !== "string") {
    errors.push("Email is required");
  } else if (!isValidEmail(body.email)) {
    errors.push("Invalid email format");
  }

  if (!body.password || typeof body.password !== "string") {
    errors.push("Password is required");
  } else if (body.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!body.firstName || typeof body.firstName !== "string" || body.firstName.trim().length === 0) {
    errors.push("First name is required");
  }

  if (!body.lastName || typeof body.lastName !== "string" || body.lastName.trim().length === 0) {
    errors.push("Last name is required");
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

// Login validation
export const loginSchema = (data: any) => {
  const errors: string[] = [];
  const { body } = data;

  if (!body) {
    return { success: false, errors: ["Request body is required"] };
  }

  if (!body.email || typeof body.email !== "string") {
    errors.push("Email is required");
  } else if (!isValidEmail(body.email)) {
    errors.push("Invalid email format");
  }

  if (!body.password || typeof body.password !== "string" || body.password.length === 0) {
    errors.push("Password is required");
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

// Refresh token validation
export const refreshTokenSchema = (data: any) => {
  const errors: string[] = [];
  const { body } = data;

  if (!body) {
    return { success: false, errors: ["Request body is required"] };
  }

  if (!body.refreshToken || typeof body.refreshToken !== "string" || body.refreshToken.trim().length === 0) {
    errors.push("Refresh token is required");
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

// Update user validation
export const updateUserSchema = (data: any) => {
  const errors: string[] = [];
  const { body, params } = data;

  if (!params || !params.id) {
    errors.push("User ID is required");
  } else if (!isValidMongoId(params.id)) {
    errors.push("Invalid user ID format");
  }

  if (body) {
    if (body.firstName !== undefined) {
      if (typeof body.firstName !== "string" || body.firstName.trim().length === 0) {
        errors.push("First name must be a non-empty string");
      }
    }

    if (body.lastName !== undefined) {
      if (typeof body.lastName !== "string" || body.lastName.trim().length === 0) {
        errors.push("Last name must be a non-empty string");
      }
    }

    if (body.email !== undefined) {
      if (typeof body.email !== "string") {
        errors.push("Email must be a string");
      } else if (!isValidEmail(body.email)) {
        errors.push("Invalid email format");
      }
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};
