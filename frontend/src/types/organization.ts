// Organization Structure types

export interface LegalEntity {
  id?: string;
  entity_name: string;
  legal_name: string;
  other_business_name?: string;
  company_identification_number?: string; // For non-US entities
  federal_employer_id?: string; // For US entities
  state_registration_number?: string;
  date_of_incorporation: string; // ISO date string
  business_type: string; // e.g., "Sole Proprietorship", "Private Limited"
  industry_type: string; // e.g., "Auto or Machine Sales", "Service Sector"
  nature_of_business_code?: string;
  currency: string;
  financial_year: string;
  // Contact Details
  website?: string;
  email?: string;
  phone?: string;
  // Registered Address
  street_1: string;
  street_2?: string;
  city: string;
  state: string;
  zip_code?: string;
  country?: string;
  // Additional
  employee_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLegalEntityInput {
  entity_name: string;
  legal_name: string;
  other_business_name?: string;
  company_identification_number?: string;
  federal_employer_id?: string;
  state_registration_number?: string;
  date_of_incorporation: string;
  business_type: string;
  industry_type: string;
  nature_of_business_code?: string;
  currency: string;
  financial_year: string;
  website?: string;
  email?: string;
  phone?: string;
  street_1: string;
  street_2?: string;
  city: string;
  state: string;
  zip_code?: string;
  country?: string;
}

export interface UpdateLegalEntityInput extends Partial<CreateLegalEntityInput> {}

// Business Unit types
export interface BusinessUnit {
  id?: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  employee_count?: number;
  business_unit_head_id?: string;
  business_unit_head?: {
    id: string;
    first_name: string;
    last_name: string;
    employee_code: string;
    designation?: string;
  };
  group_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBusinessUnitInput {
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  business_unit_head_id?: string;
  group_email?: string;
}

export interface UpdateBusinessUnitInput extends Partial<CreateBusinessUnitInput> {}

// Location types
export interface Location {
  id?: string;
  name: string;
  timezone: string;
  country: string;
  state: string;
  address: string;
  city: string;
  zip_code: string;
  description?: string;
  status?: 'active' | 'inactive';
  employee_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLocationInput {
  name: string;
  timezone: string;
  country: string;
  state: string;
  address: string;
  city: string;
  zip_code: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateLocationInput extends Partial<CreateLocationInput> {}

// Department types
export interface Department {
  id?: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  employee_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDepartmentInput {
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateDepartmentInput extends Partial<CreateDepartmentInput> {}

