// Validation helper functions
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

const isValidGender = (gender: string): boolean => {
  return ['male', 'female', 'other'].includes(gender);
};

const isValidMaritalStatus = (status: string): boolean => {
  return ['single', 'married', 'divorced', 'widowed'].includes(status);
};

const isValidStatus = (status: string): boolean => {
  return ['active', 'inactive', 'terminated'].includes(status);
};

const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidContactType = (type: string): boolean => {
  return ['primary', 'secondary', 'emergency'].includes(type);
};

const isValidDocumentType = (type: string): boolean => {
  return ['passport', 'certificate', 'work_pass', 'qualification', 'other'].includes(type);
};

// Create employee validation
export const createEmployeeSchema = (data: any) => {
  const errors: string[] = [];
  const { body } = data;

  if (!body) {
    return { success: false, errors: ['Request body is required'] };
  }

  if (!body.first_name || typeof body.first_name !== 'string' || body.first_name.trim().length === 0) {
    errors.push('First name is required');
  } else if (body.first_name.length > 100) {
    errors.push('First name must be less than 100 characters');
  }

  if (body.middle_name !== undefined && (typeof body.middle_name !== 'string' || body.middle_name.length > 100)) {
    errors.push('Middle name must be a string with less than 100 characters');
  }

  if (!body.last_name || typeof body.last_name !== 'string' || body.last_name.trim().length === 0) {
    errors.push('Last name is required');
  } else if (body.last_name.length > 100) {
    errors.push('Last name must be less than 100 characters');
  }

  if (!body.date_of_birth || typeof body.date_of_birth !== 'string') {
    errors.push('Date of birth is required');
  } else if (!isValidDate(body.date_of_birth)) {
    errors.push('Invalid date of birth format');
  }

  if (!body.gender || typeof body.gender !== 'string') {
    errors.push('Gender is required');
  } else if (!isValidGender(body.gender)) {
    errors.push('Gender must be one of: male, female, other');
  }

  if (!body.nationality || typeof body.nationality !== 'string' || body.nationality.trim().length === 0) {
    errors.push('Nationality is required');
  } else if (body.nationality.length > 100) {
    errors.push('Nationality must be less than 100 characters');
  }

  if (!body.marital_status || typeof body.marital_status !== 'string') {
    errors.push('Marital status is required');
  } else if (!isValidMaritalStatus(body.marital_status)) {
    errors.push('Marital status must be one of: single, married, divorced, widowed');
  }

  if (body.profile_photo_path !== undefined && (typeof body.profile_photo_path !== 'string' || body.profile_photo_path.length > 500)) {
    errors.push('Profile photo path must be a string with less than 500 characters');
  }

  if (body.status !== undefined && (typeof body.status !== 'string' || !isValidStatus(body.status))) {
    errors.push('Status must be one of: active, inactive, terminated');
  }

  if (!body.designation || typeof body.designation !== 'string' || body.designation.trim().length === 0) {
    errors.push('Designation is required');
  } else if (body.designation.length > 100) {
    errors.push('Designation must be less than 100 characters');
  }

  if (!body.department || typeof body.department !== 'string' || body.department.trim().length === 0) {
    errors.push('Department is required');
  } else if (body.department.length > 100) {
    errors.push('Department must be less than 100 characters');
  }

  if (body.reporting_to !== undefined && body.reporting_to !== null && body.reporting_to !== '') {
    if (typeof body.reporting_to !== 'string' || !isValidMongoId(body.reporting_to)) {
      errors.push('Invalid reporting_to format. Must be a valid MongoDB ObjectId');
    }
  }

  if (!body.hire_date || typeof body.hire_date !== 'string') {
    errors.push('Hire date is required');
  } else if (!isValidDate(body.hire_date)) {
    errors.push('Invalid hire date format');
  }

  if (body.termination_date !== undefined && body.termination_date !== null) {
    if (typeof body.termination_date !== 'string' || !isValidDate(body.termination_date)) {
      errors.push('Invalid termination date format');
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

// Update employee validation
export const updateEmployeeSchema = (data: any) => {
  const errors: string[] = [];
  const { body, params } = data;

  if (!params || !params.id) {
    errors.push('Employee ID is required');
  } else if (!isValidMongoId(params.id)) {
    errors.push('Invalid employee ID format');
  }

  if (body) {
    if (body.employee_code !== undefined) {
      if (typeof body.employee_code !== 'string' || body.employee_code.trim().length === 0) {
        errors.push('Employee code must be a non-empty string');
      } else if (body.employee_code.length > 50) {
        errors.push('Employee code must be less than 50 characters');
      }
    }

    if (body.first_name !== undefined) {
      if (typeof body.first_name !== 'string' || body.first_name.trim().length === 0) {
        errors.push('First name must be a non-empty string');
      } else if (body.first_name.length > 100) {
        errors.push('First name must be less than 100 characters');
      }
    }

    if (body.middle_name !== undefined && (typeof body.middle_name !== 'string' || body.middle_name.length > 100)) {
      errors.push('Middle name must be a string with less than 100 characters');
    }

    if (body.last_name !== undefined) {
      if (typeof body.last_name !== 'string' || body.last_name.trim().length === 0) {
        errors.push('Last name must be a non-empty string');
      } else if (body.last_name.length > 100) {
        errors.push('Last name must be less than 100 characters');
      }
    }

    if (body.date_of_birth !== undefined && (typeof body.date_of_birth !== 'string' || !isValidDate(body.date_of_birth))) {
      errors.push('Invalid date of birth format');
    }

    if (body.gender !== undefined && (typeof body.gender !== 'string' || !isValidGender(body.gender))) {
      errors.push('Gender must be one of: male, female, other');
    }

    if (body.nationality !== undefined) {
      if (typeof body.nationality !== 'string' || body.nationality.trim().length === 0) {
        errors.push('Nationality must be a non-empty string');
      } else if (body.nationality.length > 100) {
        errors.push('Nationality must be less than 100 characters');
      }
    }

    if (body.marital_status !== undefined && (typeof body.marital_status !== 'string' || !isValidMaritalStatus(body.marital_status))) {
      errors.push('Marital status must be one of: single, married, divorced, widowed');
    }

    if (body.profile_photo_path !== undefined && (typeof body.profile_photo_path !== 'string' || body.profile_photo_path.length > 500)) {
      errors.push('Profile photo path must be a string with less than 500 characters');
    }

    if (body.status !== undefined && (typeof body.status !== 'string' || !isValidStatus(body.status))) {
      errors.push('Status must be one of: active, inactive, terminated');
    }

    if (body.designation !== undefined) {
      if (typeof body.designation !== 'string' || body.designation.trim().length === 0) {
        errors.push('Designation must be a non-empty string');
      } else if (body.designation.length > 100) {
        errors.push('Designation must be less than 100 characters');
      }
    }

    if (body.department !== undefined) {
      if (typeof body.department !== 'string' || body.department.trim().length === 0) {
        errors.push('Department must be a non-empty string');
      } else if (body.department.length > 100) {
        errors.push('Department must be less than 100 characters');
      }
    }

    if (body.reporting_to !== undefined && body.reporting_to !== null) {
      if (typeof body.reporting_to !== 'string' || !isValidMongoId(body.reporting_to)) {
        errors.push('Invalid reporting_to format. Must be a valid MongoDB ObjectId');
      }
    }

    if (body.hire_date !== undefined && (typeof body.hire_date !== 'string' || !isValidDate(body.hire_date))) {
      errors.push('Invalid hire date format');
    }

    if (body.termination_date !== undefined && body.termination_date !== null) {
      if (typeof body.termination_date !== 'string' || !isValidDate(body.termination_date)) {
        errors.push('Invalid termination date format');
      }
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

