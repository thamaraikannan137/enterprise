// Validation helper functions
const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Create location validation
export const createLocationSchema = (data: any) => {
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

  if (!body.timezone || typeof body.timezone !== 'string' || body.timezone.trim().length === 0) {
    errors.push('Timezone is required');
  } else if (body.timezone.length > 100) {
    errors.push('Timezone must be less than 100 characters');
  }

  if (!body.country || typeof body.country !== 'string' || body.country.trim().length === 0) {
    errors.push('Country is required');
  } else if (body.country.length > 100) {
    errors.push('Country must be less than 100 characters');
  }

  if (!body.state || typeof body.state !== 'string' || body.state.trim().length === 0) {
    errors.push('State is required');
  } else if (body.state.length > 100) {
    errors.push('State must be less than 100 characters');
  }

  if (!body.address || typeof body.address !== 'string' || body.address.trim().length === 0) {
    errors.push('Address is required');
  } else if (body.address.length > 500) {
    errors.push('Address must be less than 500 characters');
  }

  if (!body.city || typeof body.city !== 'string' || body.city.trim().length === 0) {
    errors.push('City is required');
  } else if (body.city.length > 100) {
    errors.push('City must be less than 100 characters');
  }

  if (!body.zip_code || typeof body.zip_code !== 'string' || body.zip_code.trim().length === 0) {
    errors.push('Zip code is required');
  } else if (body.zip_code.length > 20) {
    errors.push('Zip code must be less than 20 characters');
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

// Update location validation
export const updateLocationSchema = (data: any) => {
  const errors: string[] = [];
  const { body, params } = data;

  if (!params || !params.id) {
    errors.push('Location ID is required');
  } else if (!isValidMongoId(params.id)) {
    errors.push('Invalid location ID format');
  }

  if (body) {
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        errors.push('Name must be a non-empty string');
      } else if (body.name.length > 200) {
        errors.push('Name must be less than 200 characters');
      }
    }

    if (body.timezone !== undefined) {
      if (typeof body.timezone !== 'string' || body.timezone.trim().length === 0) {
        errors.push('Timezone must be a non-empty string');
      } else if (body.timezone.length > 100) {
        errors.push('Timezone must be less than 100 characters');
      }
    }

    if (body.country !== undefined) {
      if (typeof body.country !== 'string' || body.country.trim().length === 0) {
        errors.push('Country must be a non-empty string');
      } else if (body.country.length > 100) {
        errors.push('Country must be less than 100 characters');
      }
    }

    if (body.state !== undefined) {
      if (typeof body.state !== 'string' || body.state.trim().length === 0) {
        errors.push('State must be a non-empty string');
      } else if (body.state.length > 100) {
        errors.push('State must be less than 100 characters');
      }
    }

    if (body.address !== undefined) {
      if (typeof body.address !== 'string' || body.address.trim().length === 0) {
        errors.push('Address must be a non-empty string');
      } else if (body.address.length > 500) {
        errors.push('Address must be less than 500 characters');
      }
    }

    if (body.city !== undefined) {
      if (typeof body.city !== 'string' || body.city.trim().length === 0) {
        errors.push('City must be a non-empty string');
      } else if (body.city.length > 100) {
        errors.push('City must be less than 100 characters');
      }
    }

    if (body.zip_code !== undefined) {
      if (typeof body.zip_code !== 'string' || body.zip_code.trim().length === 0) {
        errors.push('Zip code must be a non-empty string');
      } else if (body.zip_code.length > 20) {
        errors.push('Zip code must be less than 20 characters');
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





