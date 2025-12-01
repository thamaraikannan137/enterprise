// Employee Job Info types and interfaces

export type EmployeeStatus = 'active' | 'inactive' | 'terminated';
export type TimeType = 'full_time' | 'contract';

export interface EmployeeJobInfo {
  id: string;
  employee_id: string;
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
  hire_date?: string; // ISO date string
  joining_date?: string; // ISO date string
  termination_date?: string; // ISO date string
  status: EmployeeStatus;
  time_type?: TimeType;
  location?: string;
  legal_entity?: string;
  business_unit?: string;
  worker_type?: string;
  probation_policy?: string;
  notice_period?: string;
  secondary_job_titles?: string[];
  is_current: boolean;
  effective_from: string; // ISO date string
  effective_to?: string; // ISO date string
  created_by?: string; // User ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateEmployeeJobInfoInput {
  employee_id: string;
  designation: string;
  department: string;
  reporting_to?: string;
  hire_date?: string;
  joining_date?: string;
  termination_date?: string;
  status?: EmployeeStatus;
  time_type?: TimeType;
  location?: string;
  legal_entity?: string;
  business_unit?: string;
  worker_type?: string;
  probation_policy?: string;
  notice_period?: string;
  secondary_job_titles?: string[];
  is_current?: boolean;
  effective_from?: string;
  effective_to?: string;
}

export interface UpdateEmployeeJobInfoInput extends Partial<CreateEmployeeJobInfoInput> {}

export interface EmployeeJobInfoListResponse {
  jobInfos: EmployeeJobInfo[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EmployeeJobInfoApiResponse {
  data: EmployeeJobInfo | EmployeeJobInfo[] | EmployeeJobInfoListResponse;
  message?: string;
  success: boolean;
}





