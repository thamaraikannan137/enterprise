import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  EmployeeJobInfo,
  CreateEmployeeJobInfoInput,
  UpdateEmployeeJobInfoInput,
  EmployeeJobInfoListResponse,
} from '../types/employeeJobInfo';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const employeeJobInfoService = {
  /**
   * Create new job info
   */
  createJobInfo: async (jobInfoData: CreateEmployeeJobInfoInput): Promise<EmployeeJobInfo> => {
    const response = await apiClient.post<ApiResponse<EmployeeJobInfo>>(
      API_ENDPOINTS.EMPLOYEE_JOB_INFO,
      jobInfoData
    );
    return response.data;
  },

  /**
   * Get current job info for an employee
   */
  getCurrentJobInfo: async (employeeId: string): Promise<EmployeeJobInfo | null> => {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeJobInfo>>(
        `${API_ENDPOINTS.EMPLOYEE_JOB_INFO}/employee/${employeeId}/current`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  /**
   * Get job history for an employee
   */
  getJobHistory: async (employeeId: string): Promise<EmployeeJobInfo[]> => {
    const response = await apiClient.get<ApiResponse<EmployeeJobInfo[]>>(
      `${API_ENDPOINTS.EMPLOYEE_JOB_INFO}/employee/${employeeId}/history`
    );
    return response.data;
  },

  /**
   * Get job info by ID
   */
  getJobInfoById: async (id: string): Promise<EmployeeJobInfo> => {
    const response = await apiClient.get<ApiResponse<EmployeeJobInfo>>(
      `${API_ENDPOINTS.EMPLOYEE_JOB_INFO}/${id}`
    );
    return response.data;
  },

  /**
   * Update job info
   */
  updateJobInfo: async (
    id: string,
    jobInfoData: UpdateEmployeeJobInfoInput
  ): Promise<EmployeeJobInfo> => {
    const response = await apiClient.put<ApiResponse<EmployeeJobInfo>>(
      `${API_ENDPOINTS.EMPLOYEE_JOB_INFO}/${id}`,
      jobInfoData
    );
    return response.data;
  },

  /**
   * Delete job info
   */
  deleteJobInfo: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.EMPLOYEE_JOB_INFO}/${id}`);
  },

  /**
   * Set job info as current
   */
  setCurrentJobInfo: async (id: string): Promise<EmployeeJobInfo> => {
    const response = await apiClient.put<ApiResponse<EmployeeJobInfo>>(
      `${API_ENDPOINTS.EMPLOYEE_JOB_INFO}/${id}/set-current`
    );
    return response.data;
  },

  /**
   * Get all employees with job info
   */
  getAllEmployeesWithJobInfo: async (filters?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    designation?: string;
    department?: string;
  }): Promise<EmployeeJobInfoListResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.designation) params.append('designation', filters.designation);
    if (filters?.department) params.append('department', filters.department);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.EMPLOYEE_JOB_INFO}/all?${queryString}`
      : `${API_ENDPOINTS.EMPLOYEE_JOB_INFO}/all`;

    const response = await apiClient.get<ApiResponse<EmployeeJobInfoListResponse>>(endpoint);
    return response.data;
  },
};






