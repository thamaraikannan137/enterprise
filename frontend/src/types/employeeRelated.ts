// Employee Contact Types
export type ContactType = 'primary' | 'secondary' | 'emergency';

export interface EmployeeContact {
  id: string;
  employee_id: string;
  contact_type: ContactType;
  phone?: string;
  alternate_phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_current: boolean;
  valid_from: string;
  valid_to?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeContactInput {
  employee_id: string;
  contact_type: ContactType;
  phone?: string;
  alternate_phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_current?: boolean;
  valid_from: string;
  valid_to?: string;
}

export interface UpdateEmployeeContactInput {
  contact_type?: ContactType;
  phone?: string;
  alternate_phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_current?: boolean;
  valid_from?: string;
  valid_to?: string;
}

// Employee Compensation Types
export interface EmployeeCompensation {
  id: string;
  employee_id: string;
  basic_salary: number;
  ot_hourly_rate?: number;
  effective_from: string;
  effective_to?: string;
  is_current: boolean;
  approved_by?: string;
  approved_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeCompensationInput {
  employee_id: string;
  basic_salary: number;
  ot_hourly_rate?: number;
  effective_from: string;
  effective_to?: string;
  is_current?: boolean;
}

export interface UpdateEmployeeCompensationInput {
  basic_salary?: number;
  ot_hourly_rate?: number;
  effective_from?: string;
  effective_to?: string;
  is_current?: boolean;
}

// Employee Document Types
export type DocumentType = 'passport' | 'certificate' | 'work_pass' | 'qualification' | 'other';

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  document_type: DocumentType;
  document_name: string;
  file_path: string;
  issue_date?: string;
  expiry_date?: string;
  is_active: boolean;
  uploaded_at: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDocumentInput {
  employee_id: string;
  document_type: DocumentType;
  document_name: string;
  file_path: string;
  issue_date?: string;
  expiry_date?: string;
  is_active?: boolean;
}

// Employee Work Pass Types
export type WorkPassStatus = 'new' | 'renewal' | 'cancelled';

export interface EmployeeWorkPass {
  id: string;
  employee_id: string;
  status: WorkPassStatus;
  work_permit_number?: string;
  fin_number?: string;
  application_date?: string;
  issuance_date?: string;
  expiry_date?: string;
  medical_date?: string;
  is_current: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeWorkPassInput {
  employee_id: string;
  status: WorkPassStatus;
  work_permit_number?: string;
  fin_number?: string;
  application_date?: string;
  issuance_date?: string;
  expiry_date?: string;
  medical_date?: string;
  is_current?: boolean;
}

// Employee Certification Types
export type CertificationType = 'new' | 'renewal';
export type OwnershipType = 'company' | 'employee';

export interface EmployeeCertification {
  id: string;
  employee_id: string;
  certification_name: string;
  certification_type: CertificationType;
  issue_date: string;
  expiry_date?: string;
  ownership: OwnershipType;
  document_id?: string;
  is_active: boolean;
  reminder_sent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeCertificationInput {
  employee_id: string;
  certification_name: string;
  certification_type: CertificationType;
  issue_date: string;
  expiry_date?: string;
  ownership: OwnershipType;
  document_id?: string;
  is_active?: boolean;
}

// Employee Qualification Types
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface EmployeeQualification {
  id: string;
  employee_id: string;
  degree: string;
  major?: string;
  institution: string;
  completion_year: number;
  document_id?: string;
  verification_status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeQualificationInput {
  employee_id: string;
  degree: string;
  major?: string;
  institution: string;
  completion_year: number;
  document_id?: string;
  verification_status?: VerificationStatus;
}

// Combined input for employee creation with all related data
export interface CreateEmployeeWithDetailsInput {
  // Employee data
  employee: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    date_of_birth: string;
    profile_photo_path?: string;
    status?: 'active' | 'inactive' | 'terminated';
    designation: string;
    department: string;
    reporting_to?: string;
    joining_date?: string;
    time_type?: 'full_time' | 'contract';
    location?: string;
    email?: string;
    mobile_number?: string;
  };
  // Related data (optional)
  contacts?: CreateEmployeeContactInput[];
  compensation?: CreateEmployeeCompensationInput;
  documents?: CreateEmployeeDocumentInput[];
  workPass?: CreateEmployeeWorkPassInput;
  certifications?: CreateEmployeeCertificationInput[];
  qualifications?: CreateEmployeeQualificationInput[];
}


