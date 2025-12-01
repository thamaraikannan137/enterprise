// Employee types and interfaces

export type EmployeeGender = 'male' | 'female' | 'other';
export type EmployeeMaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';

export interface Employee {
  id: string;
  employee_code: string;
  // Primary Details
  first_name: string;
  middle_name?: string;
  last_name: string;
  display_name?: string;
  gender?: EmployeeGender;
  date_of_birth: string; // ISO date string
  marital_status?: EmployeeMaritalStatus;
  blood_group?: string;
  marriage_date?: string;
  physically_handicapped?: boolean;
  actual_dob?: string;
  birth_place?: string;
  nationality?: string;
  current_city?: string;
  current_state?: string;
  profile_photo_path?: string;
  
  // Contact Details
  work_email?: string;
  personal_email?: string;
  mobile_number?: string;
  work_number?: string;
  residence_number?: string;
  emergency_contact_number?: string;
  emergency_contact_name?: string;
  linkedin_id?: string;
  
  // Current Address
  current_address_line1?: string;
  current_address_line2?: string;
  current_city_address?: string;
  current_postal_code?: string;
  current_country?: string;
  
  // Permanent Address
  permanent_address_line1?: string;
  permanent_address_line2?: string;
  permanent_city?: string;
  permanent_postal_code?: string;
  permanent_country?: string;
  
  // Family Details
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
  
  // Previous Experience
  total_experience?: number; // in years
  relevant_experience?: number; // in years
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
  
  // Education Details
  // PG details
  pg_degree?: string;
  pg_specialization?: string;
  pg_grade?: string;
  pg_university?: string;
  pg_completion_year?: number;
  // Graduation details
  graduation_degree?: string;
  graduation_specialization?: string;
  graduation_grade?: string;
  graduation_college?: string;
  graduation_completion_year?: number;
  // Inter/12th details
  inter_grade?: string;
  inter_school?: string;
  inter_completion_year?: number;
  
  // Identity Details
  aadhar_number?: string;
  pan_number?: string;
  uan_number?: string;
  driving_license_number?: string;
  passport_name?: string;
  passport_number?: string;
  passport_valid_upto?: string;
  visa_type?: string;
  
  // Skills & Interests
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
  
  // Job-related fields (populated from EmployeeJobInfo when fetching employee list)
  designation?: string;
  department?: string;
  status?: 'active' | 'inactive' | 'terminated';
  hire_date?: string; // ISO date string
  joining_date?: string; // ISO date string
  location?: string;
  time_type?: 'full_time' | 'contract';
  reporting_to?: string | {
    id: string;
    first_name: string;
    last_name: string;
    employee_code: string;
    designation?: string;
  };
  reportingToEmployee?: {
    id: string;
    first_name: string;
    last_name: string;
    employee_code: string;
    designation?: string;
  };
  
  created_by?: string; // User ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

import type {
  EmployeeCompensation,
  EmployeeDocument,
  EmployeeWorkPass,
  EmployeeCertification,
  EmployeeQualification,
} from './employeeRelated';

export interface EmployeeWithDetails extends Employee {
  documents?: EmployeeDocument[];
  compensations?: EmployeeCompensation[];
  allowances?: any[];
  deductions?: any[];
  leaveEntitlements?: any[];
  certifications?: EmployeeCertification[];
  qualifications?: EmployeeQualification[];
  workPasses?: EmployeeWorkPass[];
}

export interface CreateEmployeeInput {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender?: EmployeeGender;
  nationality?: string;
  marital_status?: EmployeeMaritalStatus;
  display_name?: string;
  blood_group?: string;
  marriage_date?: string;
  physically_handicapped?: boolean;
  actual_dob?: string;
  birth_place?: string;
  current_city?: string;
  current_state?: string;
  profile_photo_path?: string;
  
  // Contact Details
  work_email?: string;
  personal_email?: string;
  mobile_number?: string;
  work_number?: string;
  residence_number?: string;
  emergency_contact_number?: string;
  emergency_contact_name?: string;
  linkedin_id?: string;
  
  // Addresses
  current_address_line1?: string;
  current_address_line2?: string;
  current_city_address?: string;
  current_postal_code?: string;
  current_country?: string;
  permanent_address_line1?: string;
  permanent_address_line2?: string;
  permanent_city?: string;
  permanent_postal_code?: string;
  permanent_country?: string;
  
  // Family
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
  
  // Experience
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
  
  // Education
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
  
  // Identity
  aadhar_number?: string;
  pan_number?: string;
  uan_number?: string;
  driving_license_number?: string;
  passport_name?: string;
  passport_number?: string;
  passport_valid_upto?: string;
  visa_type?: string;
  
  // Skills
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

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  employee_code?: string;
}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EmployeeApiResponse {
  data: Employee | EmployeeWithDetails | EmployeeListResponse;
  message?: string;
  success: boolean;
}
