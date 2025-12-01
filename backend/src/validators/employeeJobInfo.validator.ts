// Validation helper functions
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

const isValidStatus = (status: string): boolean => {
  return ['active', 'inactive', 'terminated'].includes(status);
};

const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Create employee job info validation
export const createEmployeeJobInfoSchema = (data: any) => {
  console.log('=== EMPLOYEE JOB INFO VALIDATOR CALLED ===');
  console.log('This is createEmployeeJobInfoSchema from employeeJobInfo.validator.ts');
  const errors: string[] = [];
  const { body } = data;

  if (!body) {
    return { success: false, errors: ['Request body is required'] };
  }

  if (!body.employee_id || typeof body.employee_id !== 'string' || !isValidMongoId(body.employee_id)) {
    errors.push('Valid employee ID is required');
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

  if (body.hire_date !== undefined && body.hire_date !== null && body.hire_date !== '') {
    if (typeof body.hire_date !== 'string' || !isValidDate(body.hire_date)) {
      errors.push('Invalid hire date format');
    }
  }

  // Joining date is optional in the model, but we'll validate format if provided
  // Treat empty strings as undefined
  if (body.joining_date !== undefined && body.joining_date !== null && body.joining_date !== '') {
    if (typeof body.joining_date !== 'string' || !isValidDate(body.joining_date)) {
      errors.push('Invalid joining date format');
    }
  } else if (body.joining_date === '') {
    // Empty string is allowed for optional fields, but we should not require it
    // This check ensures empty strings don't cause validation errors
  }

  if (body.termination_date !== undefined && body.termination_date !== null && body.termination_date !== '') {
    if (typeof body.termination_date !== 'string' || !isValidDate(body.termination_date)) {
      errors.push('Invalid termination date format');
    }
  }

  if (body.status !== undefined && (typeof body.status !== 'string' || !isValidStatus(body.status))) {
    errors.push('Status must be one of: active, inactive, terminated');
  }

  // Time type is optional in the model, but we'll validate if provided
  // Treat empty strings as undefined
  if (body.time_type !== undefined && body.time_type !== null && body.time_type !== '') {
    if (typeof body.time_type !== 'string' || !['full_time', 'contract'].includes(body.time_type)) {
      errors.push('Time type must be one of: full_time, contract');
    }
  } else if (body.time_type === '') {
    // Empty string is allowed for optional fields
  }

  // Location is optional in the model, but we'll validate if provided
  // Treat empty strings as undefined
  if (body.location !== undefined && body.location !== null && body.location !== '') {
    if (typeof body.location !== 'string' || body.location.trim().length === 0) {
      errors.push('Location must be a non-empty string');
    } else if (body.location.length > 200) {
      errors.push('Location must be less than 200 characters');
    }
  } else if (body.location === '') {
    // Empty string is allowed for optional fields
  }

  if (body.legal_entity !== undefined && body.legal_entity !== null && body.legal_entity !== '') {
    if (typeof body.legal_entity !== 'string' || body.legal_entity.length > 100) {
      errors.push('Legal entity must be less than 100 characters');
    }
  }

  if (body.business_unit !== undefined && body.business_unit !== null && body.business_unit !== '') {
    if (typeof body.business_unit !== 'string' || body.business_unit.length > 100) {
      errors.push('Business unit must be less than 100 characters');
    }
  }

  if (body.worker_type !== undefined && body.worker_type !== null && body.worker_type !== '') {
    if (typeof body.worker_type !== 'string' || body.worker_type.length > 50) {
      errors.push('Worker type must be less than 50 characters');
    }
  }

  if (body.probation_policy !== undefined && body.probation_policy !== null && body.probation_policy !== '') {
    if (typeof body.probation_policy !== 'string' || body.probation_policy.length > 100) {
      errors.push('Probation policy must be less than 100 characters');
    }
  }

  if (body.notice_period !== undefined && body.notice_period !== null && body.notice_period !== '') {
    if (typeof body.notice_period !== 'string' || body.notice_period.length > 100) {
      errors.push('Notice period must be less than 100 characters');
    }
  }

  if (body.secondary_job_titles !== undefined && !Array.isArray(body.secondary_job_titles)) {
    errors.push('Secondary job titles must be an array');
  }

  if (body.effective_from !== undefined && body.effective_from !== null && body.effective_from !== '') {
    if (typeof body.effective_from !== 'string' || !isValidDate(body.effective_from)) {
      errors.push('Invalid effective_from date format');
    }
  }

  if (body.effective_to !== undefined && body.effective_to !== null && body.effective_to !== '') {
    if (typeof body.effective_to !== 'string' || !isValidDate(body.effective_to)) {
      errors.push('Invalid effective_to date format');
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

// Update employee job info validation
export const updateEmployeeJobInfoSchema = (data: any) => {
  const errors: string[] = [];
  const { body, params } = data;

  if (!params || !params.id) {
    errors.push('Job info ID is required');
  } else if (!isValidMongoId(params.id)) {
    errors.push('Invalid job info ID format');
  }

  if (body) {
    if (body.employee_id !== undefined) {
      if (typeof body.employee_id !== 'string' || !isValidMongoId(body.employee_id)) {
        errors.push('Valid employee ID is required');
      }
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

    if (body.hire_date !== undefined && body.hire_date !== null && body.hire_date !== '') {
      if (typeof body.hire_date !== 'string' || !isValidDate(body.hire_date)) {
        errors.push('Invalid hire date format');
      }
    }

    if (body.joining_date !== undefined && body.joining_date !== null && body.joining_date !== '') {
      if (typeof body.joining_date !== 'string' || !isValidDate(body.joining_date)) {
        errors.push('Invalid joining date format');
      }
    }

    if (body.termination_date !== undefined && body.termination_date !== null && body.termination_date !== '') {
      if (typeof body.termination_date !== 'string' || !isValidDate(body.termination_date)) {
        errors.push('Invalid termination date format');
      }
    }

    if (body.status !== undefined && (typeof body.status !== 'string' || !isValidStatus(body.status))) {
      errors.push('Status must be one of: active, inactive, terminated');
    }

    if (body.time_type !== undefined && body.time_type !== null && body.time_type !== '') {
      if (typeof body.time_type !== 'string' || !['full_time', 'contract'].includes(body.time_type)) {
        errors.push('Time type must be one of: full_time, contract');
      }
    }

    if (body.location !== undefined && body.location !== null && body.location !== '') {
      if (typeof body.location !== 'string' || body.location.trim().length === 0) {
        errors.push('Location must be a non-empty string');
      } else if (body.location.length > 200) {
        errors.push('Location must be less than 200 characters');
      }
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

