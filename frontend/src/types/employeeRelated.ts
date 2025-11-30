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
    email?: string;
    mobile_number?: string;
    profile_photo_path?: string;
    status?: 'active' | 'inactive' | 'terminated';
    
    joining_date?: string;
    secondary_job_titles?: string[];
    designation: string;
    time_type?: 'full_time' | 'contract';
    
    legal_entity?: string;
    business_unit?: string;
    department: string;
    location?: string;
    worker_type?: string;
    reporting_to?: string;

    probation_policy?: string;
    notice_period?: string;
  };
  // Related data (optional)
  contacts?: CreateEmployeeContactInput[];
  compensation?: CreateEmployeeCompensationInput;
  documents?: CreateEmployeeDocumentInput[];
  workPass?: CreateEmployeeWorkPassInput;
  certifications?: CreateEmployeeCertificationInput[];
  qualifications?: CreateEmployeeQualificationInput[];
}

// Employee Family Types
export interface EmployeeFamily {
  id: string;
  employee_id: string;
  father_dob?: string;
  mother_dob?: string;
  spouse_gender?: 'male' | 'female' | 'other';
  spouse_dob?: string;
  kid1_name?: string;
  kid1_gender?: 'male' | 'female' | 'other';
  kid1_dob?: string;
  kid2_name?: string;
  kid2_gender?: 'male' | 'female' | 'other';
  kid2_dob?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeFamilyInput {
  employee_id: string;
  father_dob?: string;
  mother_dob?: string;
  spouse_gender?: 'male' | 'female' | 'other';
  spouse_dob?: string;
  kid1_name?: string;
  kid1_gender?: 'male' | 'female' | 'other';
  kid1_dob?: string;
  kid2_name?: string;
  kid2_gender?: 'male' | 'female' | 'other';
  kid2_dob?: string;
}

// Employee Experience Types
export interface EmployeeExperience {
  id: string;
  employee_id: string;
  total_experience?: number;
  relevant_experience?: number;
  organization1_name?: string;
  organization1_start_date?: string;
  organization1_end_date?: string;
  organization1_designation?: string;
  organization1_reason_for_leaving?: string;
  organization2_name?: string;
  organization2_start_date?: string;
  organization2_end_date?: string;
  organization2_designation?: string;
  organization2_reason_for_leaving?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeExperienceInput {
  employee_id: string;
  total_experience?: number;
  relevant_experience?: number;
  organization1_name?: string;
  organization1_start_date?: string;
  organization1_end_date?: string;
  organization1_designation?: string;
  organization1_reason_for_leaving?: string;
  organization2_name?: string;
  organization2_start_date?: string;
  organization2_end_date?: string;
  organization2_designation?: string;
  organization2_reason_for_leaving?: string;
}

// Employee Education Detail Types
export interface EmployeeEducationDetail {
  id: string;
  employee_id: string;
  pg_degree?: string;
  pg_specialization?: string;
  pg_grade?: string;
  pg_university?: string;
  pg_completion_year?: number;
  graduation_degree?: string;
  graduation_specialization?: string;
  graduation_grade?: string;
  graduation_college?: string;
  graduation_completion_year?: number;
  inter_grade?: string;
  inter_school?: string;
  inter_completion_year?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeEducationDetailInput {
  employee_id: string;
  pg_degree?: string;
  pg_specialization?: string;
  pg_grade?: string;
  pg_university?: string;
  pg_completion_year?: number;
  graduation_degree?: string;
  graduation_specialization?: string;
  graduation_grade?: string;
  graduation_college?: string;
  graduation_completion_year?: number;
  inter_grade?: string;
  inter_school?: string;
  inter_completion_year?: number;
}

// Employee Identity Types
export interface EmployeeIdentity {
  id: string;
  employee_id: string;
  aadhar_number?: string;
  pan_number?: string;
  uan_number?: string;
  driving_license_number?: string;
  passport_name?: string;
  passport_number?: string;
  passport_valid_upto?: string;
  visa_type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeIdentityInput {
  employee_id: string;
  aadhar_number?: string;
  pan_number?: string;
  uan_number?: string;
  driving_license_number?: string;
  passport_name?: string;
  passport_number?: string;
  passport_valid_upto?: string;
  visa_type?: string;
}

// Employee Skills Types
export interface EmployeeSkills {
  id: string;
  employee_id: string;
  professional_summary?: string;
  languages_read?: string[];
  languages_write?: string[];
  languages_speak?: string[];
  special_academic_achievements?: string;
  certifications_details?: string;
  hobbies?: string;
  interests?: string;
  professional_institution_member?: boolean;
  professional_institution_details?: string;
  social_organization_member?: boolean;
  social_organization_details?: string;
  insigma_hire_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeSkillsInput {
  employee_id: string;
  professional_summary?: string;
  languages_read?: string[];
  languages_write?: string[];
  languages_speak?: string[];
  special_academic_achievements?: string;
  certifications_details?: string;
  hobbies?: string;
  interests?: string;
  professional_institution_member?: boolean;
  professional_institution_details?: string;
  social_organization_member?: boolean;
  social_organization_details?: string;
  insigma_hire_date?: string;
}

// Employee Address Types
export interface EmployeeAddress {
  id: string;
  employee_id: string;
  home_town?: string;
  current_city?: string;
  current_state?: string;
  current_pincode?: string;
  permanent_city?: string;
  permanent_state?: string;
  permanent_pincode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeAddressInput {
  employee_id: string;
  home_town?: string;
  current_city?: string;
  current_state?: string;
  current_pincode?: string;
  permanent_city?: string;
  permanent_state?: string;
  permanent_pincode?: string;
}


