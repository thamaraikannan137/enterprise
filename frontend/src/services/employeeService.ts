import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  Employee,
  EmployeeWithDetails,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeFilters,
  EmployeeListResponse,
} from '../types/employee';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const employeeService = {
  /**
   * Get all employees with pagination and filters
   */
  getEmployees: async (filters?: EmployeeFilters): Promise<EmployeeListResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.EMPLOYEES}?${queryString}`
      : API_ENDPOINTS.EMPLOYEES;

    const response = await apiClient.get<ApiResponse<EmployeeListResponse>>(endpoint);
    return response.data;
  },

  /**
   * Get employee by ID
   */
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await apiClient.get<ApiResponse<Employee>>(
      `${API_ENDPOINTS.EMPLOYEES}/${id}`
    );
    return response.data;
  },

  /**
   * Get employee with all related details
   */
  getEmployeeWithDetails: async (id: string): Promise<EmployeeWithDetails> => {
    const response = await apiClient.get<ApiResponse<EmployeeWithDetails>>(
      `${API_ENDPOINTS.EMPLOYEES}/${id}/details`
    );
    return response.data;
  },

  /**
   * Create new employee
   */
  createEmployee: async (employeeData: CreateEmployeeInput): Promise<Employee> => {
    const response = await apiClient.post<ApiResponse<Employee>>(
      API_ENDPOINTS.EMPLOYEES,
      employeeData
    );
    return response.data;
  },

  /**
   * Update employee
   */
  updateEmployee: async (
    id: string,
    employeeData: UpdateEmployeeInput
  ): Promise<Employee> => {
    const response = await apiClient.put<ApiResponse<Employee>>(
      `${API_ENDPOINTS.EMPLOYEES}/${id}`,
      employeeData
    );
    return response.data;
  },

  /**
   * Delete employee (soft delete - sets status to terminated)
   */
  deleteEmployee: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
  },
};

