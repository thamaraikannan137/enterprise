// Employee types and interfaces

export type EmployeeGender = 'male' | 'female' | 'other';
export type EmployeeMaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type EmployeeStatus = 'active' | 'inactive' | 'terminated';

export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string; // ISO date string
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
  status: EmployeeStatus;
  designation: string;
  department: string;
  reporting_to?: string; // Employee ID
  reportingToEmployee?: {
    id: string;
    first_name: string;
    last_name: string;
    designation: string;
    employee_code: string;
  };
  hire_date: string; // ISO date string
  termination_date?: string; // ISO date string
  created_by?: string; // User ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

import type {
  EmployeeContact,
  EmployeeCompensation,
  EmployeeDocument,
  EmployeeWorkPass,
  EmployeeCertification,
  EmployeeQualification,
  EmployeeFamily,
  EmployeeExperience,
  EmployeeEducationDetail,
  EmployeeIdentity,
  EmployeeSkills,
  EmployeeAddress,
} from './employeeRelated';

import type {
  EmployeeFamily,
  EmployeeExperience,
  EmployeeEducationDetail,
  EmployeeIdentity,
  EmployeeSkills,
  EmployeeAddress,
} from './employeeRelated';

export interface EmployeeWithDetails extends Employee {
  contacts?: EmployeeContact[];
  documents?: EmployeeDocument[];
  compensations?: EmployeeCompensation[];
  allowances?: any[];
  deductions?: any[];
  leaveEntitlements?: any[];
  certifications?: EmployeeCertification[];
  qualifications?: EmployeeQualification[];
  workPasses?: EmployeeWorkPass[];
  family?: EmployeeFamily;
  experience?: EmployeeExperience;
  educationDetail?: EmployeeEducationDetail;
  identity?: EmployeeIdentity;
  skills?: EmployeeSkills;
  address?: EmployeeAddress;
}

export interface CreateEmployeeInput {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender?: EmployeeGender;
  nationality?: string;
  marital_status?: EmployeeMaritalStatus;
  profile_photo_path?: string;
  status?: EmployeeStatus;
  designation: string;
  department: string;
  reporting_to?: string; // Employee ID
  hire_date?: string;
  joining_date?: string;
  time_type?: 'full_time' | 'contract';
  location?: string;
  termination_date?: string;
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  employee_code?: string;
}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  status?: EmployeeStatus;
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

