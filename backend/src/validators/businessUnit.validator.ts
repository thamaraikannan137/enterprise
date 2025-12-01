// Validation helper functions
const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Create business unit validation
export const createBusinessUnitSchema = (data: any) => {
  const errors: string[] = [];
  const { body } = data;

  if (!body) {
    return { success: false, errors: ['Request body is required'] };
  }

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (body.name.length > 200) {
    errors.push('Name must be less than 200 characters');
  }

  if (body.description !== undefined && body.description !== null && body.description !== '') {
    if (typeof body.description !== 'string') {
      errors.push('Description must be a string');
    } else if (body.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

// Update business unit validation
export const updateBusinessUnitSchema = (data: any) => {
  const errors: string[] = [];
  const { body, params } = data;

  if (!params || !params.id) {
    errors.push('Business unit ID is required');
  } else if (!isValidMongoId(params.id)) {
    errors.push('Invalid business unit ID format');
  }

  if (body) {
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        errors.push('Name must be a non-empty string');
      } else if (body.name.length > 200) {
        errors.push('Name must be less than 200 characters');
      }
    }

    if (body.description !== undefined && body.description !== null && body.description !== '') {
      if (typeof body.description !== 'string') {
        errors.push('Description must be a string');
      } else if (body.description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
      }
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};




