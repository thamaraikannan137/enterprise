import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from '../types/organization';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const departmentService = {
  /**
   * Get all departments
   */
  getDepartments: async (search?: string): Promise<Department[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.DEPARTMENTS}?${queryString}`
      : API_ENDPOINTS.DEPARTMENTS;

    const response = await apiClient.get<ApiResponse<Department[]>>(endpoint);
    return response.data;
  },

  /**
   * Get department by ID
   */
  getDepartmentById: async (id: string): Promise<Department> => {
    const response = await apiClient.get<ApiResponse<Department>>(
      `${API_ENDPOINTS.DEPARTMENTS}/${id}`
    );
    return response.data;
  },

  /**
   * Create new department
   */
  createDepartment: async (
    departmentData: CreateDepartmentInput
  ): Promise<Department> => {
    const response = await apiClient.post<ApiResponse<Department>>(
      API_ENDPOINTS.DEPARTMENTS,
      departmentData
    );
    return response.data;
  },

  /**
   * Update department
   */
  updateDepartment: async (
    id: string,
    departmentData: UpdateDepartmentInput
  ): Promise<Department> => {
    const response = await apiClient.put<ApiResponse<Department>>(
      `${API_ENDPOINTS.DEPARTMENTS}/${id}`,
      departmentData
    );
    return response.data;
  },

  /**
   * Delete department
   */
  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
  },
};






