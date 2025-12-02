// Validation helper functions
const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create legal entity validation
export const createLegalEntitySchema = (data: any) => {
  const errors: string[] = [];
  const { body } = data;

  if (!body) {
    return { success: false, errors: ['Request body is required'] };
  }

  if (!body.entity_name || typeof body.entity_name !== 'string' || body.entity_name.trim().length === 0) {
    errors.push('Entity name is required');
  } else if (body.entity_name.length > 200) {
    errors.push('Entity name must be less than 200 characters');
  }

  if (!body.legal_name || typeof body.legal_name !== 'string' || body.legal_name.trim().length === 0) {
    errors.push('Legal name is required');
  } else if (body.legal_name.length > 200) {
    errors.push('Legal name must be less than 200 characters');
  }

  if (body.other_business_name !== undefined && body.other_business_name !== null && body.other_business_name !== '') {
    if (typeof body.other_business_name !== 'string' || body.other_business_name.length > 200) {
      errors.push('Other business name must be a string with less than 200 characters');
    }
  }

  if (body.company_identification_number !== undefined && body.company_identification_number !== null && body.company_identification_number !== '') {
    if (typeof body.company_identification_number !== 'string' || body.company_identification_number.length > 50) {
      errors.push('Company identification number must be a string with less than 50 characters');
    }
  }

  if (body.federal_employer_id !== undefined && body.federal_employer_id !== null && body.federal_employer_id !== '') {
    if (typeof body.federal_employer_id !== 'string' || body.federal_employer_id.length > 50) {
      errors.push('Federal employer ID must be a string with less than 50 characters');
    }
  }

  if (body.state_registration_number !== undefined && body.state_registration_number !== null && body.state_registration_number !== '') {
    if (typeof body.state_registration_number !== 'string' || body.state_registration_number.length > 50) {
      errors.push('State registration number must be a string with less than 50 characters');
    }
  }

  if (!body.date_of_incorporation || typeof body.date_of_incorporation !== 'string') {
    errors.push('Date of incorporation is required');
  } else if (!isValidDate(body.date_of_incorporation)) {
    errors.push('Invalid date of incorporation format');
  }

  if (!body.business_type || typeof body.business_type !== 'string' || body.business_type.trim().length === 0) {
    errors.push('Business type is required');
  } else if (body.business_type.length > 100) {
    errors.push('Business type must be less than 100 characters');
  }

  if (!body.industry_type || typeof body.industry_type !== 'string' || body.industry_type.trim().length === 0) {
    errors.push('Industry type is required');
  } else if (body.industry_type.length > 100) {
    errors.push('Industry type must be less than 100 characters');
  }

  if (body.nature_of_business_code !== undefined && body.nature_of_business_code !== null && body.nature_of_business_code !== '') {
    if (typeof body.nature_of_business_code !== 'string' || body.nature_of_business_code.length > 200) {
      errors.push('Nature of business code must be a string with less than 200 characters');
    }
  }

  if (!body.currency || typeof body.currency !== 'string' || body.currency.trim().length === 0) {
    errors.push('Currency is required');
  } else if (body.currency.length > 50) {
    errors.push('Currency must be less than 50 characters');
  }

  if (!body.financial_year || typeof body.financial_year !== 'string' || body.financial_year.trim().length === 0) {
    errors.push('Financial year is required');
  } else if (body.financial_year.length > 100) {
    errors.push('Financial year must be less than 100 characters');
  }

  if (body.website !== undefined && body.website !== null && body.website !== '') {
    if (typeof body.website !== 'string' || body.website.length > 255) {
      errors.push('Website must be a string with less than 255 characters');
    }
  }

  if (body.email !== undefined && body.email !== null && body.email !== '') {
    if (typeof body.email !== 'string' || !isValidEmail(body.email)) {
      errors.push('Email must be a valid email address');
    } else if (body.email.length > 255) {
      errors.push('Email must be less than 255 characters');
    }
  }

  if (body.phone !== undefined && body.phone !== null && body.phone !== '') {
    if (typeof body.phone !== 'string' || body.phone.length > 20) {
      errors.push('Phone must be a string with less than 20 characters');
    }
  }

  if (!body.street_1 || typeof body.street_1 !== 'string' || body.street_1.trim().length === 0) {
    errors.push('Street address line 1 is required');
  } else if (body.street_1.length > 255) {
    errors.push('Street address line 1 must be less than 255 characters');
  }

  if (body.street_2 !== undefined && body.street_2 !== null && body.street_2 !== '') {
    if (typeof body.street_2 !== 'string' || body.street_2.length > 255) {
      errors.push('Street address line 2 must be a string with less than 255 characters');
    }
  }

  if (!body.city || typeof body.city !== 'string' || body.city.trim().length === 0) {
    errors.push('City is required');
  } else if (body.city.length > 100) {
    errors.push('City must be less than 100 characters');
  }

  if (!body.state || typeof body.state !== 'string' || body.state.trim().length === 0) {
    errors.push('State is required');
  } else if (body.state.length > 100) {
    errors.push('State must be less than 100 characters');
  }

  if (body.zip_code !== undefined && body.zip_code !== null && body.zip_code !== '') {
    if (typeof body.zip_code !== 'string' || body.zip_code.length > 20) {
      errors.push('Zip code must be a string with less than 20 characters');
    }
  }

  if (body.country !== undefined && body.country !== null && body.country !== '') {
    if (typeof body.country !== 'string' || body.country.length > 100) {
      errors.push('Country must be a string with less than 100 characters');
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};

// Update legal entity validation
export const updateLegalEntitySchema = (data: any) => {
  const errors: string[] = [];
  const { body, params } = data;

  if (!params || !params.id) {
    errors.push('Legal entity ID is required');
  } else if (!isValidMongoId(params.id)) {
    errors.push('Invalid legal entity ID format');
  }

  if (body) {
    if (body.entity_name !== undefined) {
      if (typeof body.entity_name !== 'string' || body.entity_name.trim().length === 0) {
        errors.push('Entity name must be a non-empty string');
      } else if (body.entity_name.length > 200) {
        errors.push('Entity name must be less than 200 characters');
      }
    }

    if (body.legal_name !== undefined) {
      if (typeof body.legal_name !== 'string' || body.legal_name.trim().length === 0) {
        errors.push('Legal name must be a non-empty string');
      } else if (body.legal_name.length > 200) {
        errors.push('Legal name must be less than 200 characters');
      }
    }

    if (body.date_of_incorporation !== undefined && (typeof body.date_of_incorporation !== 'string' || !isValidDate(body.date_of_incorporation))) {
      errors.push('Invalid date of incorporation format');
    }

    if (body.business_type !== undefined) {
      if (typeof body.business_type !== 'string' || body.business_type.trim().length === 0) {
        errors.push('Business type must be a non-empty string');
      } else if (body.business_type.length > 100) {
        errors.push('Business type must be less than 100 characters');
      }
    }

    if (body.industry_type !== undefined) {
      if (typeof body.industry_type !== 'string' || body.industry_type.trim().length === 0) {
        errors.push('Industry type must be a non-empty string');
      } else if (body.industry_type.length > 100) {
        errors.push('Industry type must be less than 100 characters');
      }
    }

    if (body.currency !== undefined) {
      if (typeof body.currency !== 'string' || body.currency.trim().length === 0) {
        errors.push('Currency must be a non-empty string');
      } else if (body.currency.length > 50) {
        errors.push('Currency must be less than 50 characters');
      }
    }

    if (body.financial_year !== undefined) {
      if (typeof body.financial_year !== 'string' || body.financial_year.trim().length === 0) {
        errors.push('Financial year must be a non-empty string');
      } else if (body.financial_year.length > 100) {
        errors.push('Financial year must be less than 100 characters');
      }
    }

    if (body.email !== undefined && body.email !== null && body.email !== '') {
      if (typeof body.email !== 'string' || !isValidEmail(body.email)) {
        errors.push('Email must be a valid email address');
      } else if (body.email.length > 255) {
        errors.push('Email must be less than 255 characters');
      }
    }

    if (body.street_1 !== undefined) {
      if (typeof body.street_1 !== 'string' || body.street_1.trim().length === 0) {
        errors.push('Street address line 1 must be a non-empty string');
      } else if (body.street_1.length > 255) {
        errors.push('Street address line 1 must be less than 255 characters');
      }
    }

    if (body.city !== undefined) {
      if (typeof body.city !== 'string' || body.city.trim().length === 0) {
        errors.push('City must be a non-empty string');
      } else if (body.city.length > 100) {
        errors.push('City must be less than 100 characters');
      }
    }

    if (body.state !== undefined) {
      if (typeof body.state !== 'string' || body.state.trim().length === 0) {
        errors.push('State must be a non-empty string');
      } else if (body.state.length > 100) {
        errors.push('State must be less than 100 characters');
      }
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
};





